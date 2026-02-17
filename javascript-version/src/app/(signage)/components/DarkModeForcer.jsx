"use client"

import { useEffect, useRef } from 'react'
import { useSettings } from '@core/hooks/useSettings'

// サイネージ専用: ページ滞在中のみ一時的に dark モードへ変更し、離脱時に元設定へ戻す
// React 18 StrictMode 下では mount->cleanup->mount の二重呼び出しによる高速点滅が発生するため
// 初回の擬似アンマウント(cleanup)ではリセットをスキップし、2回目(実際の離脱)のみリセットする
const DarkModeForcer = () => {
  const { settings, updatePageSettings } = useSettings()
  const cleanupCountRef = useRef(0)
  const resetRef = useRef(null)

  // 1度だけ適用: StrictMode でも effect 本体は2回実行されるが依存配列 [] で抑制し cleanup のみ2回呼ばれる
  useEffect(() => {
    if (settings.mode !== 'dark') {
      resetRef.current = updatePageSettings({ mode: 'dark' })
    }

    return () => {
      // StrictMode の最初の cleanup はスキップ（開発環境のみ）
      cleanupCountRef.current += 1
      if (process.env.NODE_ENV === 'development' && cleanupCountRef.current === 1) return
      if (resetRef.current) resetRef.current()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default DarkModeForcer
