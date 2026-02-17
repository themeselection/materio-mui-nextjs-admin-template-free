'use client'

/*
======== ファイル概要 ========
季節イベントに合わせた confetti 発火パターンを提供するカスタムフック。ボタン要素の位置から発射位置を算
出し、テーマごとに色や射出角度を調整します。
*/

import confetti from 'canvas-confetti'
import React, { useRef, useState } from 'react'

/**
 * イベント向け confetti 制御フック。
 * @returns {{
 *          christmasConfetti: React.RefObject<HTMLButtonElement>,
 *          handleChristmasConfetti: () => void,
 *          hallowinConfetti: React.RefObject<HTMLButtonElement>,
 *          handleHallowinConfetti: () => void,
 *          newYearConfetti: React.RefObject<HTMLButtonElement>,
 *          handleNewYearConfetti: () => void
 *        }} - ボタン参照と発火ハンドラ群。
 */
export default function useEventConfetti() {
    // クリスマス用: 緑赤ベースで射出、樹形の Path を用意
    const christmasConfetti = useRef<HTMLButtonElement>(null)
    const handleChristmasConfetti = () => {
        var triangle = confetti.shapeFromPath({ path: 'M0 10 L5 0 L10 10z' })
        let centerX: number = 0
        let centerY: number = 0
        if (christmasConfetti.current) {
            const rect = christmasConfetti.current!.getBoundingClientRect()
            centerX = rect.x + rect.width / 2
            centerY = rect.y + rect.height / 2
            console.log('Center X:', centerX, 'Center Y:', centerY)
        }
        confetti({
            // パーティクルの数（デフォルト50)
            particleCount: 100,
            // 発射角度(デフォルト90度)
            angle: 90,
            // 発射範囲(デフォルト45度)
            spread: 90,
            // 失速具合 デフォルト0.9
            // decay: 0.8,
            //重力 (0-1)
            // gravity: 0.2,
            // default:0 数値を上げると横に流れる
            // drift: 0,
            // default:false
            // confettiが動く長さ (default: 200)
            // ticks: 200,
            origin: {
                x: centerX / window.innerWidth,
                y: centerY / window.innerHeight
            },
            // 紙吹雪の色を指定。配列でいくつも指定できる
            colors: ['#165B33', '#BB2528', '#146B3A', '#EA4630'],
            // 紙吹雪の形を指定
            // shapes: ['square', triangle],
            // 紙吹雪のサイズを指定
            // scalar: 0.8,
            // z-indexを指定(default:100)
            zIndex: 100
        })
    }

    // ハロウィン用: 濃色中心で ticks を伸ばし、夜祭り感を演出
    const hallowinConfetti = useRef<HTMLButtonElement>(null)
    const handleHallowinConfetti = () => {
        let centerX: number = 0
        let centerY: number = 0
        if (hallowinConfetti.current) {
            const rect = hallowinConfetti.current!.getBoundingClientRect()
            centerX = rect.x + rect.width / 2
            centerY = rect.y + rect.height / 2
            console.log('Center X:', centerX, 'Center Y:', centerY)
        }
        confetti({
            // パーティクルの数（デフォルト50)
            particleCount: 100,
            // 発射範囲(デフォルト45度)
            spread: 90,
            // confettiが動く長さ (default: 200)
            ticks: 150,
            // 紙吹雪の色を指定。配列でいくつも指定できる
            colors: ['#f75f1c', '#ff9a00', '#000000', '#881ee4'],
            // z-indexを指定(default:100)
            origin: {
                x: centerX / window.innerWidth,
                y: centerY / window.innerHeight
            },
            zIndex: 100
        })
    }

    // 年末年始用: 広範囲に撒いて華やかさを強調
    const newYearConfetti = useRef<HTMLButtonElement>(null)
    const handleNewYearConfetti = () => {
        var triangle = confetti.shapeFromPath({ path: 'M0 10 L5 0 L10 10z' })
        let centerX: number = 0
        let centerY: number = 0
        if (christmasConfetti.current) {
            const rect = christmasConfetti.current!.getBoundingClientRect()
            centerX = rect.x + rect.width / 2
            centerY = rect.y + rect.height / 2
            console.log('Center X:', centerX, 'Center Y:', centerY)
        }
        confetti({
            // パーティクルの数（デフォルト50)
            particleCount: 100,
            // 発射角度(デフォルト90度)
            angle: 90,
            // 発射範囲(デフォルト45度)
            spread: 130,
            // 失速具合 デフォルト0.9
            decay: 0.8,
            //重力 (0-1)
            gravity: 0.2,
            // default:0 数値を上げると横に流れる
            drift: 0,
            // default:false
            // confettiが動く長さ (default: 200)
            ticks: 100,
            origin: {
                x: centerX / window.innerWidth,
                y: centerY / window.innerHeight
            },
            // z-indexを指定(default:100)
            zIndex: 100
        })
    }

    // ======== 処理ステップ: 参照確保 → 座標算出 → 発火パラメータ設定 ========
    // 1. 各イベントボタンの参照を useRef で確保し、クリック時に位置を計算する。
    // 2. 取得した中心座標を window サイズで割り、canvas-confetti が要求する 0~1 の比率へ変換する。
    // 3. パラメータはテーマごとに spread や colors を変え、演出の個性を出している。

    return {
        christmasConfetti, handleChristmasConfetti,
        hallowinConfetti, handleHallowinConfetti,
        newYearConfetti, handleNewYearConfetti
    }
}