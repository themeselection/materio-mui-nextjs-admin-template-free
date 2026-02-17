# 部品在庫管理 (parts-inventory) 構成ガイド

このディレクトリは、レガシー UI を Next.js ページ内でブリッジして動かす「部品在庫管理」機能です。2025-09 時点のリファクタで、ロジックを役割ごとに分割しました。本書は後から参画するメンバーが全体像と編集ポイントを素早く掴めるようにまとめています。

## 概要
- 技術スタック: Next.js 14 (App Router) + MUI ダイアログブリッジ + Tailwind。DOM 主体の命令的 UI を段階的にモジュール化。
- ページエントリ: `page.jsx` が `ModalBridge` を設置し、準備完了のカスタムイベント後に `initPartsInventoryApp()` を呼び出します。
- 大きな分割方針:
  - UI描画: `lib/render.js`
  - モーダルフロー: `lib/modals.js`
  - API アクセス: `lib/api.js`
  - ユーティリティ/変換: `lib/utils.js`
  - 状態・イベント配線・初期ロード: `partsInventoryApp.js`

## ファイル構成と責務
- `page.jsx`
  - useEffect で `window.API_BASE` を注入し、`pi:modal-ready` 待ち後に `initPartsInventoryApp()` 実行。
  - 画面の静的コンテナ（タブ、グリッド表示領域、詳細パネル、FAB）を用意。
  - React コンポーネント `ModalBridge` が MUI ダイアログを window 経由で操作できるようにブリッジ（`window.__pi_openModal` / `__pi_closeModal`）。

- `partsInventoryApp.js`
  - アプリのエントリ。以下を担当:
    - 状態保持: `racks`, `currentRackId`, `selectedSlotId`, `isMoveMode`, `moveOriginSlotId` など。
    - 初期ロード: ラック一覧＋詳細の取得、モックフォールバック、最終ラックの復元。
    - イベント配線: タブ切替、FAB、詳細パネルの操作、グリッド（移動/選択）。
    - 再描画: `renderRackTabs` / `renderCurrentRack` / `renderDetails` 呼び出し。
    - サーバー同期: `refreshCurrentRackFromApi()` で現在ラックのスロットを最新化。
  - モーダルの具体的な UI/業務フローは `lib/modals.js` に委譲します（本体は呼び出しとコンテキスト提供のみ）。

- `lib/render.js`
  - DOM 生成・差し替えのみを担当。
  - 提供関数:
    - `renderRackTabs(racks, currentRackId)`
    - `renderCurrentRack(racks, currentRackId, selectedSlotId, isMoveMode, moveOriginSlotId)`
    - `renderDetails(racks, currentRackId, slotId)`

- `lib/api.js`
  - API クライアント層。fetch の共通化と型揃え。
  - 提供関数:
    - `createApi(apiBase)`: `listRacks`, `getRack`, `createRack`, `deleteRack`, `createSlot`, `deleteSlot`, `upsertSlot`, `useSlot`, `moveSlot`
    - `mapApiSlotToAppPart(slot)` : API 形→アプリ内形への 1 スロット変換

- `lib/utils.js`
  - 汎用ヘルパーとデータ変換。
  - 主な関数:
    - `s(value, fallback?)` サニタイズ/未定義ガード
    - `getRackNumericId(rack|id)` ラックIDの数値化
    - `createLastRackStorage(apiBase)` 最終ラックの保存/復元
    - `transformApiDataToAppData(apiData)` API配列→内部表現への変換

- `lib/modals.js`
  - すべてのモーダル UI とビジネスフローを集約。
  - ブリッジ: `openModalWithBridge`, `closeModal`, `showQrScannerModal`
  - 業務モーダル:
    - `showAddRackModal(ctx)` 新規ラック作成
    - `showDeleteRackModal(ctx, rackId, rackName)` ラック削除
    - `showUsePartModal(ctx, slotId, currentRack, part)` 使用
    - `showDeletePartModal(ctx, slotId, currentRack, part)` 箱削除
    - `showEditPartModal(ctx, slotId, currentRack, part)` 箱情報編集（数量0は削除）
    - `showStorePartModal(callback)` 入庫フォーム（棚スキャンは呼び出し側）
    - `showShelfQrModal(rack, slotId)` 単体棚QR表示
    - `showBulkShelfQrModal(rack)` 棚QR一括生成

## データモデル（内部表現）
- ラック: `{ id: string, name: string, rows: number, cols: number, slots: Record<slotId, Part|null> }`
- スロットID: `"A-1"` のように 行(A..Z) + "-" + 列番号
- 部品(Part): `{ partName: string, partModelNumber?: string|null, quantity: number, color?: string|null }`
- API→内部変換は `transformApiDataToAppData` と `mapApiSlotToAppPart` に集約。

