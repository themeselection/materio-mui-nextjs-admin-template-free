"use client"

/*
======== ファイル概要 ========
従業員名簿ページのクライアントコンポーネント。検索・フィルタ・CRUD 操作を統合し、API 呼び出しと UI 更新を橋渡しする。
*/

import { useState, useEffect, useMemo, useRef } from 'react'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Fab from '@mui/material/Fab'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import AddIcon from '@mui/icons-material/Add'

import useAuthMe from '@core/hooks/useAuthMe'

import EmployeeCard from './components/EmployeeCard'
import FiltersBar from './components/FiltersBar'
import EmployeeFormDialog from './components/EmployeeFormDialog'
import { getAuthHeaders, ensureHash, stripHash } from './utils/api'

const statusOptions = [
  { value: 'all', label: 'すべて' },
  { value: '在籍中', label: '在籍中' },
  { value: '退職済', label: '退職済' }
]

/**
 * 氏名を「姓 名」形式に整形するためのユーティリティ。
 * @param {string} ln         - 姓。空文字の場合は名のみを返す。
 * @param {string} fn         - 名。空文字の場合は姓のみを返す。
 * @returns {string}          - スペース区切りの氏名。両方空なら空文字。
 */
const getDisplayName = (ln, fn) => {
  const l = String(ln || '').trim()
  const f = String(fn || '').trim()

  if (!l && !f) return ''

  return f ? `${l} ${f}` : l
}

/**
 * 従業員名簿のトップレベルコンポーネント。
 * @returns {JSX.Element} - 従業員カードと管理用ダイアログを含む UI ツリー。
 */
