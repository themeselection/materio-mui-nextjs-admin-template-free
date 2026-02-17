/*
======== ファイル概要 ========
ブラウザのカメラを利用してQRコードをリアルタイムに読み取るためのユーティリティ。
jsQRライブラリを用いてデコードし、停止用の関数を呼び出し元へ返す。
*/

// 軽量カメラ + QR デコード（jsQR を使用）
// 起動すると停止用の関数を返します

import jsQR from 'jsqr';

/**
 * 指定した <video> 要素上でカメラQRスキャナーを開始します。オプションでフレーム取得用の <canvas> を使用できます。
 * 戻り値は stop() 関数（カメラとスキャンループを停止）です。
 *
 * オプション:
 * - videoEl: HTMLVideoElement (必須)
 * - canvasEl: HTMLCanvasElement (任意: パフォーマンス向上のため推奨)
 * - onDecode: (string) => void (必須: デコード成功時に呼ばれる)
 * - onError: (Error) => void (エラー時に呼ばれる)
 * - constraints: MediaStreamConstraints.video (任意)
 */
export function startQrScanner({ videoEl, canvasEl, onDecode, onError, constraints, roi } = {}) {
    // 必須チェックと環境チェック
    if (!videoEl) throw new Error('videoEl is required');
    if (typeof window === 'undefined' || !navigator?.mediaDevices?.getUserMedia) {
        throw new Error('Camera API not available in this environment');
    }

    // 内部状態
    let stream = null;
    let rafId = null;
    let active = true;
    // canvas 要素（外部提供がなければ内部で生成）
    const canvas = canvasEl || document.createElement('canvas');
    // willReadFrequently を指定してピクセル読み取りを最適化
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // ビデオ制約（指定がなければ背面カメラ優先・解像度目安を指定）
    const videoConstraints = constraints || { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } };

    // 停止処理：アニメーションフレーム、トラック、video.srcObject を解除
    function stop() {
        active = false;
        if (rafId) try { cancelAnimationFrame(rafId); } catch { }
        if (stream) try { stream.getTracks().forEach(t => t.stop()); } catch { }
        try { videoEl.srcObject = null; } catch { }
    }

    // ROI（検知範囲）をビデオピクセル座標に変換
    function calcScanRect(w, h) {
        // roi は 0..1 の正規化座標 { x, y, width, height }
        if (roi && typeof roi === 'object') {
            const nx = Math.max(0, Math.min(1, Number(roi.x ?? 0)));
            const ny = Math.max(0, Math.min(1, Number(roi.y ?? 0)));
            const nw = Math.max(0, Math.min(1 - nx, Number(roi.width ?? 1)));
            const nh = Math.max(0, Math.min(1 - ny, Number(roi.height ?? 1)));
            const x = Math.floor(nx * w);
            const y = Math.floor(ny * h);
            const ww = Math.max(1, Math.floor(nw * w));
            const hh = Math.max(1, Math.floor(nh * h));
            return { x, y, width: ww, height: hh };
        }

        // 既定: 画面中央の正方形（短辺の80%）
        const size = Math.floor(Math.min(w, h) * 0.8);
        const x = Math.floor((w - size) / 2);
        const y = Math.floor((h - size) / 2);
        return { x, y, width: size, height: size };
    }

    // 起動処理：カメラ取得→再生→ループでフレームを取り出してデコード
    async function start() {
        try {
            // カメラストリーム取得
            stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: false });
            videoEl.srcObject = stream;
            await videoEl.play();

            // スキャンループ
            const scan = () => {
                if (!active) return;

                const w = videoEl.videoWidth;
                const h = videoEl.videoHeight;

                if (w && h) {
                    // canvas サイズをビデオと揃える
                    if (canvas.width !== w) canvas.width = w;
                    if (canvas.height !== h) canvas.height = h;

                    // ビデオフレームを canvas に描画
                    ctx.drawImage(videoEl, 0, 0, w, h);

                    let imageData = null;
                    try {
                        // 検知範囲（ROI）のみをデコード対象にする
                        const rect = calcScanRect(w, h);
                        imageData = ctx.getImageData(rect.x, rect.y, rect.width, rect.height);
                    } catch { /* 取得失敗時は次フレームへ */ }

                    if (imageData) {
                        // jsQR でデコードを試みる
                        const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' });
                        if (code && code.data) {
                            // デコード成功時はコールバックを呼んで停止
                            try {
                                onDecode && onDecode(code.data);
                            } finally {
                                stop();

                            }
                            return;
                        }
                    }
                }

                // 継続して次フレームを処理
                rafId = requestAnimationFrame(scan);
            };

            rafId = requestAnimationFrame(scan);
        } catch (e) {
            // 取得や再生でエラーが発生した場合は onError を呼んで停止
            try { onError && onError(e); } catch { }
            stop();
        }
    }

    // 即時開始
    start();
    // 呼び出し元は返された stop 関数で停止可能
    return stop;
}