## 状態と再描画
- 主要状態（`partsInventoryApp.js`）
  - `racks`: 全ラックの内部表現
  - `currentRackId`: 現在選択中ラック
  - `selectedSlotId`: 詳細パネルに表示中のスロット
  - `isMoveMode` / `moveOriginSlotId`: 移動モードの制御
- 再描画タイミング
  - タブや FAB 操作、詳細パネルのアクション後に `render*` を都度呼び分け。
  - サーバー更新後は `refreshCurrentRackFromApi()` で同期→ `renderCurrentRack`/`updateDetails`。

## モーダルコンテキスト（ctx）
`lib/modals.js` の多くの関数は以下のコンテキストを受け取ります。

```ts
interface Ctx {
  api: ReturnType<typeof createApi>;
  racks: Rack[];
  currentRackId: string | null;
  setRacks(next: Rack[]): void;            // racks を差し替え
  setCurrentRackId(id: string | null): void;
  setLastRackId(id: string | null): void;  // localStorage 保存
  renderApp(): void;                       // タブ/グリッド/詳細の初期描画セット
  updateDetails(slotId: string | null): void;
  refreshCurrentRackFromApi(): Promise<Rack|null>;
  mapApiSlotToAppPart: typeof mapApiSlotToAppPart;
}
```

`partsInventoryApp.js` 内で `getCtx()` としてこのオブジェクトを組み立て、各モーダル呼び出しに渡しています。

## イベント配線（主な導線）
- タブ（`#rack-tabs`）
  - クリック: タブ切替、削除ボタンは `showDeleteRackModal(ctx, rackId, rackName)`
- FAB
  - 追加: `showAddRackModal(ctx)`
  - QR入庫: `showStorePartModal()` → 入力確定後に `showQrScannerModal()` → 空き棚へ `api.createSlot(...)`
  - QR出庫: `showQrScannerModal()` → 最初に見つかった在庫棚へ `showUsePartModal(...)`
- 詳細パネル（`#details-panel`）のボタン
  - 使用/格納/移動/編集/削除/棚QR の各アクションをハンドリング
- グリッド（`#rack-display-area`）
  - 通常: 最新同期→`updateDetails(slotId)`
  - 移動モード: 空き棚クリックで `api.moveSlot(...)` → 同期→解除

## API とベースパス
- クライアントは `/api/...` にアクセス（Next.js rewrite 経由でバックエンドへ）。
- このページでは `NEXT_PUBLIC_API_BASE` を `page.jsx` から `window.API_BASE` として注入しています。
- 変更したい場合は `javascript-version/next.config.mjs` の rewrites と `.env` を参照（dev は再起動が必要）。

## ライフサイクルとクリーンアップ
- `ModalBridge` が読み込み完了すると `pi:modal-ready` を発火 → 以降 `__pi_openModal/__pi_closeModal` が利用可。
- `initPartsInventoryApp()` は再入場を考慮し、前回のイベントリスナを `window.__piAppTeardown` で解除します。
- モーダルを閉じた直後のゴーストクリック対策として、キャプチャ段階の pointer/mouse ガードを用意。

## よくあるハマりどころ
- render 内でイベントまでバインドしない
  - ハンドラは必ず `partsInventoryApp.js`（一箇所）に集約。二重バインドやリーク防止のため。
- ラックIDの数値化
  - API 呼び出し前に `getRackNumericId()` を使用（`rack-12` → `12`）。
- サーバー同期の抜け
  - `createSlot/deleteSlot/upsert/ use/move` 後は極力 `refreshCurrentRackFromApi()` で最新化し、UI も再描画。

## 機能拡張の指針
- 新しいモーダルを追加する
  1) `lib/modals.js` に UI/バリデーション/サーバー呼び出しを実装
  2) `partsInventoryApp.js` でイベントからその関数を呼ぶ（必要なら `getCtx()` を渡す）
- API の変更に追従する
  - `lib/api.js` だけを更新し、呼び出し側は同じ関数名を使い続けられるようにする
- レンダリングの仕様変更
  - `lib/render.js` だけを編集。イベント配線は触らない

## 簡易フロー図（テキスト）
- 起動: page.jsx → ModalBridge → pi:modal-ready → initPartsInventoryApp()
- 初期化: API から racks+details 取得 or モック → 状態セット → render*
- 操作: イベント → 必要に応じてモーダル表示 → API 呼び出し → refresh → render/updateDetails

## 動作確認のヒント
- ローカル dev（pnpm 推奨）
  - パッケージ管理はリポジトリルートの `javascript-version/package.json` 参照
  - 既定スクリプト（Windows PowerShell）

```powershell
# 依存解決
pnpm install
# Dev サーバー起動
pnpm dev
```

バックエンド API が未起動の場合はモックデータで表示されます（初期ラック3つ）。

---
改善提案や発見事項はこの README 末尾に追記していきましょう。特に API の返却形・エラー形の標準化が進んだ場合、`lib/api.js` と本書の対応部分を更新してください。