const EmployeeList = () => {
  const [employees, setEmployees] = useState([])
  const [employeesLoading, setEmployeesLoading] = useState(false)
  const [employeesError, setEmployeesError] = useState(null)
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('all')
  const [status, setStatus] = useState('all')
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const { isAdmin } = useAuthMe()
  const apiBase = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const debounceTimer = useRef(null)

  // Register と同様のフォーム構成
  const [form, setForm] = useState({
    employeeUserId: '',
    lastName: '',
    firstName: '',
    password: '',
    roleId: '', // number | ''
    lineId: '', // number | ''
    status: '在籍中',
    specialNotes: '',
    iconColor: '#FF8800'
  })

  // Password 表示切替
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  /**
   * パスワード表示状態を切り替える。入力確認の利便性向上が目的。
   * @returns {void}
   */
  const handleClickShowPassword = () => setIsPasswordShown(s => !s)

  // マスタ（役割／ライン）
  const [roles, setRoles] = useState([])
  const [lines, setLines] = useState([])
  const [loadingRoles, setLoadingRoles] = useState(true)
  const [loadingLines, setLoadingLines] = useState(true)
  const [editingEmployeeId, setEditingEmployeeId] = useState(null) // numeric employee_id for PUT/DELETE

  // サーバー側でフィルタ済みを取得するため、そのまま表示
  const filtered = employees

  // スナックバー（通知）
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  /**
   * 操作結果をスナックバーで表示する。
  * @param {string}                                    message              - 表示する本文。
  * @param {import('@mui/material').AlertColor} [severity='success']        - スナックバーのステータス色。
   * @returns {void}
   */
  const showSnack = (message, severity = 'success') => setSnackbar({ open: true, message, severity })

  /**
   * スナックバーを閉じる。
   * @returns {void}
   */
  const closeSnack = () => setSnackbar(s => ({ ...s, open: false }))

  // メニュー
  /**
   * メニュー表示用に対象従業員とアンカー要素を記録する。
   * @param {import('react').MouseEvent<HTMLButtonElement>} e         - クリックイベント。
   * @param {object}                                      employee         - 操作対象の従業員。
   * @returns {void}
   */
  const handleMenuClick = (e, employee) => {
    setMenuAnchor(e.currentTarget)
    setSelectedEmployee(employee)
  }

  /**
   * メニュー表示状態と選択中従業員を初期化する。
   * @returns {void}
   */
  const handleMenuClose = () => {
    setMenuAnchor(null)
    setSelectedEmployee(null)
  }

  // モーダル
  /**
   * 追加用モーダルを初期値で開く。
   * @returns {void}
   */
  const openAddModal = () => {
    if (!isAdmin) return
    setForm(prev => ({
      employeeUserId: '',
      lastName: '',
      firstName: '',
      password: '',
      roleId: roles.length > 0 ? (roles.find(r => r?.role_name === '一般')?.role_id ?? roles[0]?.role_id ?? '') : '',
      lineId: '',
      status: '在籍中',
      specialNotes: '',
      iconColor: '#FF8800'
    }))
    setIsPasswordShown(false)
    setEditingEmployeeId(null)
    setModalOpen(true)
  }

  /**
   * 編集用モーダルを既存従業員値で開く。
   * @returns {void}
   */
  const openEditModal = () => {
    if (!isAdmin) return

    if (selectedEmployee) {
      // 氏名を姓/名に分割（最初のスペースで分割）
      const name = String(selectedEmployee.name || '').trim()
      const [ln, ...rest] = name.split(/\s+/)
      const fn = rest.join(' ')

      // 役割ID/ラインID を名称から推測
      const roleId = roles.find(r => r?.role_name === selectedEmployee.role)?.role_id ?? ''
      const lineId = lines.find(l => l?.line_name === selectedEmployee.department)?.line_id ?? ''

      setForm({
        employeeUserId: selectedEmployee.id || '',
        lastName: ln || '',
        firstName: fn || '',
        password: '', // 既存編集では未入力
        roleId: roleId === 0 ? 0 : roleId || '',
        lineId: lineId === 0 ? 0 : lineId || '',
        status: selectedEmployee.status || '在籍中',
        specialNotes: selectedEmployee.notes || '',
        iconColor: selectedEmployee.iconColor || '#FF8800'
      })
      setIsPasswordShown(false)
      setEditingEmployeeId(selectedEmployee.employeeId ?? null)
      setModalOpen(true)
      handleMenuClose()
    }
  }

  /**
   * モーダルを閉じる。
   * @returns {void}
   */
  const closeModal = () => setModalOpen(false)

  // フォーム
  /**
   * フォーム入力をステートへ反映する。
   * @param {import('react').ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} e - 入力イベント。
   * @returns {void}
   */
  const handleFormChange = e => {
    const { name, value } = e.target

    if (name === 'roleId' || name === 'lineId') {
      const v = value === '' ? '' : (typeof value === 'number' ? value : Number(value))

      setForm(prev => ({ ...prev, [name]: v }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  // 保存
  /**
   * フォームデータを API に送信し従業員を保存する。
   * @returns {Promise<void>} - 保存完了後は一覧を再取得する。
   */
  const handleSave = async () => {
    if (!isAdmin) return

    // 最小バリデーション
    const requiredOk = form.employeeUserId && form.lastName && form.firstName
    const rolesOk = roles.length > 0 ? (form.roleId !== '' && form.roleId !== null && form.roleId !== undefined) : true

    if (!requiredOk || !rolesOk) return // API 側で 400 を返す前に早期離脱し、フィードバック遅延を防ぐため。

    const displayName = getDisplayName(form.lastName, form.firstName)

    const payload = {
      employee_name: displayName,
      employee_user_id: form.employeeUserId,
      password: form.password ? form.password : (editingEmployeeId ? null : ''),
      role_id: form.roleId,

      // line_id は未選択時は送らない
      ...(form.lineId === '' ? {} : { line_id: form.lineId }),
      color_code: stripHash(form.iconColor || '#FF8800'),
      special_notes: form.specialNotes || '',

      // 在籍状況
      ...(typeof form.status === 'string' ? { is_active: form.status === '在籍中' } : {})
    }

    // ======== 処理ステップ: バリデーション確認 → API 呼び出し → 一覧更新 ========
    // 1. バリデーション確認では API で弾かれる前に必須入力をチェックし、ユーザー体験の悪化を防ぐ。
    // 2. API 呼び出しは PUT/POST を分岐し、既存編集時はパスワードを空送信しない理由を明示する。
    // 3. 一覧更新で再フェッチしダイアログを閉じ、最新状態を即座に反映させる。

    try {
      const headers = { 'Content-Type': 'application/json', ...getAuthHeaders() }

      if (editingEmployeeId) {
        // 更新（PUT）
        const res = await fetch(`${apiBase}/api/employees/${editingEmployeeId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload)
        })

        if (!res.ok) throw new Error(`PUT /employees/${editingEmployeeId} ${res.status}`)
      } else {
        // 追加（POST）: password 必須
        if (!form.password) throw new Error('パスワードを入力してください') // 新規作成時は認証に必要となるため必須扱い。

        const res = await fetch(`${apiBase}/api/employees`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        })

        if (!res.ok) throw new Error(`POST /employees ${res.status}`)
      }


      // 再取得
      await fetchEmployees()
      setModalOpen(false)
      showSnack(editingEmployeeId ? '従業員情報を更新しました' : '従業員を追加しました', 'success')
    } catch (e) {
      console.error(e)
      const msg = e?.message || String(e)

      showSnack(`保存に失敗しました: ${msg}`, 'error')
    }
  }

  // 削除
  /**
   * 選択中の従業員を削除する。
   * @returns {Promise<void>} - 削除後に一覧を再取得し通知する。
   */
  const handleDelete = async () => {
    if (!isAdmin) return
    if (!selectedEmployee?.employeeId) return

    // ======== 処理ステップ: API 呼び出し → 一覧再取得 → 通知とクリーンアップ ========
    // 1. API 呼び出しで認証ヘッダーを添付し、204 No Content も成功として扱う。
    // 2. 一覧再取得で UI を同期させ、削除済みカードが残る問題を防ぐ。
    // 3. 通知とクリーンアップで結果を共有しメニューを閉じる。

    try {
      const headers = { ...getAuthHeaders() }
      const res = await fetch(`${apiBase}/api/employees/${selectedEmployee.employeeId}`, { method: 'DELETE', headers })

      if (!res.ok && res.status !== 204) throw new Error(`DELETE /employees/${selectedEmployee.employeeId} ${res.status}`)
      await fetchEmployees()
      showSnack('従業員を削除しました', 'success')
    } catch (e) {
      console.error(e)
      const msg = e?.message || String(e)

      showSnack(`削除に失敗しました: ${msg}`, 'error')
    } finally {
      handleMenuClose()
    }
  }

  // UI パレットはフォームダイアログ内に移動

  // マスタ取得（ロール／ライン）
  useEffect(() => {
    // ======== 処理ステップ: AbortController 準備 → ロール取得 → ライン取得 → クリーンアップ ========
    // 1. AbortController 準備でアンマウント時に通信を中断し、不要な警告を避ける。
    // 2. ロール取得でモーダルのセレクト初期値を整え、手入力の手間を省く。
    // 3. ライン取得で部署セレクトとフィルタ候補を揃え、整合性を保つ。
    // 4. クリーンアップで fetch を中断し、メモリリークを防ぐ。
    const ac = new AbortController()

    const headers = { ...getAuthHeaders() }

      // Roles
      ;(async () => {
        try {
          setLoadingRoles(true)
          const res = await fetch(`${apiBase}/api/roles`, { signal: ac.signal, headers })

          if (res.ok) {
            const data = await res.json()
            const list = Array.isArray(data) ? data : (Array.isArray(data?.roles) ? data.roles : [])

            setRoles(list)

            // 既存選択を優先し、なければ「一般」→先頭→空
            setForm(prev => {
              const keep = prev.roleId

              if ((keep || keep === 0) && list.some(r => r?.role_id === keep)) return prev
              const general = list.find(r => r?.role_name === '一般')?.role_id

              return { ...prev, roleId: general ?? list[0]?.role_id ?? '' }
            })
          } else {
            setRoles([])
          }
        } catch (e) {
          setRoles([])
        } finally {
          setLoadingRoles(false)
        }
      })()

      // Lines
      ;(async () => {
        try {
          setLoadingLines(true)
          const res = await fetch(`${apiBase}/api/lines`, { signal: ac.signal, headers })

          if (res.ok) {
            const data = await res.json()
            const list = Array.isArray(data) ? data : (Array.isArray(data?.lines) ? data.lines : [])

            setLines(list)

            // 既存選択がリストにない場合は空
            setForm(prev => {
              const keep = prev.lineId

              if ((keep || keep === 0) && list.some(l => l?.line_id === keep)) return prev

              return { ...prev, lineId: '' }
            })
          } else {
            setLines([])
          }
        } catch (e) {
          setLines([])
        } finally {
          setLoadingLines(false)
        }
      })()

    return () => ac.abort()
  }, [apiBase])

  /**
   * 部署（ライン）フィルタの選択肢を生成する。
   * @returns {Array<{ value: string, label: string }>} - セレクトボックス用のオプション。
   */
  const departmentOptions = useMemo(() => {
    const opts = [{ value: 'all', label: 'すべて' }]

    lines.forEach(l => {
      if (l?.line_name) opts.push({ value: l.line_name, label: l.line_name })
    })

    return opts
  }, [lines])

  /**
   * API レスポンスを UI 表示用オブジェクトへ整形する。
   * @param {object} apiItem - API から取得した従業員データ。
   * @returns {object}       - カード描画用の整形済みデータ。
   */
  const mapEmployee = apiItem => ({
    employeeId: apiItem?.employee_id,
    id: apiItem?.employee_user_id, // 表示用ID
    employeeUserId: apiItem?.employee_user_id,
    name: apiItem?.employee_name,
    department: apiItem?.line_name || '',
    role: apiItem?.role_name || '',
    status: apiItem?.is_active ? '在籍中' : '退職済',
    notes: apiItem?.special_notes || '',
    iconColor: ensureHash(apiItem?.color_code)
  })

  /**
   * 検索条件に合わせて従業員一覧を取得する。
   * @returns {Promise<void>} - 取得結果をステートへ反映する。
   */
  const fetchEmployees = async () => {
    const headers = { ...getAuthHeaders() }
    const sp = new URLSearchParams()

    if (search?.trim()) sp.set('name_like', search.trim())
    if (department !== 'all') sp.set('line_name', department)
    if (status !== 'all') sp.set('is_active', String(status === '在籍中'))
    const url = `${apiBase}/api/employees${sp.toString() ? `?${sp.toString()}` : ''}`

    try {
      setEmployeesLoading(true)
      setEmployeesError(null)
      const res = await fetch(url, { headers })

      if (!res.ok) throw new Error(`GET /employees ${res.status}`)
      const data = await res.json()

      const list = Array.isArray(data)
        ? data
        : (Array.isArray(data?.employees) ? data.employees : [])

      setEmployees(list.map(mapEmployee))
    } catch (e) {
      console.error(e)
      setEmployeesError(e)
      setEmployees([])
      showSnack('従業員の取得に失敗しました。時間をおいて再度お試しください。', 'error')
    } finally {
      setEmployeesLoading(false)
    }
  }

  // フィルタ変更時に再取得（検索はデバウンス）
  useEffect(() => {
    // ======== 処理ステップ: タイマー初期化 → API 呼び出し予約 → タイマー掃除 ========
    // 1. タイマー初期化で連続入力による過剰呼び出しを防ぐ。
    // 2. API 呼び出し予約で 350ms 後に fetch を実行し、検索体験を滑らかにする。
    // 3. タイマー掃除で依存変更・アンマウント時の不要実行を抑える。
    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      fetchEmployees()
    }, 350)

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, department, status])

  return (
    <>
      <Typography variant='h4' sx={{ mb: 4, fontWeight: 700 }}>従業員名簿</Typography>

      <FiltersBar
        search={search}
        setSearch={setSearch}
        department={department}
        setDepartment={setDepartment}
        status={status}
        setStatus={setStatus}
        departmentOptions={departmentOptions}
        statusOptions={statusOptions}
      />

      {/* 従業員リスト（カードグリッド） */}
      <Grid container spacing={3}>
        {filtered.length === 0 ? (
          <Grid item xs={12}>
            <Card sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant='h6' color='text.secondary' sx={{ mb: 1 }}>
                {employeesLoading ? '読み込み中…' : '該当する従業員が見つかりませんでした。'}
              </Typography>
              <Typography variant='body2' color='text.disabled'>
                {employeesError ? 'データの取得に失敗しました。時間をおいて再度お試しください。' : '検索条件を変更して、もう一度お試しください。'}
              </Typography>
            </Card>
          </Grid>
        ) : (
          filtered.map(emp => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={emp.id}>
              <EmployeeCard employee={emp} onMenuClick={handleMenuClick} canEdit={isAdmin} />
            </Grid>
          ))
        )}
      </Grid>

      {/* フローティング追加ボタン */}
      {isAdmin ? (
        <Fab color='primary' aria-label='add' sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1000 }} onClick={openAddModal}>
          <AddIcon fontSize='large' />
        </Fab>
      ) : null}

      {/* ドロップダウンメニュー */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
        <MenuItem onClick={openEditModal} disabled={!isAdmin}>編集</MenuItem>
        <MenuItem onClick={handleDelete} disabled={!isAdmin} sx={{ color: !isAdmin ? undefined : 'error.main' }}>削除</MenuItem>
      </Menu>

      <EmployeeFormDialog
        open={modalOpen}
        onClose={closeModal}
        form={form}
        setForm={setForm}
        roles={roles}
        lines={lines}
        loadingRoles={loadingRoles}
        loadingLines={loadingLines}
        isPasswordShown={isPasswordShown}
        togglePasswordShown={handleClickShowPassword}
        onSave={handleSave}
        employees={employees}
      />

      {/* 通知スナックバー */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnack}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeSnack} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default EmployeeList
