'use client'

/*
======== ファイル概要 ========
状況に応じた confetti 演出（エラー通知・定期タスク完了など）をまとめたカスタムフック。演出意図に合わせ
て色や重力を調整しています。
*/

import confetti from 'canvas-confetti'
import React, { useRef, useState } from 'react'
import { getCentralCoordinates } from './common'

/**
 * 状況別 TPO confetti 制御フック。
 * @returns {{
 *          batchErrorConfetti: React.RefObject<HTMLButtonElement>,
 *          handleBatchErrorConfetti: () => void,
 *          monthlyTaskCompletedConfetti: React.RefObject<HTMLButtonElement>,
 *          handleMonthlyTaskCompletedConfetti: () => void,
 *          yearlyTaskCompletedConfetti: React.RefObject<HTMLButtonElement>,
 *          handleYearlyTaskCompletedConfetti: () => void,
 *          gameFinishConfetti: React.RefObject<HTMLButtonElement>,
 *          handleGameFinithConfetti: () => void,
 *          goodButtonConfetti: React.RefObject<HTMLButtonElement>,
 *          handleGoodButtonConfetti: () => void
 *        }} - 参照とイベントハンドラの集合。
 */
export default function useTpoConfetti() {
    const batchErrorConfetti = useRef<HTMLButtonElement>(null)
    const handleBatchErrorConfetti = () => {
        // 中心座標を取得
        const { centerX, centerY } = getCentralCoordinates(batchErrorConfetti)
        function shoot() {
            confetti({
                // パーティクルの数（デフォルト50)
                particleCount: 200,
                // 発射角度(デフォルト90度)
                angle: 90,
                // 発射範囲(デフォルト45度)
                spread: 360,
                // 失速具合 デフォルト0.9
                decay: 1,
                //重力 (0-1)
                gravity: 0.0,
                // confettiが動く長さ (default: 200)
                ticks: 200,
                origin: {
                    x: centerX / window.innerWidth,
                    y: centerY / window.innerHeight
                },
                // 紙吹雪の色を指定。配列でいくつも指定できる
                colors: ['#a70000', '#ff0000', '#ff5252', '#ffbaba'],
                // 紙吹雪のサイズを指定
                scalar: 0.6,
                // z-indexを指定(default:100)
                zIndex: 100
            })
        }
        shoot()
        setTimeout(shoot, 200)
    }

    const monthlyTaskCompletedConfetti = useRef<HTMLButtonElement>(null)
    const handleMonthlyTaskCompletedConfetti = () => {
        var scalar = 2
        var star1 = confetti.shapeFromText({ text: '⭐️', scalar })
        var star2 = confetti.shapeFromText({ text: '✨', scalar })
        // 中心座標を取得
        const { centerX, centerY } = getCentralCoordinates(monthlyTaskCompletedConfetti)
        function shoot() {
            confetti({
                // パーティクルの数（デフォルト50)
                particleCount: 200,
                // 発射角度(デフォルト90度)
                angle: 90,
                // 発射範囲(デフォルト45度)
                spread: 360,
                // 失速具合 デフォルト0.9
                decay: 0.85,
                //重力 (0-1)
                gravity: 0.1,
                // confettiが動く長さ (default: 200)
                ticks: 200,
                origin: {
                    x: centerX / window.innerWidth,
                    y: centerY / window.innerHeight
                },
                // 紙吹雪の色を指定。配列でいくつも指定できる
                colors: ['#a70000', '#ff0000', '#ff5252', '#ffbaba'],
                // 紙吹雪の形を指定
                shapes: [star1, star2],
                // 紙吹雪のサイズを指定
                scalar: scalar,
                // z-indexを指定(default:100)
                zIndex: 100
            })
        }
        shoot()
        // setTimeout(shoot, 200);
    }

    const yearlyTaskCompletedConfetti = useRef<HTMLButtonElement>(null)
    const handleYearlyTaskCompletedConfetti = () => {
        var scalar = 2
        var star1 = confetti.shapeFromText({ text: '⭐️', scalar })
        var star2 = confetti.shapeFromText({ text: '✨', scalar })
        // 中心座標を取得
        const { centerX, centerY } = getCentralCoordinates(yearlyTaskCompletedConfetti)
        function shoot() {
            confetti({
                // パーティクルの数（デフォルト50)
                particleCount: 50,
                // 発射角度(デフォルト90度)
                angle: 90,
                // 発射範囲(デフォルト45度)
                spread: 90,
                // 失速具合 デフォルト0.9
                decay: 0.85,
                //重力 (0-1)
                gravity: 0.5,
                // confettiが動く長さ (default: 200)
                ticks: 200,
                origin: {
                    x: centerX / window.innerWidth,
                    y: centerY / window.innerHeight
                },
                // 紙吹雪の色を指定。配列でいくつも指定できる
                colors: ['#b78700', '#eeb600', '#fff71', '#f8da45'],
                // z-indexを指定(default:100)
                zIndex: 100
            })
        }
        shoot()
        setTimeout(shoot, 900)
        setTimeout(shoot, 1800)
    }

    const gameFinishConfetti = useRef<HTMLButtonElement>(null)
    const handleGameFinithConfetti = () => {
        var scalar = 2
        var star1 = confetti.shapeFromText({ text: '⭐️', scalar })
        var star2 = confetti.shapeFromText({ text: '✨', scalar })
        // 中心座標を取得
        const { centerX, centerY } = getCentralCoordinates(gameFinishConfetti)
        function shoot(param: { angle: number, decay: number }) {
            confetti({
                // パーティクルの数（デフォルト50)
                particleCount: 30,
                // 発射角度(デフォルト90度)
                angle: param ? param.angle : 90,
                // 発射範囲(デフォルト45度)
                spread: 40,
                // 失速具合 デフォルト0.9
                decay: 0.85,
                //重力 (0-1)
                gravity: 0.5,
                // confettiが動く長さ (default: 200)
                ticks: 200,
                origin: {
                    x: centerX / window.innerWidth,
                    y: centerY / window.innerHeight
                },
                // 紙吹雪の色を指定。配列でいくつも指定できる
                colors: [
                    //'#b78700', '#eeb600', '#fff71', '#f8da45',
                    '#dcf2f1', '#7fc7d9', '#365486'],
                // z-indexを指定(default:100)
                zIndex: 100
            })
        }
        shoot({ angle: 23, decay: 0.9 })
        setTimeout(() => shoot({ angle: 90, decay: 0.8 }), 100)
        setTimeout(() => shoot({ angle: 120, decay: 0.8 }), 200)
        setTimeout(() => shoot({ angle: 150, decay: 0.8 }), 300)
        setTimeout(() => shoot({ angle: 180, decay: 0.8 }), 400)
        setTimeout(() => shoot({ angle: 210, decay: 0.8 }), 100)
        setTimeout(() => shoot({ angle: 240, decay: 0.8 }), 200)
        setTimeout(() => shoot({ angle: 270, decay: 0.8 }), 300)
        setTimeout(() => shoot({ angle: 300, decay: 0.8 }), 400)
        setTimeout(() => shoot({ angle: 330, decay: 0.8 }), 100)
        setTimeout(() => shoot({ angle: 360, decay: 0.8 }), 200)
        setTimeout(() => shoot({ angle: 0, decay: 0.8 }), 300)
        setTimeout(() => shoot({ angle: 60, decay: 0.8 }), 400)
    }

    const goodButtonConfetti = useRef<HTMLButtonElement>(null)
    const handleGoodButtonConfetti = () => {
        var scalar = 2
        var star1 = confetti.shapeFromText({ text: '⭐️', scalar })
        var star2 = confetti.shapeFromText({ text: '✨', scalar })
        // 中心座標を取得
        const { centerX, centerY } = getCentralCoordinates(goodButtonConfetti)
        var triangle = confetti.shapeFromPath({ path: 'M0 10 L5 0 L10 10z' })
        function shoot(param: { angle: number, decay: number, ticks: number }) {
            confetti({
                // パーティクルの数（デフォルト50)
                particleCount: 15,
                // 発射角度(デフォルト90度)
                angle: param ? param.angle : 90,
                // 発射範囲(デフォルト45度)
                spread: 360,
                // 失速具合 デフォルト0.9
                decay: 0.3,
                //重力 (0-1)
                gravity: 0,
                // confettiが動く長さ (default: 200)
                ticks: param.ticks,
                origin: {
                    x: centerX / window.innerWidth,
                    y: centerY / window.innerHeight
                },
                // 紙吹雪の形を指定
                shapes: [ triangle],
                // 紙吹雪のサイズを指定
                scalar: 0.8,
                // 紙吹雪の色を指定。配列でいくつも指定できる
                colors: [
                    //'#b78700', '#eeb600', '#fff71', '#f8da45',
                    '#ff0000', '#ff7676'],
                // z-indexを指定(default:100)
                zIndex: 100
            })
        }
        // shoot({ angle: 23, decay: 0.9 });
        setTimeout(() => shoot({ angle: 30, decay: 1, ticks: 50 }), 0)
        setTimeout(() => shoot({ angle: 60, decay: 1, ticks: 30 }), 100)
        setTimeout(() => shoot({ angle: 0, decay: 1, ticks: 30 }), 200)
        //setTimeout(() => shoot({ angle: 90, decay: 0.1 }), 200);
        // setTimeout(() => shoot({ angle: 120, decay: 0.1 }), 200);
        // setTimeout(() => shoot({ angle: 150, decay: 0.1 }), 300);
        // setTimeout(() => shoot({ angle: 180, decay: 0.8 }), 400);
        // setTimeout(() => shoot({ angle: 210, decay: 0.8 }), 100);
        // setTimeout(() => shoot({ angle: 240, decay: 0.8 }), 200);
        // setTimeout(() => shoot({ angle: 270, decay: 0.8 }), 300);
        // setTimeout(() => shoot({ angle: 300, decay: 0.8 }), 400);
        // setTimeout(() => shoot({ angle: 330, decay: 0.8 }), 100);
        // setTimeout(() => shoot({ angle: 360, decay: 0.8 }), 200);
        // setTimeout(() => shoot({ angle: 0, decay: 0.8 }), 300);
        // setTimeout(() => shoot({ angle: 60, decay: 0.8 }), 400);
    }

    // ======== 処理ステップ: 参照取得 → 状況別パターン構築 → 複数回射出 ========
    // 1. イベント種別ごとに ref を保持し、クリック位置に合わせた confetti を放出する。
    // 2. エラー通知は赤系・定期完了はスターを使用するなど、色と形状で意味合いを伝える。
    // 3. setTimeout を組み合わせて連続的な演出を作り、達成感や警告度合いを表現する。

    return {
        batchErrorConfetti, handleBatchErrorConfetti,
        monthlyTaskCompletedConfetti, handleMonthlyTaskCompletedConfetti,
        yearlyTaskCompletedConfetti, handleYearlyTaskCompletedConfetti,
        gameFinishConfetti, handleGameFinithConfetti,
        goodButtonConfetti, handleGoodButtonConfetti
    }
}