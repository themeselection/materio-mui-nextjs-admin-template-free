/*
======== ファイル概要 ========
confetti 演出用の共通ユーティリティ。DOM 要素の中心座標を取り出し、演出の発射位置に利用します。
*/

import React from 'react'

/**
 * 中心座標を取得する。
 * RefObject の current が null である可能性を考慮して安全に扱います。
 * @param {React.RefObject<HTMLButtonElement>} ref - 座標を取得したいボタン要素の参照。
 * @returns {{centerX:number,centerY:number}}       - 画面上の中心座標。
 */
export function getCentralCoordinates(ref: React.RefObject<HTMLButtonElement>): { centerX: number, centerY: number } {
  let x: number = 0
  let y: number = 0
  if (ref && ref.current) {
    const rect = ref.current.getBoundingClientRect()
    x = rect.x + rect.width / 2
    y = rect.y + rect.height / 2
    console.log('Center X:', x, 'Center Y:', y)
  }
  return { centerX: x, centerY: y }
}