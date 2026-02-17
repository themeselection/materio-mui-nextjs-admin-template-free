"use client";

import { useEffect, useMemo, useState, useCallback } from 'react'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

/*
======== ファイル概要 ========
レガシーHTML側から提供されるモーダルAPIをMUIダイアログへ委譲する受け皿。
Reactコンポーネントとして常駐させ、windowに公開した関数経由で表示・非表示を制御する。
*/

// レガシーDOM文字列モーダルをMUIダイアログへ橋渡しするコンポーネント (Bridge for legacy DOM-string modals to Materio (MUI) Dialog)
// window からの利用方法 (Usage from window):
//   window.__pi_openModal({ title, html, actions: [{id,label,color}], onOpen, maxWidth })
//   window.__pi_closeModal()

/**
 * レガシーUIからの命令を受け、MUIダイアログを表示する。
 * @returns {JSX.Element}   レガシーアプリとReact側を接続するモーダルブリッジコンポーネント。
 */
export default function ModalBridge() {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState('')
    const [html, setHtml] = useState('')
    const [actions, setActions] = useState([])
    const [maxWidth, setMaxWidth] = useState('sm')
    const [onOpen, setOnOpen] = useState(null)

    // ======== 処理ステップ: グローバルAPI公開準備 → onOpenコールバック実行制御 ========
    // 1. handleCloseでモーダル状態と内容をリセットし、レガシーの再呼び出しでも前回内容を引きずらないようにする。
    // 2. useEffectでwindowに公開するAPIをセットし、React環境下でもレガシースクリプトをそのまま動かせるようにする。
    // 3. 別のuseEffectでモーダル表示後のDOM確定タイミングに合わせてonOpenコールバックを呼び出す。

    const handleClose = useCallback(() => {
        setOpen(false)

        // 念のため内容も空にして再利用時の表示崩れを防ぐ (also clear content for safety)
        setTitle('')
        setHtml('')
        setActions([])
        setOnOpen(null)
    }, [])

    useEffect(() => {
        // グローバル関数をwindowへエクスポートし、レガシースクリプトから同一APIで呼び出せるようにする
        window.__pi_openModal = ({ title = '', html = '', actions = [], maxWidth = 'sm', onOpen = null } = {}) => {
            setTitle(title)
            setHtml(html)
            setActions(actions)
            setMaxWidth(maxWidth)
            setOnOpen(() => onOpen)
            setOpen(true)
        }

        window.__pi_closeModal = handleClose

        // ブリッジ準備が整ったことをレガシー側へ通知
        window.__pi_modal_ready = true
        try { window.dispatchEvent(new CustomEvent('pi:modal-ready')) } catch { }

        
return () => {
            if (window.__pi_openModal === undefined) return
            delete window.__pi_modal_ready
            delete window.__pi_openModal
            delete window.__pi_closeModal
        }
    }, [handleClose])

    // コンテンツが挿入されダイアログが開いた後にonOpenを呼ぶ (call onOpen after content injected and dialog open)
    useEffect(() => {
        if (open && typeof onOpen === 'function') {
            // DOM反映を待つために次フレームで実行する (next tick to ensure content in DOM)
            const id = requestAnimationFrame(() => onOpen())

            
return () => cancelAnimationFrame(id)
        }
    }, [open, onOpen])

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth={maxWidth} scroll='paper'>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px' }}>
                <DialogTitle sx={{ p: 0 }}>{title}</DialogTitle>
                <IconButton aria-label='close' onClick={handleClose} size='small'>
                    <CloseIcon />
                </IconButton>
            </div>
            <DialogContent dividers>
                {/* eslint-disable-next-line react/no-danger */}
                <div dangerouslySetInnerHTML={{ __html: html }} />
            </DialogContent>
            {actions?.length ? (
                <DialogActions>
                    {actions.map(a => (
                        <Button key={a.id || a.label} color={a.color || 'primary'} variant={a.variant || 'contained'} onClick={() => a.onClick?.()}>
                            {a.label}
                        </Button>
                    ))}
                </DialogActions>
            ) : null}
        </Dialog>
    )
}
