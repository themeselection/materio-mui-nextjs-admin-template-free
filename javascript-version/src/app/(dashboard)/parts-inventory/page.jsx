"use client";

import { useEffect } from 'react';

import Script from 'next/script';

import { initPartsInventoryApp } from './partsInventoryApp';
import ModalBridge from './ModalBridge';

/*
======== ファイル概要 ========
部品在庫レガシーアプリをNext.jsページ内にブートストラップするエントリーポイント。
Google Fontsの読み込み制御や、モーダルブリッジの準備完了イベントを待って初期化を行う。
*/

/**
 * 部品在庫ページのトップレベルコンポーネント。
 * @returns {JSX.Element}   レガシーアプリのDOMを含むダッシュボードページ。
 */
const Page = () => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || '';
    const enableGoogleFonts = process.env.NEXT_PUBLIC_ENABLE_GOOGLE_FONTS === 'true';

    useEffect(() => {
        // ======== 処理ステップ: window準備 → ブリッジ待機 → 後片付け ========
        // 1. windowへAPIベースURLを渡してからレガシーアプリの初期化を呼び出す。
        // 2. モーダルブリッジの準備イベントが未発火の場合はイベントリスナで待機し、準備完了後に初期化する。
        // 3. ページアンマウント時はレガシー側のteardown関数が存在すれば確実に呼び出し、リスナも解除する。
        const start = () => {
            window.API_BASE = apiBase;
            initPartsInventoryApp();
        };

        if (typeof window !== 'undefined' && window.__pi_modal_ready) {
            start();
        } else {
            const onReady = () => {
                window.removeEventListener('pi:modal-ready', onReady);
                start();
            };

            window.addEventListener('pi:modal-ready', onReady);

            
return () => {
                window.removeEventListener('pi:modal-ready', onReady);

                if (typeof window !== 'undefined' && window.__piAppTeardown) {
                    try { window.__piAppTeardown(); } catch { }
                }
            };
        }

        
return () => {
            if (typeof window !== 'undefined' && window.__piAppTeardown) {
                try { window.__piAppTeardown(); } catch { }
            }
        };
    }, [apiBase]);


    return (
        <div className="pi-root" style={{ minHeight: '100vh', marginTop: '-24px' }}>
            {/* Google Fonts (proxy 環境では既定で無効。必要なら NEXT_PUBLIC_ENABLE_GOOGLE_FONTS=true を設定) */}
            {enableGoogleFonts && (
                <>
                    <link rel="preconnect" href="https://fonts.googleapis.com" />
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                    <link
                        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap"
                        rel="stylesheet"
                    />
                </>
            )}

            {/* Ionicons */}
            <Script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js" />
            <Script noModule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js" />

            <div className="flex flex-col min-h-screen">
                <main className="w-full p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col gap-6">
                        {/* タブ形式のラック選択 */}
                        <div>
                            <div className="border-b border-gray-200">
                                <nav id="rack-tabs" className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                                    {/* JSで動的生成 */}
                                </nav>
                            </div>
                        </div>

                        {/* ラック表示と詳細 */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* メッシュラック */}
                            <div className="lg:col-span-2">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 id="rack-name" className="text-2xl font-bold"></h2>
                                    <button
                                        id="bulk-qr-btn"
                                        className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-3 rounded-lg text-sm transition-transform transform hover:scale-105"
                                    >
                                        <ion-icon name="print-outline" className="mr-2"></ion-icon>
                                        一括QR生成
                                    </button>
                                </div>
                                <div className="overflow-x-auto pi-surface p-2 pl-0 rounded-xl shadow-md">
                                    <div id="rack-display-area" className="min-w-max">{/* JS will build the labeled grid here */}</div>
                                </div>
                            </div>

                            {/* 詳細と操作 */}
                            <div className="lg:col-span-1">
                                <div className="pi-surface rounded-xl shadow-md p-6 sticky top-24">
                                    <h2 className="text-2xl font-bold mb-4">情報・操作</h2>
                                    {/* 検索 */}
                                    <div className="mb-6">
                                        <label htmlFor="search-parts" className="block text-sm font-medium text-gray-700 mb-2">
                                            部品を検索
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <ion-icon name="search-outline" className="text-gray-400"></ion-icon>
                                            </div>
                                            <input
                                                type="text"
                                                id="search-parts"
                                                className="bg-gray-100 focus:bg-white focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-3 text-base border-gray-300 rounded-lg"
                                                placeholder="部品名 or 型番"
                                            />
                                        </div>
                                    </div>
                                    {/* 詳細表示 */}
                                    <div id="details-panel">
                                        <div className="text-center text-gray-500 py-10">
                                            <ion-icon name="grid-outline" className="text-5xl mx-auto"></ion-icon>
                                            <p className="mt-2">ラックの場所を選択して詳細を表示</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>


            <div className="fixed right-8 z-20" id="fab-container" style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 1.75rem)' }}>
                <div id="fab-menu" className="flex flex-col items-end space-y-3 mb-3">
                    <button
                        id="add-rack-btn"
                        data-tooltip="新しいラックを作成"
                        className="fab-item flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded-full shadow-lg"
                    >
                        <ion-icon name="add-circle-outline" className="text-xl font-bold"></ion-icon>
                        <span className="ml-2 text-sm">ラック作成</span>
                    </button>
                    <button
                        id="qr-stock-in-btn"
                        data-tooltip="QR入庫"
                        className="fab-item flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded-full shadow-lg"
                    >
                        <ion-icon name="qr-code-outline" className="text-xl font-bold"></ion-icon>
                        <span className="ml-2 text-sm">QR入庫</span>
                    </button>
                    <button
                        id="qr-stock-out-btn"
                        data-tooltip="QR出庫"
                        className="fab-item flex items-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded-full shadow-lg"
                    >
                        <ion-icon name="qr-code-outline" className="text-xl font-bold"></ion-icon>
                        <span className="ml-2 text-sm">QR出庫</span>
                    </button>
                </div>
                <button
                    id="fab-main"
                    className="w-16 h-16 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full shadow-lg transition-transform transform hover:scale-110"
                >
                    <ion-icon id="fab-icon" name="add-outline" className="transition-transform duration-300 font-bold" style={{ fontSize: '40px' }}></ion-icon>
                </button>
            </div>

            {/* Materio/MUI Dialog bridge for legacy modals */}
            <ModalBridge />
        </div>
    );
};

export default Page;
