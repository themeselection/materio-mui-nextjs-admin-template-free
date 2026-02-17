"use client"

/*
======== ファイル概要 ========
工場設定ページ。権限ロールと生産ラインを管理し、API 経由で CRUD 操作とローカル UI を同期させる。
*/

import { useEffect, useMemo, useState, useCallback } from 'react'


// MUI Components
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'

// MUI Icons
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined'

import useAuthMe from '@core/hooks/useAuthMe'

// 型の簡易表現
const ADMIN = '管理者'
const MEMBER = '一般従業員'

// API ヘルパー
/**
 * ブラウザストレージからアクセストークンを取得する。
 * @returns {string | null} - 発見したトークン。未ログイン時は null。
 */
function getToken() {
	if (typeof window === 'undefined') return null

	try {
		return (
			window.localStorage.getItem('access_token') ||
			window.sessionStorage.getItem('access_token') ||
			null
		)
	} catch {
		return null
	}
}

/**
 * 認証ヘッダー付きでバックエンド API を叩く共通関数。
 * @param {string} path                              - /api から始まるリクエストパス。
 * @param {object} [options={}]                      - fetch オプション。
 * @param {string} [options.method='GET']            - HTTP メソッド。
 * @param {object} [options.body]                    - JSON 化するリクエストボディ。
 * @param {object} [options.headers]                 - 追加ヘッダー。認証ヘッダーより後にマージされる。
 * @returns {Promise<any>}                           - JSON レスポンス。204 の場合は null。
 * @throws {Error & { status?: number, payload?: any }} - ステータスやレスポンスを含む例外。
 */
async function api(path, { method = 'GET', body, headers } = {}) {
	const token = getToken()
	const base = process.env.NEXT_PUBLIC_BASE_PATH || ''

	const res = await fetch(`${base}${path}`, {
		method,
		headers: {
			...(body ? { 'Content-Type': 'application/json' } : {}),
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...headers,
		},
		body: body ? JSON.stringify(body) : undefined,
	})

	if (!res.ok) {
		let payload = null

		try {
			payload = await res.json()
		} catch {
			try {
				payload = await res.text()
			} catch {
				payload = null
			}
		}

		const err = new Error('Request failed')

		err.status = res.status
		err.payload = payload
		throw err
	}

	if (res.status === 204) return null

	return res.json()
}

/**
 * 権限ロール 1 件分の表示と編集インタラクションを司るアイテム。
 * @param {object}   props           - コンポーネント引数。
 * @param {object}   props.role      - 表示対象のロール情報。
 * @param {Function} props.onUpdate  - ロール更新時に親へ通知するコールバック。
 * @param {Function} props.onDelete  - ロール削除要求を親へ伝えるコールバック。
 * @param {boolean}  props.canEdit   - 編集操作の可否。
 * @returns {JSX.Element}            - ロール設定用のカード要素。
 */
