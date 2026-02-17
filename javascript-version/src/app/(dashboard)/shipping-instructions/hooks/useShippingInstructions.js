/*
======== ファイル概要 ========
このファイルは「製造出荷指示」画面向けのカスタムフックを提供します。画面で必要となる状態管理、API 通
信、フィルタリング、モーダル表示、レコードの作成/更新/削除、完了トグルといった一連の機能を集約してい
ます。
*/

/**
 * Instruction レコードの型定義（簡易）
 * @typedef {Object} Instruction
 * @property {string|number} id 一意なID
 * @property {string} title 表示用のタイトル（productName+size の合成が入る場合あり）
 * @property {string} [productName] 製品名
 * @property {string} [size] サイズ
 * @property {string} line ライン名
 * @property {boolean} completed 完了フラグ
 * @property {string} [remarks] 備考
 * @property {string} [note] 備考（レガシー互換）
 * @property {string} [color] 色
 * @property {string} [shippingMethod] 出荷方法
 * @property {string} [destination] 出荷先
 * @property {string} [includedItems] 同梱物
 * @property {string} [springType] バネ種別
 * @property {number} [quantity] 数量
 * @property {string} [createdAt] 作成日時のISO文字列（タイムゾーンオフセット付き推奨）
 */

/**
 * フックの state セクション（呼び出し側が直接参照する読み書き状態）
 * @typedef {Object} HookState
 * @property {Instruction[]} instructions 表示中の指示リスト
 * @property {('local'|'api')} dataSource データ取得元（ローカルデータ/サーバAPI）
 * @property {boolean} loading 指示リストの取得中フラグ
 * @property {string|null} error 直近の失敗メッセージ
 * @property {string|null} lastFetchedAt 最終取得時刻（ISO文字列）
 * @property {number} reloadTick 取得再実行のトリガー（インクリメント用）
 * @property {string} search フリーテキスト検索
 * @property {string} line ラインフィルタ（'すべて'で無効）
 * @property {('all'|'completed'|'not-completed')} completed 完了状態フィルタ
 * @property {string} date 日付フィルタ（YYYY-MM-DD）
 * @property {boolean} modalOpen 編集/作成モーダルの開閉
 * @property {Instruction} form フォーム入力値
 * @property {boolean} editMode 編集モード（false の場合は新規作成）
 * @property {boolean} saving 保存処理中
 * @property {Array<any>} lines ライン候補（API `/api/lines` の生データ）
 * @property {boolean} loadingLines ライン候補取得中
 * @property {string[]} availableDates 選択可能日付の配列（YYYY-MM-DD）
 * @property {{date:string,count:number|null}[]} availableDateItems 日付と件数の一覧
 * @property {boolean} loadingDates 日付候補取得中
 * @property {boolean} deleteOpen 削除確認モーダル開閉
 * @property {boolean} deleting 削除処理中
 * @property {Instruction|null} targetToDelete 削除対象
 * @property {boolean} confirmOpen 完了解除の確認モーダル開閉
 * @property {string|number|null} pendingToggleId 完了解除の保留対象ID
 * @property {boolean} calendarOpen 日付選択モーダルの開閉
 */

/**
 * 派生値（メモ化済）
 * @typedef {Object} HookDerived
 * @property {Instruction[]} filtered 表示用にフィルタ済みの指示
 * @property {boolean} canPrev 前の日付へ移動可能か
 * @property {boolean} canNext 次の日付へ移動可能か
 */

