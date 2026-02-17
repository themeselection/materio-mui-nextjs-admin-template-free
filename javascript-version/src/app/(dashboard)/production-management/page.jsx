/*
======== ファイル概要 ========
生産数管理のレガシーHTMLをiframeで包んでダッシュボードに組み込むページ。
フレームワーク側のレイアウト余白を相殺しつつ高さを100vhに固定して崩れを防いでいる。
*/
"use client";

// このページは既存の静的HTML (public/parts-inventory/部品在庫管理.html) をそのまま iframe で表示します。
// もし将来 React 化したい場合は、この iframe を外し HTML/JS をコンポーネントへ段階移行してください。

/**
 * 生産数管理の静的HTMLをiframeで表示する。
 * @returns {JSX.Element} 生産数管理のレガシー画面をiframe越しに描画する要素。
 */
const IframePage = () => {
    // ======== 処理ステップ: コンテナ調整 → レガシーHTML埋め込み ========
    // 1. コンテナ調整ではレイアウトが持つパディングを打ち消し、iframeを縦いっぱいに広げるための箱を用意する。
    // 2. レガシーHTML埋め込みでは静的HTMLをsrcとして指定し、その場しのぎではなく段階的移行の足場にする意図。
    // レイアウト側で付与されている上部パディング/マージンを打ち消して余白を詰める
    // (必要に応じて値を微調整: -24px -> -16px など)
    return (
        <div
            style={{
                height: '100vh',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                marginTop: '-24px',
                overflow: 'hidden', // 親でスクロールバーを出さない
            }}
        >
            <iframe
                title="部品在庫管理"
                src="/production-management/生産数管理ページ.html"
                // iframeはレガシーHTML中のスクリプト・フォーム送信が必要なため、必要最小限のsandbox権限を許可する。
                style={{ width: '100%', height: '100vh', border: 0, display: 'block' }}
                sandbox="allow-scripts allow-same-origin allow-popups allow-downloads allow-forms"
            />
        </div>
    );
};

export default IframePage;