function RoleItem({ role, onUpdate, onDelete, canEdit }) {
	const [editing, setEditing] = useState(false)
	const [nameDraft, setNameDraft] = useState(role.name)

	const isAdminType = role.type === ADMIN

	// 管理者種別ボタンでタイプを切り替える。実際の更新は親に委譲する。
	const handleToggleType = () => {
		if (!canEdit) return
		const nextType = isAdminType ? MEMBER : ADMIN

		onUpdate({ ...role, type: nextType })
	}

	// 編集開始時は元の名前を一度ドラフトに取り込み直す。
	const startEdit = () => {
		if (!canEdit) return
		setNameDraft(role.name)
		setEditing(true)
	}

	// 取り消し時は UI を元に戻し、誤編集を防ぐ。
	const cancelEdit = () => {
		setEditing(false)
		setNameDraft(role.name)
	}

	// ======== 処理ステップ: 入力トリム → 変更有無判定 → 更新通知 ========
	// 1. 入力トリムで余分な空白を除去し、同一名重複による API エラーを抑える。
	// 2. 変更有無判定で noop 更新を省き、不要なリクエストを避ける。
	// 3. 更新通知で親に委譲し、API 呼び出しとステート同期を一箇所にまとめる。
	const saveEdit = () => {
		const trimmed = nameDraft.trim()

		if (!trimmed) return cancelEdit()
		if (trimmed === role.name) return cancelEdit()
		onUpdate({ ...role, name: trimmed })
		setEditing(false)
	}

	return (
		<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'action.hover', borderRadius: 1, p: 1.5 }}>
			<Stack direction="row" spacing={1.5} alignItems="center">
				<Avatar variant="rounded" sx={{ bgcolor: 'background.paper', color: 'text.secondary', boxShadow: 0 }}>
					<ShieldOutlinedIcon fontSize="small" />
				</Avatar>
				{!editing ? (
					<Typography className="text-gray-800" fontWeight={600}>{role.name}</Typography>
				) : (
					<TextField
						size="small"
						value={nameDraft}
						onChange={e => setNameDraft(e.target.value)}
						onKeyDown={e => {
							if (e.key === 'Enter') saveEdit()
							if (e.key === 'Escape') cancelEdit()
						}}
						onBlur={cancelEdit}
						placeholder="ロール名"
					/>
				)}
			</Stack>

			<Stack direction="row" spacing={1.5} alignItems="center">
				{!editing && (
					<Button
						onClick={handleToggleType}
						size="small"
						variant="outlined"
						color={isAdminType ? 'primary' : 'inherit'}
						startIcon={isAdminType ? <AdminPanelSettingsOutlinedIcon /> : <PersonOutlineOutlinedIcon />}
						sx={{ minWidth: 120 }}
						disabled={!canEdit}
					>
						{isAdminType ? ADMIN : MEMBER}
					</Button>
				)}

				{!editing ? (
					<Stack direction="row" spacing={0.5}>
						{canEdit && (
							<IconButton size="small" color="default" onClick={startEdit}>
								<EditOutlinedIcon fontSize="small" />
							</IconButton>
						)}
						{canEdit && (
							<IconButton size="small" color="error" onClick={onDelete}>
								<DeleteOutlineOutlinedIcon fontSize="small" />
							</IconButton>
						)}
					</Stack>
				) : (
					<Stack direction="row" spacing={0.5}>
						<IconButton size="small" color="success" onClick={saveEdit}>
							<CheckOutlinedIcon fontSize="small" />
						</IconButton>
						<IconButton size="small" color="error" onClick={cancelEdit}>
							<CloseOutlinedIcon fontSize="small" />
						</IconButton>
					</Stack>
				)}
			</Stack>
		</Box>
	)
}

/**
 * ライン情報 1 件分の表示と改名/削除を制御するアイテム。
 * @param {object}   props          - コンポーネント引数。
 * @param {object}   props.line     - 表示対象ライン。
 * @param {Function} props.onRename - 名前変更時に親へ渡すハンドラ。
 * @param {Function} props.onDelete - 削除要求を親へ伝えるハンドラ。
 * @param {boolean}  props.canEdit  - 編集可否。
 * @returns {JSX.Element}           - ライン設定 UI。
 */