/**
 * 呼び出し側が利用するアクション（イベントハンドラ）
 * @typedef {Object} HookActions
 * @property {(source:'local'|'api')=>void} setDataSource データソース切替
 * @property {(v:string)=>void} setSearch 検索語設定
 * @property {(v:string)=>void} setLine ライン設定
 * @property {(v:'all'|'completed'|'not-completed')=>void} setCompleted 完了状態フィルタ設定
 * @property {(v:string)=>void} setDate 日付設定（YYYY-MM-DD）
 * @property {(v:boolean)=>void} setModalOpen 編集/作成モーダル開閉
 * @property {(v:Instruction)=>void} setForm フォーム値の直接セット
 * @property {(v:boolean)=>void} setEditMode 編集モード切替
 * @property {(v:boolean)=>void} setDeleteOpen 削除モーダル開閉
 * @property {(v:Instruction|null)=>void} setTargetToDelete 削除対象指定
 * @property {()=>void} handlePrevDate 前日へ移動
 * @property {()=>void} handleNextDate 翌日へ移動
 * @property {(id:string|number,clientX?:number,clientY?:number)=>void} handleToggleComplete 完了トグル（未完了→完了は即時反映、完了→未完了は確認有り）
 * @property {()=>void} confirmRevert 完了→未完了への確定（確認モーダルOK）
 * @property {()=>void} cancelRevert 完了→未完了の取り消し（確認モーダルCancel）
 * @property {(inst:Instruction)=>void} handleEdit 既存指示の編集開始
 * @property {(inst:Instruction)=>void} handleRequestDelete 削除リクエスト（確認モーダルを開く）
 * @property {()=>void} handleCancelDelete 削除のキャンセル
 * @property {()=>Promise<void>} handleConfirmDelete 削除の確定
 * @property {()=>void} handleAdd 新規作成モーダルを開く
 * @property {()=>Promise<void>} handleSave 作成/更新の保存
 * @property {(e:import('react').ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>)=>void} handleFormChange フォーム入力ハンドラ
 * @property {(v:boolean)=>void} setCalendarOpen カレンダーモーダル開閉
 */

/**
 * フックの戻り値
 * @typedef {Object} UseShippingInstructionsReturn
 * @property {HookState} state 画面にバインドする状態
 * @property {HookDerived} derived 画面表示用の派生値
 * @property {HookActions} actions イベントハンドラ群
 */

// 状態管理・API通信・フィルタリング・イベントハンドラをカスタムフック

// 必要なReactフックや外部ライブラリをインポート
import { useEffect, useMemo, useRef, useState } from 'react'
import confetti from 'canvas-confetti'

// ユーティリティ関数や初期データをインポート
import { normalizeInstruction, formatLocalYmd, toOffsetIso, toLocalYmd } from '../utils'
import { initialInstructions, lineOptions, completedOptions } from '../data/sampleInitialInstructions'

/**
 * 製造出荷指示の一覧・編集に必要な状態/処理をまとめたカスタムフック。
 * - API バックエンド（/api/*）からの取得/作成/更新/削除
 * - ローカル（モック）データでの動作
 * - ライン/完了状態/日付/フリーテキストのフィルタリング
 * - 編集/削除/完了トグルのイベントハンドリング
 * を提供します。
 *
 * 注意:
 * - dataSource が 'api' の場合のみネットワーク呼び出しを行います。
 * - レスポンスフォーマットはユーティリティ `normalizeInstruction` で正規化してから利用します。
 *
 * @returns {UseShippingInstructionsReturn}
 */
