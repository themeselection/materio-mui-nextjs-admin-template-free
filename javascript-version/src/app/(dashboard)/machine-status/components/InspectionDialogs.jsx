'use client'

/*
======== ファイル概要 ========
点検進捗入力と点検周期変更のダイアログコンポーネント群。ローカルストレージとAPI連携のUI層を提供する。
*/

import { useEffect, useMemo, useState } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'

import { formatYmdSlash } from '../utils/date'

/**
 * 点検チェックリストを表示し、完了操作を親へ通知する。
 * @param   {object}    props            - コンポーネント引数。
 * @param   {boolean}   props.open       - ダイアログ開閉フラグ。
 * @param   {Function}  props.onClose    - 閉じる時のハンドラー。
 * @param   {Function}  props.onComplete - 点検完了時のハンドラー。
 * @returns {JSX.Element}                - 点検ダイアログのJSX要素。
 */
export function InspectionDialog({ open, onClose, onComplete }) {
    const STORAGE_KEY = 'machine-status:inspection-progress'

    const inspectionItems = useMemo(() => [
        { id: 'chk1', label: '安全カバーに異常なし' },
        { id: 'chk2', label: '非常停止ボタンの動作確認' },
        { id: 'chk3', label: '潤滑油レベル適正' },
        { id: 'chk4', label: 'センサー清掃済み' },
        { id: 'chk5', label: 'ボルト・ナットの緩みなし' },
    ], [])

    const [checkedMap, setCheckedMap] = useState({})
    // ======== 初期化ステップ: ダイアログ開時に進捗を復元 ========
    useEffect(() => {
        if (open) {
            // 開いたときにローカルストレージから復元（なければ初期化）
            let stored = {}

            try {
                const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null

                if (raw) stored = JSON.parse(raw) || {}
            } catch (e) {
                stored = {}
            }

            const init = {}

            inspectionItems.forEach((it) => { init[it.id] = Boolean(stored[it.id]) })
            setCheckedMap(init)
        }
    }, [open, inspectionItems])

    const allChecked = inspectionItems.length > 0 && inspectionItems.every((it) => checkedMap[it.id])

    const persist = (map) => {
        try {
            if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
        } catch (e) {
            // 書き込み失敗はUIに影響しないため黙殺（ignore write errors）
        }
    }

    const toggleCheck = (id) => setCheckedMap((prev) => {
        const next = { ...prev, [id]: !prev[id] }

        persist(next)

        return next
    })

    const checkAll = () => {
        const m = {}

        inspectionItems.forEach((it) => { m[it.id] = true })
        setCheckedMap(m)
        persist(m)
    }

    const resetProgress = () => {
        const m = {}

        inspectionItems.forEach((it) => { m[it.id] = false })
        setCheckedMap(m)

        try {
            if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY)
        } catch (e) {
            // 削除失敗も無害なのでそのまま（ignore）
        }
    }

    const handleComplete = () => {
        // 進捗クリアは親で成功時に実施する（API連携時の失敗に備える）
        onComplete()
    }

    // ======== 描画ステップ: チェックリストと操作ボタンの提示 ========
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
            <DialogTitle>点検</DialogTitle>
            <DialogContent dividers>
                <Typography variant='body2' color='text.secondary' mb={2}>
                    ダミーの点検項目です。すべてチェックしてから「点検完了」を押してください。
                </Typography>
                <FormGroup>
                    {inspectionItems.map((item) => (
                        <FormControlLabel
                            key={item.id}
                            control={<Checkbox checked={!!checkedMap[item.id]} onChange={() => toggleCheck(item.id)} />}
                            label={item.label}
                        />
                    ))}
                </FormGroup>
                <Box mt={1}>
                    <Button size='small' onClick={checkAll}>すべてチェック</Button>
                    <Button size='small' color='secondary' onClick={resetProgress} sx={{ ml: 1 }}>進捗をリセット</Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>キャンセル</Button>
                <Button variant='contained' onClick={handleComplete} disabled={!allChecked}>点検完了</Button>
            </DialogActions>
        </Dialog>
    )
}

/**
 * 点検周期を入力させるためのダイアログ。
 * @param   {object}    props                     - コンポーネント引数。
 * @param   {boolean}   props.open                - ダイアログ開閉フラグ。
 * @param   {Function}  props.onClose             - 閉じる時のハンドラー。
 * @param   {number}    props.value               - 現在の点検間隔（日）。
 * @param   {Function}  props.onChange            - 値変更ハンドラー。
 * @param   {Date}      props.nextInspectionDate  - 次回点検日。
 * @param   {Function}  props.onSave              - 保存ハンドラー。
 * @param   {boolean}   [props.saving=false]      - 保存処理中フラグ。
 * @returns {JSX.Element}                         - 点検期間ダイアログのJSX要素。
 */
export function IntervalDialog({ open, onClose, value, onChange, nextInspectionDate, onSave, saving = false }) {
    // ======== 描画ステップ: 入力 → 次回日表示 → 操作ボタン ========
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='xs'>
            <DialogTitle>点検期間の変更</DialogTitle>
            <DialogContent dividers>
                <Typography variant='body2' color='text.secondary' mb={2}>
                    何日ごとに点検を行うかを設定できます（フロントのみ・ダミー）。
                </Typography>
                <TextField
                    type='number'
                    label='点検間隔（日）'
                    value={value}
                    onChange={(e) => {
                        const v = Math.max(1, Number(e.target.value || 1))

                        onChange(v)
                    }}
                    inputProps={{ min: 1 }}
                    fullWidth
                />
                <Box mt={2}>
                    <Typography variant='caption' color='text.secondary'>
                        次回点検日: {formatYmdSlash(nextInspectionDate)}
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>キャンセル</Button>
                <Button variant='contained' onClick={() => (onSave ? onSave(value) : onClose())} disabled={saving}>
                    {saving ? '保存中…' : '保存'}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