function LineItem({ line, onRename, onDelete, canEdit }) {
	const [editing, setEditing] = useState(false)
	const [draft, setDraft] = useState(line.name)

	// 編集開始時は現在値を改めてコピーし、別ライン名の上書きを防ぐ。
	const startEdit = () => {
		if (!canEdit) return
		setDraft(line.name)
		setEditing(true)
	}

	// キャンセルではドラフトを元へ戻し、フォーム残留を避ける。
	const cancelEdit = () => {
		setEditing(false)
		setDraft(line.name)
	}

	// ======== 処理ステップ: 入力トリム → 変更判定 → 親コールバック ========
	// 1. 入力トリムで余白を除去し、重複判定の正確さを担保する。
	// 2. 変更判定で同一名なら即キャンセルし、不必要な API 呼び出しを抑制する。
	// 3. 親コールバックへ渡して API 側で最終確定する。
	const saveEdit = () => {
		const trimmed = draft.trim()

		if (!trimmed) return cancelEdit()
		if (trimmed === line.name) return cancelEdit()
		onRename(trimmed)
		setEditing(false)
	}

	return (
		<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'action.hover', borderRadius: 1, p: 1.5 }}>
			<Stack direction="row" spacing={1.5} alignItems="center">
				<Avatar variant="rounded" sx={{ bgcolor: 'background.paper', color: 'text.secondary', boxShadow: 0 }}>
					<PrecisionManufacturingOutlinedIcon fontSize="small" />
				</Avatar>
				{!editing ? (
					<Typography className="text-gray-700">{line.name}</Typography>
				) : (
					<TextField
						size="small"
						value={draft}
						onChange={e => setDraft(e.target.value)}
						onKeyDown={e => {
							if (e.key === 'Enter') saveEdit()
							if (e.key === 'Escape') cancelEdit()
						}}
						onBlur={cancelEdit}
						placeholder="ライン名"
					/>
				)}
			</Stack>

			{!editing ? (
				<Stack direction="row" spacing={0.5}>
					{canEdit && (
						<IconButton size="small" color="default" onClick={startEdit}>
							<EditOutlinedIcon fontSize="small" />
						</IconButton>
					)}
					{canEdit && (
						<IconButton size="small" color="error" onClick={onDelete}>
							<DeleteOutlineOutlinedIcon fontSize="small" />
						</IconButton>
					)}
				</Stack>
			) : (
				<Stack direction="row" spacing={0.5}>
					<IconButton size="small" color="success" onClick={saveEdit}>
						<CheckOutlinedIcon fontSize="small" />
					</IconButton>
					<IconButton size="small" color="error" onClick={cancelEdit}>
						<CloseOutlinedIcon fontSize="small" />
					</IconButton>
				</Stack>
			)}
		</Box>
	)
}

/**
 * 工場設定ページのメインコンポーネント。
 * @returns {JSX.Element} - 権限種別と工場ラインの管理 UI。
 */