export default function useShippingInstructions() {
    // 状態管理用のuseStateフック
    const [instructions, setInstructions] = useState(() => initialInstructions.map(normalizeInstruction)) // 指示データの状態を管理
    const [dataSource, setDataSource] = useState('api') // データソースの選択 ('local' または 'api')
    const [loading, setLoading] = useState(false) // ローディング状態
    const [error, setError] = useState(null) // エラーメッセージ
    const [lastFetchedAt, setLastFetchedAt] = useState(null) // 最後にデータを取得した日時
    const [reloadTick, setReloadTick] = useState(0) // 再読み込み用のトリガー
    const [search, setSearch] = useState('') // 検索キーワード
    const [line, setLine] = useState('すべて') // ラインフィルター
    const [completed, setCompleted] = useState('all') // 完了状態フィルター
    const [date, setDate] = useState(() => formatLocalYmd()) // 日付フィルター
    const initialDateRef = useRef(null)
    if (initialDateRef.current === null) {
        initialDateRef.current = date
    }
    const [modalOpen, setModalOpen] = useState(false) // モーダルの開閉状態
    const [form, setForm] = useState({ id: '', productName: '', size: '', title: '', line: 'マット', completed: false, remarks: '', color: '', shippingMethod: '', destination: '', includedItems: '', springType: '', quantity: 1 }) // フォームデータ
    const [editMode, setEditMode] = useState(false) // 編集モードのフラグ
    const [saving, setSaving] = useState(false) // 保存中の状態

    // ライン選択肢の状態管理
    const [lines, setLines] = useState([]) // ラインの選択肢を管理
    const [loadingLines, setLoadingLines] = useState(false) // ラインデータ取得中の状態

    // 利用可能な日付の状態管理
    const [availableDates, setAvailableDates] = useState([]) // 利用可能な日付のリスト
    const [availableDateItems, setAvailableDateItems] = useState([]) // 日付とそのカウントを管理
    const [loadingDates, setLoadingDates] = useState(false) // 日付データ取得中の状態

    // 削除確認モーダルの状態管理
    const [deleteOpen, setDeleteOpen] = useState(false) // 削除モーダルの開閉状態
    const [deleting, setDeleting] = useState(false) // 削除処理中の状態
    const [targetToDelete, setTargetToDelete] = useState(null) // 削除対象のデータ

    // 完了状態の確認モーダルの状態管理
    const [confirmOpen, setConfirmOpen] = useState(false) // 完了状態変更の確認モーダル
    const [pendingToggleId, setPendingToggleId] = useState(null) // 完了状態変更対象のID

    // データ取得用のuseEffect
    // - dataSource が 'api' のとき、現在のフィルタ条件（検索, ライン, 完了状態, 日付）をクエリに変換し
    //   /api/instructions に GET アクセスします。
    // - レスポンスの配列（または data/items）を `normalizeInstruction` 経由で正規化します。
    useEffect(() => {
        if (dataSource !== 'api') {
            // ローカルデータを使用する場合の処理
            setError(null)
            setLoading(false)
            setInstructions(initialInstructions.map(normalizeInstruction))
            setLines([])
            return
        }

        const controller = new AbortController()
        const run = async () => {
            try {
                setLoading(true)
                setError(null)

                // APIエンドポイントの構築
                const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
                const params = new URLSearchParams()
                if (search && search.trim()) params.set('q', search.trim())
                if (line && line !== 'すべて') params.set('line', line)
                if (completed === 'completed') params.set('is_completed', 'true')
                else if (completed === 'not-completed') params.set('is_completed', 'false')
                if (date) params.set('date', date)

                const url = `${base}/api/instructions${params.toString() ? `?${params.toString()}` : ''}`
                const res = await fetch(url, {
                    method: 'GET',
                    signal: controller.signal
                })

                if (!res.ok) {
                    let detail = ''
                    try { detail = (await res.text())?.slice(0, 200) } catch { }
                    throw new Error(`APIエラー (${res.status}) ${detail}`)
                }

                const json = await res.json()
                const list = Array.isArray(json) ? json : (json?.data || json?.items || [])
                if (!Array.isArray(list)) throw new Error('APIのレスポンス形式が不正です')

                setInstructions(list.map(normalizeInstruction)) // 正規化した指示データを状態にセット
                setLastFetchedAt(new Date().toISOString()) // 最終取得日時を更新
            } catch (e) {
                if (e?.name === 'AbortError') return
                setError(e?.message || 'データ取得に失敗しました')
            } finally {
                setLoading(false)
            }
        }

        run()
        return () => controller.abort()
    }, [dataSource, reloadTick, search, line, completed, date])

    // ライン選択肢を取得するuseEffect
    // - `/api/lines` から候補を取得します。サーバーの応答形は一定でない可能性があるため、
    //   配列または data/items のいずれかに対応しています。
    useEffect(() => {
        if (dataSource !== 'api') return
        const controller = new AbortController()
        const run = async () => {
            try {
                setLoadingLines(true)
                const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
                const res = await fetch(`${base}/api/lines`, { method: 'GET', signal: controller.signal })
                if (!res.ok) { setLines([]); return }
                const json = await res.json()
                const list = Array.isArray(json) ? json : (json?.data || json?.items || [])
                setLines(Array.isArray(list) ? list : []) // ラインデータを状態にセット
            } catch (e) {
                if (e?.name === 'AbortError') return
                setLines([])
            } finally {
                setLoadingLines(false)
            }
        }
        run()
        return () => controller.abort()
    }, [dataSource])

    // 利用可能な日付を取得するuseEffect
    // - `/api/instructions/available-dates` から日付と件数を取得し、
    //   [{ date: 'YYYY-MM-DD', count: number|null }, ...] の形式に正規化します。
    useEffect(() => {
        if (dataSource !== 'api') return
        const controller = new AbortController()
        const run = async () => {
            try {
                setLoadingDates(true)
                const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
                const params = new URLSearchParams()
                if (line && line !== 'すべて') params.set('line', line)
                if (completed === 'completed') params.set('is_completed', 'true')
                else if (completed === 'not-completed') params.set('is_completed', 'false')
                params.set('order', 'asc')

                const url = `${base}/api/instructions/available-dates${params.toString() ? `?${params.toString()}` : ''}`
                const res = await fetch(url, { method: 'GET', signal: controller.signal })
                if (!res.ok) { setAvailableDates([]); return }
                const json = await res.json()
                const list = Array.isArray(json) ? json : (json?.data || json?.items || [])
                // 仕様変更対応: [{ date: 'YYYY-MM-DD', count: number }] を想定
                const items = Array.isArray(list) ? list : []
                const normalized = items.map(item => {
                    if (typeof item === 'string') return { date: item, count: null }
                    if (item && typeof item === 'object') return { date: String(item.date || ''), count: typeof item.count === 'number' ? item.count : null }
                    return { date: '', count: null }
                }).filter(i => i.date)
                const asc = normalized.sort((a, b) => String(a.date).localeCompare(String(b.date)))
                setAvailableDateItems(asc) // 正規化した日付データを状態にセット
                setAvailableDates(asc.map(i => i.date)) // 日付リストを状態にセット
            } catch (e) {
                if (e?.name === 'AbortError') return
                setAvailableDateItems([])
                setAvailableDates([])
            } finally {
                setLoadingDates(false)
            }
        }
        run()
        return () => controller.abort()
    }, [dataSource, line, completed, reloadTick])

    // 初回表示時に、今日にもっとも近い利用可能日を自動選択（DB基準）
    useEffect(() => {
        if (dataSource !== 'api') return
        if (!availableDateItems.length) return
        if (date !== initialDateRef.current) return

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const candidates = availableDateItems
            .map(item => {
                const candidateDate = item?.date
                if (!candidateDate) return null
                const parsed = new Date(`${candidateDate}T00:00:00`)
                if (Number.isNaN(parsed.getTime())) return null
                const time = parsed.getTime()
                return {
                    date: candidateDate,
                    time,
                    diff: Math.abs(time - today.getTime()),
                    isFuture: time >= today.getTime()
                }
            })
            .filter(Boolean)

        if (!candidates.length) return

        candidates.sort((a, b) => {
            if (a.diff !== b.diff) return a.diff - b.diff
            if (a.isFuture !== b.isFuture) return a.isFuture ? -1 : 1
            if (a.isFuture) return a.time - b.time
            return b.time - a.time
        })

        const closest = candidates[0]
        if (closest && closest.date !== date) {
            setDate(closest.date)
        }
    }, [availableDateItems, dataSource, date])

    // 日付ナビゲーション
    // - 現在の日付が availableDates に含まれない場合でも、
    //   直近の前/後ろの日付へ移動できるように判定を行う。
    //   例) availableDates = [01, 03], date = 02 のとき
    //       prev = 01, next = 03 を有効にする。
    const currentIndex = availableDates.findIndex(d => d === date)
    let prevIndex = -1
    let nextIndex = -1
    if (currentIndex !== -1) {
        // ちょうど一致
        prevIndex = currentIndex - 1
        nextIndex = currentIndex + 1
    } else if (availableDates.length > 0 && date) {
        // 挿入位置（初めて date より大きい位置）を探索し、そこを next とみなす
        const firstGreaterIdx = availableDates.findIndex(d => String(d).localeCompare(String(date)) > 0)
        if (firstGreaterIdx === -1) {
            // すべて date 以下 → 最後が prev で next は無し
            prevIndex = availableDates.length - 1
            nextIndex = -1
        } else {
            // 見つかった位置が next、その一つ前が prev（存在すれば）
            nextIndex = firstGreaterIdx
            prevIndex = firstGreaterIdx - 1
        }
    }
    const canPrev = prevIndex >= 0 && prevIndex < availableDates.length
    const canNext = nextIndex >= 0 && nextIndex < availableDates.length
    const handlePrevDate = () => { if (canPrev) setDate(availableDates[prevIndex]) }
    const handleNextDate = () => { if (canNext) setDate(availableDates[nextIndex]) }

    // ローカルデータモードではクライアント側でフィルタリング。
    // APIモードではサーバから絞り込まれた結果が返る想定のため、そのまま表示します。
    const filtered = useMemo(() => {
        if (dataSource === 'api') return instructions
        return instructions.filter(inst => {
            const searchText = search.toLowerCase()
            const textMatch = !searchText ||
                inst.title.toLowerCase().includes(searchText) ||
                (inst.destination && inst.destination.toLowerCase().includes(searchText)) ||
                (inst.remarks && inst.remarks.toLowerCase().includes(searchText)) ||
                (inst.note && inst.note.toLowerCase().includes(searchText))
            const lineMatch = line === 'すべて' || inst.line === line
            let completedMatch = true
            if (completed === 'completed') completedMatch = inst.completed
            else if (completed === 'not-completed') completedMatch = !inst.completed
            const dateMatch = !date || (inst.createdAt && toLocalYmd(inst.createdAt).startsWith(date))
            return textMatch && lineMatch && completedMatch && dateMatch
        })
    }, [dataSource, instructions, search, line, completed, date])

    // 完了状態をサーバに反映する補助関数（失敗時はエラー表示とロールバック）
    const updateCompletionOnServer = async (id, comp) => {
        if (dataSource !== 'api' || !id) return
        try {
            setError(null)
            const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
            const res = await fetch(`${base}/api/instructions/${encodeURIComponent(id)}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_completed: comp })
            })
            if (!res.ok) {
                let detail = ''
                try { detail = (await res.text())?.slice(0, 200) } catch { }
                throw new Error(`更新に失敗しました (${res.status}) ${detail}`)
            }
            let updated = null
            try { updated = await res.json() } catch { }
            if (updated) {
                setInstructions(prev => prev.map(inst => inst.id === id ? normalizeInstruction(updated) : inst))
            }
        } catch (e) {
            setError(e?.message || '完了状態の更新に失敗しました')
            setInstructions(prev => prev.map(inst => inst.id === id ? { ...inst, completed: !comp } : inst))
        }
    }

    /**
     * 完了トグルハンドラ。
     * - 未完了→完了：即時にローカル反映し、紙吹雪アニメーションを再生。並行してサーバ更新。
     * - 完了→未完了：安全のため確認モーダルを開き、確定は `confirmRevert` で行う。
     * @param {string|number} id 変更対象ID
     * @param {number} [clientX] クリック位置X（紙吹雪の原点補正に使用）
     * @param {number} [clientY] クリック位置Y（紙吹雪の原点補正に使用）
     */
    const handleToggleComplete = (id, clientX, clientY) => {
        const target = instructions.find(i => i.id === id)
        if (!target) return
        if (!target.completed) {
            setInstructions(prev => prev.map(inst => inst.id === id ? { ...inst, completed: true } : inst))
            let originX = 0.5
            let originY = 0.2
            if (typeof clientX === 'number' && typeof clientY === 'number') {
                originX = Math.min(Math.max(clientX / window.innerWidth, 0), 1)
                originY = Math.min(Math.max(clientY / window.innerHeight, 0), 1)
            }
            try { confetti({ particleCount: 150, spread: 80, origin: { x: originX, y: originY } }) } catch { }
            updateCompletionOnServer(id, true)
        } else {
            setPendingToggleId(id)
            setConfirmOpen(true)
        }
    }

    // 完了→未完了の確定と取消（モーダル操作）
    const confirmRevert = () => {
        if (pendingToggleId == null) return
        const id = pendingToggleId
        // 先にローカルへ反映
        setInstructions(prev => prev.map(inst => inst.id === id ? { ...inst, completed: false } : inst))
        setPendingToggleId(null)
        setConfirmOpen(false)
        // サーバーへも反映（失敗時は updateCompletionOnServer 内でロールバック）
        updateCompletionOnServer(id, false)
    }
    const cancelRevert = () => { setPendingToggleId(null); setConfirmOpen(false) }

    // 編集開始・削除開始
    const handleEdit = inst => { setForm(inst); setEditMode(true); setModalOpen(true) }
    const handleRequestDelete = inst => { setTargetToDelete(inst); setDeleteOpen(true) }
    const handleCancelDelete = () => { setTargetToDelete(null); setDeleteOpen(false) }

    // 削除の確定（API/ローカルそれぞれに対応）
    const handleConfirmDelete = async () => {
        if (!targetToDelete) return
        const id = targetToDelete.id
        if (!id && dataSource === 'api') { setTargetToDelete(null); setDeleteOpen(false); return }
        if (dataSource === 'api') {
            try {
                setDeleting(true)
                setError(null)
                const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
                const res = await fetch(`${base}/api/instructions/${encodeURIComponent(id)}`, { method: 'DELETE' })
                if (!res.ok) {
                    let detail = ''
                    try { detail = (await res.text())?.slice(0, 200) } catch { }
                    throw new Error(`削除に失敗しました (${res.status}) ${detail}`)
                }
                setInstructions(prev => prev.filter(i => i.id !== id))
            } catch (e) {
                setError(e?.message || '削除に失敗しました')
            } finally {
                setDeleting(false)
                setTargetToDelete(null)
                setDeleteOpen(false)
            }
        } else {
            setInstructions(prev => prev.filter(i => i.id !== id))
            setTargetToDelete(null)
            setDeleteOpen(false)
        }
    }

    // 新規追加開始（ライン初期値は API モード時に候補の先頭、ローカル時は 'マット'）
    const handleAdd = () => {
        const defaultLine = (dataSource === 'api' && lines?.length > 0)
            ? (lines[0]?.line_name || '')
            : 'マット'
        setForm({ id: '', productName: '', size: '', title: '', line: defaultLine, completed: false, remarks: '', color: '', shippingMethod: '', destination: '', includedItems: '', springType: '', quantity: 1 })
        setEditMode(false)
        setModalOpen(true)
    }

    // 作成/更新の保存（API/ローカルに対応）
    const handleSave = async () => {
        if (!form.productName && !form.title) return
        // 入力がproductName/sizeのときは表示用タイトルを合成
        const computedTitle = form.productName ? ([form.productName, form.size].filter(Boolean).join(' ').trim()) : form.title
        // createdAtはタイムゾーンオフセット付きISO文字列に揃える
        const createdAtIso = toOffsetIso(form.createdAt) || toOffsetIso(new Date())

        const toSave = {
            ...form,
            title: computedTitle,
            productName: form.productName,
            size: form.size,
            springType: form.springType || null,
            includedItems: form.includedItems || form.note || null,
            shippingMethod: form.shippingMethod || null,
            quantity: typeof form.quantity === 'number' ? form.quantity : Number(form.quantity || 0),
            createdAt: createdAtIso
        }

        if (editMode) {
            if (dataSource === 'api') {
                try {
                    setSaving(true)
                    setError(null)
                    const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
                    // 編集前の既存日付(YYYY-MM-DD) と フォームでの指定日付を保持
                    const prevInst = instructions.find(i => i.id === form.id)
                    const prevYmd = toLocalYmd(prevInst?.createdAt)
                    const formYmd = toLocalYmd(toOffsetIso(form.createdAt))
                    const payload = {
                        line: form.line || 'その他',
                        product_name: form.productName || form.title || '',
                        size: form.size || '',
                        quantity: typeof form.quantity === 'number' ? form.quantity : Number(form.quantity || 0),
                        remarks: form.remarks || ''
                    }
                    if (form.color) payload.color = form.color
                    if (form.springType) payload.spring_type = form.springType
                    if (form.includedItems || form.note) payload.included_items = form.includedItems || form.note
                    if (form.shippingMethod) payload.shipping_method = form.shippingMethod
                    if (form.destination) payload.destination = form.destination
                    if (createdAtIso) payload.created_at = createdAtIso

                    const url = `${base}/api/instructions/${encodeURIComponent(form.id)}`
                    if (process.env.NODE_ENV !== 'production') {
                        console.log('[shipping-instructions][update] URL:', url)
                        console.log('[shipping-instructions][update] payload:', payload)
                    }
                    const res = await fetch(url, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    })
                    if (process.env.NODE_ENV !== 'production') {
                        console.log('[shipping-instructions][update] response status:', res.status)
                    }
                    if (!res.ok) {
                        let detail = ''
                        try { detail = (await res.text())?.slice(0, 200) } catch { }
                        if (process.env.NODE_ENV !== 'production') {
                            console.log('[shipping-instructions][update] error body:', detail)
                        }
                        throw new Error(`更新に失敗しました (${res.status}) ${detail}`)
                    }
                    let updated
                    try { updated = await res.json() } catch { updated = null }
                    if (process.env.NODE_ENV !== 'production') {
                        console.log('[shipping-instructions][update] response body:', updated)
                    }
                    const normalized = updated ? normalizeInstruction(updated) : { ...toSave }
                    setInstructions(prev => prev.map(inst => inst.id === form.id ? { ...inst, ...normalized } : inst))
                    setModalOpen(false)
                    // 編集時: ユーザーが日付を変更した場合のみ、その日付ページへ移動
                    const newYmd = toLocalYmd(normalized.createdAt || createdAtIso)
                    if (formYmd && formYmd !== prevYmd) {
                        setDate(newYmd)
                    }
                    setReloadTick(t => t + 1)
                } catch (e) {
                    setError(e?.message || '更新に失敗しました')
                } finally {
                    setSaving(false)
                }
            } else {
                const prevInst = instructions.find(i => i.id === form.id)
                const prevYmd = toLocalYmd(prevInst?.createdAt)
                const formYmd = toLocalYmd(toOffsetIso(form.createdAt))
                const next = { ...toSave }
                setInstructions(prev => prev.map(inst => inst.id === form.id ? { ...inst, ...next } : inst))
                setModalOpen(false)
                const newYmd = toLocalYmd(next.createdAt)
                if (formYmd && formYmd !== prevYmd) {
                    setDate(newYmd)
                }
            }
        } else {
            if (dataSource === 'api') {
                try {
                    setSaving(true)
                    setError(null)
                    const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
                    const payload = {
                        line: form.line || 'その他',
                        product_name: form.productName || form.title || '',
                        size: form.size || '',
                        quantity: typeof form.quantity === 'number' ? form.quantity : Number(form.quantity || 0),
                        remarks: form.remarks || ''
                    }
                    if (form.color) payload.color = form.color
                    if (form.springType) payload.spring_type = form.springType
                    if (form.includedItems || form.note) payload.included_items = form.includedItems || form.note
                    if (form.shippingMethod) payload.shipping_method = form.shippingMethod
                    if (form.destination) payload.destination = form.destination
                    if (createdAtIso) payload.created_at = createdAtIso
                    const url = `${base}/api/instructions`
                    if (process.env.NODE_ENV !== 'production') {
                        console.log('[shipping-instructions][create] URL:', url)
                        console.log('[shipping-instructions][create] payload:', payload)
                    }

                    const res = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    })
                    if (process.env.NODE_ENV !== 'production') {
                        console.log('[shipping-instructions][create] response status:', res.status)
                    }
                    if (!res.ok) {
                        let detail = ''
                        try { detail = (await res.text())?.slice(0, 200) } catch { }
                        if (process.env.NODE_ENV !== 'production') {
                            console.log('[shipping-instructions][create] error body:', detail)
                        }
                        throw new Error(`作成に失敗しました (${res.status}) ${detail}`)
                    }
                    const created = await res.json()
                    if (process.env.NODE_ENV !== 'production') {
                        console.log('[shipping-instructions][create] response body:', created)
                    }
                    let normalized = normalizeInstruction(created)

                    // フォールバック: 作成時に任意項目が無視された場合、直後に PUT で差分を反映
                    try {
                        const patchPayload = {}
                        // 送ったが null/不一致で戻ってきた項目のみパッチ
                        if (payload.color && (created.color == null || created.color !== payload.color)) patchPayload.color = payload.color
                        if (payload.spring_type && (created.spring_type == null || created.spring_type !== payload.spring_type)) patchPayload.spring_type = payload.spring_type
                        if ((payload.included_items ?? null) && (created.included_items == null || created.included_items !== payload.included_items)) patchPayload.included_items = payload.included_items
                        if (payload.shipping_method && (created.shipping_method == null || created.shipping_method !== payload.shipping_method)) patchPayload.shipping_method = payload.shipping_method
                        if (payload.destination && (created.destination == null || created.destination !== payload.destination)) patchPayload.destination = payload.destination
                        // created_at はUTCに正規化されて返る想定のためパッチ対象外

                        const hasPatch = Object.keys(patchPayload).length > 0
                        if (hasPatch) {
                            const patchUrl = `${base}/api/instructions/${encodeURIComponent(created.id)}`
                            if (process.env.NODE_ENV !== 'production') {
                                console.log('[shipping-instructions][create->patch] URL:', patchUrl)
                                console.log('[shipping-instructions][create->patch] payload:', patchPayload)
                            }
                            const patchRes = await fetch(patchUrl, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(patchPayload)
                            })
                            if (process.env.NODE_ENV !== 'production') {
                                console.log('[shipping-instructions][create->patch] response status:', patchRes.status)
                            }
                            if (patchRes.ok) {
                                let patched
                                try { patched = await patchRes.json() } catch { patched = null }
                                if (process.env.NODE_ENV !== 'production') {
                                    console.log('[shipping-instructions][create->patch] response body:', patched)
                                }
                                if (patched) {
                                    normalized = normalizeInstruction(patched)
                                }
                            } else {
                                let patchDetail = ''
                                try { patchDetail = (await patchRes.text())?.slice(0, 200) } catch {}
                                if (process.env.NODE_ENV !== 'production') {
                                    console.warn('[shipping-instructions][create->patch] failed:', patchDetail)
                                }
                            }
                        }
                    } catch (patchErr) {
                        if (process.env.NODE_ENV !== 'production') {
                            console.warn('[shipping-instructions][create->patch] error:', patchErr)
                        }
                    }

                    setInstructions(prev => [...prev, normalized])
                    setModalOpen(false)
                    const ymd = toLocalYmd(normalized.createdAt || createdAtIso)
                    if (ymd) setDate(ymd)
                    setReloadTick(t => t + 1)
                } catch (e) {
                    if (process.env.NODE_ENV !== 'production') {
                        console.error('[shipping-instructions][create] error:', e)
                    }
                    setError(e?.message || '作成に失敗しました')
                } finally {
                    setSaving(false)
                }
            } else {
                const newId = Math.max(...instructions.map(i => i.id), 0) + 1
                const added = { ...toSave, id: newId }
                setInstructions(prev => [...prev, added])
                setModalOpen(false)
                const ymd = toLocalYmd(added.createdAt)
                if (ymd) setDate(ymd)
            }
        }
    }

    /** フォームの共通 onChange ハンドラ（quantity は数値に正規化） */
    const handleFormChange = e => {
        const { name, value } = e.target
        if (name === 'quantity') {
            setForm(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }))
            return
        }
        setForm(prev => ({ ...prev, [name]: value }))
    }

    // Calendar modal state
    const [calendarOpen, setCalendarOpen] = useState(false)

    return {
        state: {
            instructions, dataSource, loading, error, lastFetchedAt, reloadTick, search, line, completed, date,
            modalOpen, form, editMode, saving, lines, loadingLines, availableDates, availableDateItems, loadingDates, deleteOpen, deleting, targetToDelete,
            confirmOpen, pendingToggleId, calendarOpen
        },
        derived: {
            filtered, canPrev, canNext
        },
        actions: {
            setDataSource, setSearch, setLine, setCompleted, setDate, setModalOpen, setForm, setEditMode,
            setDeleteOpen, setTargetToDelete,
            handlePrevDate, handleNextDate,
            handleToggleComplete, confirmRevert, cancelRevert,
            handleEdit, handleRequestDelete, handleCancelDelete, handleConfirmDelete,
            handleAdd, handleSave, handleFormChange,
            setCalendarOpen
        }
    }
}