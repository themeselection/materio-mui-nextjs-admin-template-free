/*
======== ファイル概要 ========
拡大画像をフルスクリーンで表示し、ズーム/パン/ホイール移動を提供するライトボックス実装。
質検モーダルから共通で呼び出され、詳細確認の体験を統一する。
*/

import { useEffect, useRef, useState } from 'react'

import { keyframes } from '@mui/system'
import Box from '@mui/material/Box'

/**
 * ImageLightbox
 * - 前面オーバーレイで画像を表示
 * - クリックで 拡大/縮小 トグル
 * - 拡大中はドラッグでパン可能（手のひらツール風）
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
const FALLBACK_IMG = `${basePath}/images/pages/CameraNotFound.png`

/**
 * ライトボックス本体。マウス操作によるズーム・パンを制御し、フォールバック画像も管理する。
 * @param {object} props                - プロパティ集合。
 * @param {boolean} props.open          - オーバーレイ表示フラグ。
 * @param {string} props.src            - メイン画像URL。
 * @param {string} [props.fallbackSrc]  - メイン失敗時に試す代替URL。
 * @param {string} [props.alt='image']  - 代替テキスト。
 * @param {Function} props.onClose      - 閉じるトリガー。
 * @returns {JSX.Element|null}           表示状態に応じたライトボックス。
 */