export default function FactorySettingsPage() {
	// --- ステート ---
	const { isAdmin } = useAuthMe()
	const [roles, setRoles] = useState([])
	const [newRoleName, setNewRoleName] = useState('')
	const [newRoleType, setNewRoleType] = useState(MEMBER)
	const [rolesLoading, setRolesLoading] = useState(false)

	const [lines, setLines] = useState([]) // { id, name }
	const [newLineName, setNewLineName] = useState('')
	const [linesLoading, setLinesLoading] = useState(false)

	const [snack, setSnack] = useState({ open: false, severity: 'info', message: '' })

	/**
	 * トースト通知を開くヘルパー。
	 * @param {string} message                                             - 表示する本文。
	 * @param {import('@mui/material').AlertColor} [severity='info']        - 表示色。
	 * @returns {void}
	 */
	const openSnack = useCallback((message, severity = 'info') => setSnack({ open: true, message, severity }), [])

	/**
	 * トースト通知を閉じるヘルパー。
	 * @returns {void}
	 */
	const closeSnack = useCallback(() => setSnack(s => ({ ...s, open: false })), [])

	const roleNames = useMemo(() => new Set(roles.map(r => r.name)), [roles])
	const lineNames = useMemo(() => new Set(lines.map(l => l.name)), [lines])

	// --- 初期ロード ---
	useEffect(() => {
		// ======== 処理ステップ: 役割取得 → ライン取得 → クリーンアップ ========
		// 1. 役割取得では管理者区別を明確にして UI の制御を整える。
		// 2. ライン取得でフィルタ候補と表示一覧を揃え、フォーム初期値の整合性を保つ。
		// 3. どちらも個別の非同期関数にして、失敗時に片方だけでも結果を出せるようにする。
		;

		(async () => {
			setRolesLoading(true)

			try {
				const data = await api('/api/roles')

				setRoles(
					(Array.isArray(data) ? data : []).map(r => ({ id: r.role_id, name: r.role_name, type: r.is_admin ? ADMIN : MEMBER }))
				)
			} catch (e) {
				openSnack(`権限一覧の取得に失敗しました (${e.status || ''})`, 'error')
			} finally {
				setRolesLoading(false)
			}
		})()

		;(async () => {
			setLinesLoading(true)

			try {
				const data = await api('/api/lines')

				setLines((Array.isArray(data) ? data : []).map(l => ({ id: l.line_id, name: l.line_name })))
			} catch (e) {
				openSnack(`ライン一覧の取得に失敗しました (${e.status || ''})`, 'error')
			} finally {
				setLinesLoading(false)
			}
		})()
	}, [openSnack])

	// --- 役割 CRUD ---
	const addRole = async () => {
		// 管理者以外には書き込みを許さないため即ガードする。
		if (!isAdmin) {
			openSnack('権限がありません（管理者のみ操作可能）', 'warning')
			return
		}

		const name = newRoleName.trim()

		// 空文字は API でも拒否されるため早期終了で UX を保つ。
		if (!name) return

		// 名前重複はサーバーで 409 になるため、事前に弾いてメッセージを明示する。
		if (roleNames.has(name)) {
			openSnack('同じロール名が既に存在します', 'warning')
			return
		}

		// ======== 処理ステップ: API 送信 → ステート更新 → フォーム初期化 ========
		// 1. API 送信で確定させ、作成 ID を受け取る。
		// 2. ステート更新でローカル一覧へ即反映し、ページリロードを不要にする。
		// 3. フォーム初期化で連続入力しやすくする。
		try {
			const created = await api('/api/roles', {
				method: 'POST',
				body: { role_name: name, is_admin: newRoleType === ADMIN },
			})

			setRoles(prev => [...prev, { id: created.role_id, name: created.role_name, type: created.is_admin ? ADMIN : MEMBER }])
			setNewRoleName('')
			setNewRoleType(MEMBER)
			openSnack('ロールを追加しました', 'success')
		} catch (e) {
			if (e.status === 409) openSnack('ロール名が重複しています', 'warning')
			else openSnack('ロールの追加に失敗しました', 'error')
		}
	}

	const updateRole = async updated => {
		// 管理者のみ更新できるため、UI からも保護する。
		if (!isAdmin) {
			openSnack('権限がありません（管理者のみ操作可能）', 'warning')
			return
		}

		const original = roles.find(r => r.id === updated.id)

		if (!original) return
		const body = {}

		// フィールド差分だけ送信し、不要な更新を避ける。
		if (updated.name !== original.name) body.role_name = updated.name
		if (updated.type !== original.type) body.is_admin = updated.type === ADMIN
		if (Object.keys(body).length === 0) return

		// ======== 処理ステップ: API 更新 → ステート差し替え → 通知 ========
		// 1. API 更新で確定させ、最新値を受け取る。
		// 2. ステート差し替えで対象のみ更新し、再描画コストを抑える。
		// 3. 通知で完了を知らせ、ユーザーの安心感を高める。
		try {
			const res = await api(`/api/roles/${updated.id}`, { method: 'PUT', body })
			const mapped = { id: res.role_id, name: res.role_name, type: res.is_admin ? ADMIN : MEMBER }

			setRoles(prev => prev.map(r => (r.id === mapped.id ? mapped : r)))
			openSnack('ロールを更新しました', 'success')
		} catch (e) {
			if (e.status === 404) openSnack('対象のロールが見つかりません', 'warning')
			else if (e.status === 409) openSnack('ロール名が重複しています', 'warning')
			else openSnack('ロールの更新に失敗しました', 'error')
		}
	}

	const deleteRole = async id => {
		// 削除も管理者専用のため即ガード。
		if (!isAdmin) {
			openSnack('権限がありません（管理者のみ操作可能）', 'warning')
			return
		}

		// ======== 処理ステップ: API 削除 → ローカル除去 → 通知 ========
		// 1. API 削除でサーバー状態を先に確定させる。
		// 2. ローカル除去で UI を同期し、残骸表示を防ぐ。
		// 3. 通知で結果を共有し、関連制約時の警告をわかりやすくする。
		try {
			await api(`/api/roles/${id}`, { method: 'DELETE' })
			setRoles(prev => prev.filter(r => r.id !== id))
			openSnack('ロールを削除しました', 'success')
		} catch (e) {
			if (e.status === 409) openSnack('関連データがあり削除できません', 'warning')
			else openSnack('ロールの削除に失敗しました', 'error')
		}
	}

	// --- ライン CRUD ---
	const addLine = async () => {
		// 管理者のみライン構成を変更できる。
		if (!isAdmin) {
			openSnack('権限がありません（管理者のみ操作可能）', 'warning')
			return
		}

		const name = newLineName.trim()

		// 空文字を送ると API エラーになるため早期離脱。
		if (!name) return

		// 事前重複チェックで 409 を未然に防ぎ、即フィードバックを返す。
		if (lineNames.has(name)) {
			openSnack('同じライン名が既に存在します', 'warning')
			return
		}

		// ======== 処理ステップ: API 追加 → ステート更新 → 入力リセット ========
		try {
			const created = await api('/api/lines', { method: 'POST', body: { line_name: name } })

			setLines(prev => [...prev, { id: created.line_id, name: created.line_name }])
			setNewLineName('')
			openSnack('ラインを追加しました', 'success')
		} catch (e) {
			if (e.status === 409) openSnack('ライン名が重複しています', 'warning')
			else openSnack('ラインの追加に失敗しました', 'error')
		}
	}

	const renameLine = async (id, newName) => {
		// 閲覧権限では改名できないためガード。
		if (!isAdmin) {
			openSnack('権限がありません（管理者のみ操作可能）', 'warning')
			return
		}

		if (!newName) return

		// 既存ラインと同名にしないことで情報齟齬を避ける。
		if (lineNames.has(newName)) {
			openSnack('同じライン名が既に存在します', 'warning')
			return
		}

		// ======== 処理ステップ: API 更新 → ステート置換 → 通知 ========
		try {
			const res = await api(`/api/lines/${id}`, { method: 'PUT', body: { line_name: newName } })

			setLines(prev => prev.map(l => (l.id === id ? { id: res.line_id, name: res.line_name } : l)))
			openSnack('ライン名を更新しました', 'success')
		} catch (e) {
			if (e.status === 404) openSnack('対象のラインが見つかりません', 'warning')
			else if (e.status === 409) openSnack('ライン名が重複しています', 'warning')
			else openSnack('ライン名の更新に失敗しました', 'error')
		}
	}

	const deleteLine = async id => {
		// 管理権限がない場合は API を呼ばない。
		if (!isAdmin) {
			openSnack('権限がありません（管理者のみ操作可能）', 'warning')
			return
		}

		// ======== 処理ステップ: API 削除 → 一覧同期 → 通知 ========
		try {
			await api(`/api/lines/${id}`, { method: 'DELETE' })
			setLines(prev => prev.filter(l => l.id !== id))
			openSnack('ラインを削除しました', 'success')
		} catch (e) {
			openSnack('ラインの削除に失敗しました', 'error')
		}
	}

	return (
		<Box className="container mx-auto p-4 sm:p-6 lg:p-8">
			<Grid container spacing={6}>
				{/* 権限種別管理 */}
				<Grid item xs={12} md={6}>
					<Card>
						<CardHeader
											avatar={
												<Avatar sx={theme => ({ bgcolor: theme.palette.primary.main, color: theme.palette.primary.contrastText })}>
													<AdminPanelSettingsOutlinedIcon />
												</Avatar>
											}
							title={<Typography fontWeight={700}>権限種別管理</Typography>}
						/>
						<Divider />
						<CardContent>
							<Stack spacing={1.25}>
								{roles.map(role => (
									<RoleItem
										key={role.id}
										role={role}
										onUpdate={updateRole}
										onDelete={() => deleteRole(role.id)}
										canEdit={isAdmin}
									/>
								))}
							</Stack>

											<Stack
												direction="row"
												spacing={1.5}
												mt={3}
												alignItems="center"
												sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}
											>
												<TextField
													size="small"
													label="ロール名を入力"
													placeholder="例: 閲覧のみ"
													value={newRoleName}
													onChange={e => setNewRoleName(e.target.value)}
													onKeyDown={e => {
														if (e.key === 'Enter') addRole()
													}}
													sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 240 } }}
													disabled={!isAdmin}
												/>
												<Button
													variant="outlined"
													color={newRoleType === ADMIN ? 'primary' : 'inherit'}
													startIcon={newRoleType === ADMIN ? <AdminPanelSettingsOutlinedIcon /> : <PersonOutlineOutlinedIcon />}
													onClick={() => setNewRoleType(prev => (prev === ADMIN ? MEMBER : ADMIN))}
													sx={{ minWidth: { xs: '100%', sm: 140 }, flexShrink: 0, whiteSpace: 'nowrap' }}
													disabled={!isAdmin}
												>
													{newRoleType}
												</Button>
												<Button variant="contained" onClick={addRole} sx={{ minWidth: { xs: '100%', sm: 96 }, flexShrink: 0, whiteSpace: 'nowrap' }} disabled={!isAdmin}>
													追加
												</Button>
											</Stack>
						</CardContent>
					</Card>
				</Grid>

				{/* 工場ライン管理 */}
				<Grid item xs={12} md={6}>
					<Card>
						<CardHeader
											avatar={
												<Avatar sx={theme => ({ bgcolor: theme.palette.success.main, color: theme.palette.success.contrastText })}>
													<PrecisionManufacturingOutlinedIcon />
												</Avatar>
											}
							title={<Typography fontWeight={700}>工場ライン管理</Typography>}
						/>
						<Divider />
						<CardContent>
							<Stack spacing={1.25}>
								{lines.map((line) => (
									<LineItem
										key={line.id}
										line={line}
										onRename={newName => renameLine(line.id, newName)}
										onDelete={() => deleteLine(line.id)}
										canEdit={isAdmin}
									/>
								))}
							</Stack>

											<Stack
												direction="row"
												spacing={1.5}
												mt={3}
												alignItems="center"
												sx={{ flexWrap: { xs: 'wrap', sm: 'nowrap' } }}
											>
												<TextField
													size="small"
													label="新しいライン名"
													placeholder="例: Cライン"
													value={newLineName}
													onChange={e => setNewLineName(e.target.value)}
													onKeyDown={e => {
														if (e.key === 'Enter') addLine()
													}}
													sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 240 } }}
													disabled={!isAdmin}
												/>
												<Button variant="contained" onClick={addLine} sx={{ minWidth: { xs: '100%', sm: 96 }, flexShrink: 0, whiteSpace: 'nowrap' }} disabled={!isAdmin}>
													追加
												</Button>
											</Stack>
						</CardContent>
					</Card>
				</Grid>
			</Grid>

			{!isAdmin && (
				<Box sx={{ mt: 3 }}>
					<Alert severity="info" variant="outlined">現在は閲覧専用です。編集するには管理者権限でサインインしてください。</Alert>
				</Box>
			)}

				<Snackbar open={snack.open} autoHideDuration={3000} onClose={closeSnack} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
					<Alert onClose={closeSnack} severity={snack.severity} sx={{ width: '100%' }}>
						{snack.message}
					</Alert>
				</Snackbar>
		</Box>
	)
}

