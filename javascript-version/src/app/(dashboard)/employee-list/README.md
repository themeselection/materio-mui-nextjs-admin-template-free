# Employee List — ドキュメント（現状版）

従業員名簿ページ一式はこのフォルダ配下にまとまっています。ページ直下構成のため、インポートは相対パスで統一しています。

## フォルダ構成

- `page.jsx` — ページ本体（レイアウトと配線）
- `components/` — 見た目用コンポーネント
  - `EmployeeCard.jsx` — 従業員カード表示（編集メニュー呼び出し）
  - `EmployeeFormDialog.jsx` — 追加/編集ダイアログ（アバター色選択含む）
  - `FiltersBar.jsx` — 検索/部署/在籍状況のフィルタバー
- `utils/`
  - `api.js` — 認証ヘッダ・色コードユーティリティ（ensureHash/stripHash）

## 役割（ざっくり）

- `page.jsx`
  - 画面の土台。フィルタ状態、一覧、モーダル開閉、メニュー開閉など UI 状態を持つ
  - データは API から直接取得し、`EmployeeCard` に表示用データを渡す
  - 追加/編集/削除はモーダルとメニュー経由で実行

- `components/*`
  - `EmployeeCard.jsx`: 名前・ID・担当・役職・在籍状況・備考の表示。編集メニュー（権限があれば）
  - `EmployeeFormDialog.jsx`: フォームダイアログ。役割/ライン/在籍状況の選択、アイコン色の選択、パスワード入力の表示切替
  - `FiltersBar.jsx`: 検索テキスト、担当ライン、在籍状況のフィルタ UI

- `utils/api.js`
  - `getAuthHeaders()`: localStorage/sessionStorage のトークンから Authorization ヘッダを生成
  - `ensureHash(hex)`: `#` 付きに正規化
  - `stripHash(hex)`: `#` を除去

## インポート方針（重要）

- 本ページ配下は相対パスで統一しています。
  - 例: `./components/EmployeeCard`, `./components/FiltersBar`, `./utils/api`
- なお、プロジェクト全体では `@/*` エイリアスが使えますが、employee-list 配下は移動に強い構成のため相対パス運用に寄せています。

## API 連携

- ベースパス: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/...`
- 認証: `Authorization: Bearer <token>`（`utils/api.js` の `getAuthHeaders` 利用）
- 使用エンドポイント（想定）
  - GET `/api/roles` — 役割マスタ取得
  - GET `/api/lines` — ラインマスタ取得
  - GET `/api/employees` — 従業員一覧取得（クエリ: `name_like`/`line_name`/`is_active`）
  - POST `/api/employees` — 追加
  - PUT `/api/employees/{employee_id}` — 更新
  - DELETE `/api/employees/{employee_id}` — 削除

## 動作メモ

- 検索は 350ms デバウンスで再取得
- 在籍状況は API の `is_active` から '在籍中'/'退職済' へマッピング
- 役割/ラインはマスタ API で取得し、未選択時の扱いを UI 側で補完

## よくあるつまずき（対処）

- 認証エラーで一覧が取得できない
  - 対処: ログイン後、トークンが localStorage または sessionStorage に入っているか確認
- 色コードで `#` の有無による色表示の不一致
  - 対処: 表示系は `ensureHash`、送信系は `stripHash` を利用
- ページ移動やフォルダ整理後の import エラー
  - 対処: 相対パスが合っているか確認し、必要なら Next の開発サーバーを再起動

## 触りたいときの目安

- 画面の配置やボタンを増やす → `page.jsx`
- API の取り回し / バリデーション → `page.jsx` と `utils/api.js`
- 見た目だけ直したい → `components/*`
