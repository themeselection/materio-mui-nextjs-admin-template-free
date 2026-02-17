# Machine Status — ドキュメント（現状版）

このフォルダ配下にページ本体・UI コンポーネント・フック・ユーティリティをまとめています。ページ直下に置き換え済みのため、インポートは相対パスで統一しています。

## フォルダ構成

- `page.jsx` — 画面本体（レイアウトと配線）
- `components/` — 見た目用コンポーネント
  - `UnitStatusLamps.jsx`
  - `ErrorLogList.jsx`
  - `InspectionDialogs.jsx`
- `hooks/` — データ取得とロジック
  - `useMachineInfo.js`
  - `useMachineLogs.js`
- `utils/`
  - `date.js` — 日付/時間ユーティリティ

## 役割（ざっくり）

- `page.jsx`
  - 画面の土台。UI の最小限の状態（ログのフィルタ、ダイアログ開閉、スナックバー）を持つ
  - データはフックから受け取り、見た目用コンポーネントに渡す

- `useMachineInfo.js`
  - 機械の基本情報（名前・今日の稼働時間/生産数など）を取得
  - 稼働時間は API 応答を起点に 1 秒ごとにカウントアップ（`started_at` が妥当ならそれを優先）
  - 点検関連（最終点検日、点検間隔、次回日付）を管理
  - API は `GET /api/machines/{id}` を想定（Next.js の rewrite 経由）。

- `useMachineLogs.js`
  - ログ取得（`GET /api/machines/{id}/logs`）と表示用加工（整形・ソート）
  - ユニットごとの状態（正常/残弾わずか/残弾なし/エラー/停止中/不明）を推定
  - 全体（大ランプ）用の状態ラベルも算出

- `components/*`
  - `UnitStatusLamps.jsx`: Unit1〜4 のランプとラベル表示のみ
  - `ErrorLogList.jsx`: ログ一覧の表示のみ（フィルタは親で実施）
  - `InspectionDialogs.jsx`: 点検ダイアログ一式（点検・点検間隔）

- `utils/date.js`
  - 提供関数: `parseYmdSlash`, `parseYmd`, `formatYmdSlash`, `secondsToHMS`, `daysDiff`, `addDays`

## インポート方針（重要）

- 本ページ配下は相対パスで統一しています。
  - 例: `./components/UnitStatusLamps`, `./hooks/useMachineInfo`, `./utils/date`
- なお、プロジェクト全体では `@/*` エイリアスが使えますが、machine-status 配下は移動に強い構成のため相対パス運用に寄せています。

## 動作メモ

- ベースパス: クライアントからの API 呼び出しは `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/...` を利用（サブパス配備に対応）。
- 認証トークン: `localStorage` または `sessionStorage` から参照し、`Authorization: Bearer <token>` を付与（存在時）。
- ルーティング: このページは `(dashboard)` 配下なので `AuthGuard` の保護対象です。

## よくあるつまずき（対処）

- エラー: `ENOENT ... src/components/machine-status/utils/date.js` など、古いパス参照でビルド失敗
  - 対処: インポートを現行の相対パス（`./utils/date` 等）に修正
  - それでも直らない場合は開発サーバーを再起動（必要なら `.next` キャッシュ削除）

## 触りたいときの目安

- 画面の配置やボタンを増やす → `page.jsx`
- API の取り回し / ロジック修正 → `hooks/useMachineInfo.js` or `hooks/useMachineLogs.js`
- 見た目だけ直したい → `components/UnitStatusLamps.jsx` / `components/ErrorLogList.jsx` / `components/InspectionDialogs.jsx`
- 日付の書式や変換を変えたい → `utils/date.js`