const ImageLightbox = ({ open, src, fallbackSrc, alt = 'image', onClose }) => {
  const containerRef = useRef(null)
  const imgRef = useRef(null)
  const [scale, setScale] = useState(1) // 1: フィット, >1: 拡大
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [viewport, setViewport] = useState({ w: 0, h: 0 })
  const [baseSize, setBaseSize] = useState({ w: 0, h: 0 })
  const dragState = useRef({ dragging: false, startX: 0, startY: 0, originX: 0, originY: 0 })
  const [imgNatural, setImgNatural] = useState({ w: 0, h: 0 })
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMG)
  const [dragging, setDragging] = useState(false)
  const [fallbackTried, setFallbackTried] = useState(false)
  const suppressClickRef = useRef(false)
  const moveRaf = useRef(0)
  const [animatePopIn, setAnimatePopIn] = useState(false)

  useEffect(() => {
    if (open) {
      setScale(1)
      setOffset({ x: 0, y: 0 })
      setImgSrc(src || FALLBACK_IMG)
      setFallbackTried(false)
      setImgNatural({ w: 0, h: 0 })
      setBaseSize({ w: 0, h: 0 })
      setAnimatePopIn(true)
    }
  }, [open, src, fallbackSrc])

  useEffect(() => {
    if (!open) return

    const updateViewport = () => {
      const rect = containerRef.current?.getBoundingClientRect()
      setViewport({
        w: rect?.width || window.innerWidth,
        h: rect?.height || window.innerHeight,
      })
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)

    return () => window.removeEventListener('resize', updateViewport)
  }, [open])

  useEffect(() => {
    if (!open) return
    const timer = setTimeout(() => setAnimatePopIn(false), 380)
    return () => clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!open || !imgNatural.w || !imgNatural.h || !viewport.w || !viewport.h) return

    const maxWidth = viewport.w * 0.95
    const maxHeight = viewport.h * 0.9
    const ratio = Math.min(maxWidth / imgNatural.w, maxHeight / imgNatural.h, 1)

    setBaseSize({
      w: imgNatural.w * ratio,
      h: imgNatural.h * ratio,
    })
  }, [open, imgNatural, viewport])

  useEffect(() => {
    const onKey = e => {
      if (!open) return
      if (e.key === 'Escape') onClose?.()
    }

    window.addEventListener('keydown', onKey)

    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  /**
   * オフセットがビューポート外に飛びすぎないよう両端を制限する。
   * @param {number} val - 対象値。
   * @param {number} min - 下限。
   * @param {number} max - 上限。
   * @returns {number}   範囲内へ収めた値。
   */
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val))

  useEffect(() => {
    if (!open) return

    const frameWidth = baseSize.w * scale
    const frameHeight = baseSize.h * scale

    if (!frameWidth || !frameHeight || !viewport.w || !viewport.h) return

    const maxX = Math.max(0, (frameWidth - viewport.w) / 2)
    const maxY = Math.max(0, (frameHeight - viewport.h) / 2)

    setOffset(prev => {
      const nextX = clamp(prev.x, -maxX, maxX)
      const nextY = clamp(prev.y, -maxY, maxY)

      if (nextX === prev.x && nextY === prev.y) return prev

      return { x: nextX, y: nextY }
    })
  }, [open, baseSize, viewport, scale])

  /**
   * 拡大中のフレームでホイールスクロールを使ったパン操作を提供する。
   * @param {WheelEvent} e - ホイールイベント。
   */
  const handleWheel = e => {
    if (!open) return
    e.preventDefault()

    if (scale <= 1 || !viewport.w || !viewport.h || !baseSize.w || !baseSize.h) return

    const frameWidth = baseSize.w * scale
    const frameHeight = baseSize.h * scale
    const maxX = Math.max(0, (frameWidth - viewport.w) / 2)
    const maxY = Math.max(0, (frameHeight - viewport.h) / 2)

    setOffset(prev => {
      const nextX = clamp(prev.x - e.deltaX, -maxX, maxX)
      const nextY = clamp(prev.y - e.deltaY, -maxY, maxY)

      if (nextX === prev.x && nextY === prev.y) return prev

      suppressClickRef.current = true

      return { x: nextX, y: nextY }
    })
  }

  /**
   * 拡大時のみドラッグ開始を許可し、開始座標を保持する。
   * @param {MouseEvent} e - マウスダウンイベント。
   */
  const handleMouseDown = e => {
    // ブラウザのデフォルト画像ドラッグや選択を抑止
    e.preventDefault()
    suppressClickRef.current = false
    if (scale <= 1) return
    dragState.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: offset.x,
      originY: offset.y,
    }
    setDragging(true)
  }

  /**
   * ドラッグ中の平行移動をRafでまとめて反映する。
   * @param {MouseEvent} e - マウスムーブイベント。
   */
  const handleMouseMove = e => {
    if (!dragState.current.dragging) return
    const dx = e.clientX - dragState.current.startX
    const dy = e.clientY - dragState.current.startY
    const next = { x: dragState.current.originX + dx, y: dragState.current.originY + dy }

    if (Math.abs(dx) + Math.abs(dy) > 3) suppressClickRef.current = true
    if (viewport.w && viewport.h && baseSize.w && baseSize.h) {
      const frameWidth = baseSize.w * scale
      const frameHeight = baseSize.h * scale
      const maxX = Math.max(0, (frameWidth - viewport.w) / 2)
      const maxY = Math.max(0, (frameHeight - viewport.h) / 2)

      next.x = clamp(next.x, -maxX, maxX)
      next.y = clamp(next.y, -maxY, maxY)
    }

    if (!moveRaf.current) {
      moveRaf.current = requestAnimationFrame(() => {
        setOffset(next)
        moveRaf.current = 0
      })
    }
  }

  /**
   * ドラッグ終了時にフラグとRafをリセットする。
   */
  const handleMouseUp = () => {
    dragState.current.dragging = false
    setDragging(false)

    if (moveRaf.current) {
      cancelAnimationFrame(moveRaf.current)
      moveRaf.current = 0
    }
  }

  /**
   * 画像クリックでフィット⇔拡大をトグル。背景クリックならクローズ。
   * @param {MouseEvent} e - クリックイベント。
   */
  const toggleZoom = e => {
    if (e.target === containerRef.current) {
      onClose?.()
      return
    }

    if (suppressClickRef.current) {
      // ドラッグ直後のクリック抑制
      suppressClickRef.current = false
      return
    }

    setScale(prev => (prev > 1 ? 1 : 2))
    setOffset({ x: 0, y: 0 })
  }

  const onImgLoad = () => {
    if (!imgRef.current) return
    const img = imgRef.current

    setImgNatural({ w: img.naturalWidth, h: img.naturalHeight })
  }

  useEffect(() => () => {
    if (moveRaf.current) cancelAnimationFrame(moveRaf.current)
  }, [])

  /**
   * メイン→フォールバック→固定画像の順に差し替える。
   */
  const handleImgError = () => {
    if (fallbackSrc && !fallbackTried) {
      setFallbackTried(true)
      setImgSrc(fallbackSrc)
    } else if (imgSrc !== FALLBACK_IMG) {
      setImgSrc(FALLBACK_IMG)
    }
  }

  if (!open) return null

  // アニメーション（うにょん拡大 + 背景フェード）
  const fadeIn = keyframes`
    0% { opacity: 0 }
    100% { opacity: 1 }
  `

  const popIn = keyframes`
    0% { transform: scale(0.85); opacity: 0.6 }
    60% { transform: scale(1.03); opacity: 1 }
    100% { transform: scale(1) }
  `

  const popWrapperStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: animatePopIn ? `${popIn} 360ms cubic-bezier(.2,.8,.2,1) both` : 'none',
    willChange: animatePopIn ? 'transform' : undefined,
  }
  const frameStyles = {
    position: 'relative',
    borderRadius: 2,
    boxShadow: 24,
    bgcolor: 'black',
    overflow: 'hidden',
    willChange: 'transform',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transformOrigin: 'center center',
    transform: `scale(${scale})`,
    transition: dragging ? 'none' : 'transform 220ms cubic-bezier(.2,.8,.2,1)',
    ...(baseSize.w && baseSize.h
      ? {
          width: baseSize.w,
          height: baseSize.h,
        }
      : {
          maxWidth: '95vw',
          maxHeight: '90vh',
        }),
  }

  // ======== 処理ステップ: オーバーレイ表示 → オフセット適用 → フレーム描画 ========
  // 1. オーバーレイではEscapeやクリックで閉じられるようイベントをまとめて設定する。
  // 2. オフセット適用ではパン位置をtranslateへ反映し、ズーム倍率との整合を保つ。
  // 3. フレーム描画ではimgタグをcontainで収め、pointerEventsを無効にしてドラッグ操作を優先する。
  return (
    <Box
      ref={containerRef}
      onClick={toggleZoom}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDragStart={e => e.preventDefault()}
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: theme => theme.zIndex.modal + 1,
        bgcolor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: dragging ? 'grabbing' : (scale > 1 ? 'grab' : 'zoom-in'),

        // 背景フェード
        opacity: 0,
        animation: `${fadeIn} 180ms ease-out forwards`,
        userSelect: 'none',
      }}
      aria-modal
      role="dialog"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          transition: dragging ? 'none' : 'transform 180ms ease',
          willChange: 'transform',
        }}
      >
        <Box sx={popWrapperStyles}>
          <Box sx={frameStyles}>
            <img
              ref={imgRef}
              src={imgSrc}
              alt={alt}
              onLoad={onImgLoad}
              onError={handleImgError}
              draggable={false}
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ImageLightbox
