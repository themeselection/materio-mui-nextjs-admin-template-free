# SSE イベント一覧

バックエンドの各 API から配信されるサーバー送信イベント (SSE) は、リアルタイム通知としてイベント名と日本語メッセージのみを持つミニマルなペイロードに統一されました。詳細なデータが必要な場合は、該当リソースを再度 GET で取得してください。

各イベントの共通フォーマット:

```json
{
  "ivent": "<イベント名>",
  "message": "<日本語メッセージ>"
}
```

## 接続確立

```json
{
  "ivent": "sse:connected",
  "message": "SSE 接続が確立されました"
}
```

## PLCイベント

### PLCログ受信
`POST /api/ingress/plc`

```json
{
  "ivent": "plc:logReceived",
  "message": "PLCログが受信されました"
}
```

## 機械イベント

### 機械稼働開始
`POST /api/machines/{id}/start`

```json
{
  "ivent": "machine:started",
  "message": "機械の稼働が開始されました"
}
```

## 検査系イベント

### 検査前画像アップロード
`POST /api/ingress/inspection/{lot_id}`

```json
{
  "ivent": "inspection:imageUploaded",
  "message": "検査前画像がアップロードされました"
}
```

### 検査ロット初期登録
`POST /api/ingress/inspection`

```json
{
  "ivent": "inspection:lotCreated",
  "message": "検査ロットが新規登録されました"
}
```

### 検査結果一括登録
`POST /api/ingress/inspection/batch/{lot_id}`

```json
{
  "ivent": "inspection:batchUploaded",
  "message": "検査結果が一括で登録されました"
}
```

### 検査結果更新（単発）
`PUT /api/ingress/inspection/result/{filename}`

```json
{
  "ivent": "inspection:resultUpdated",
  "message": "検査結果が更新されました"
}
```

### 検査リセット
`POST /api/ingress/inspection/{lot_id}/reset`

```json
{
  "ivent": "inspection:lotReset",
  "message": "検査ロットがリセットされました"
}
```

### 検査ロット削除
`DELETE /api/ingress/inspection/{lot_id}`

```json
{
  "ivent": "inspection:lotDeleted",
  "message": "検査ロットが削除されました"
}
```

## 生産系イベント

### 生産インクリメント
`POST /api/machines/{id}/increment-production`

```json
{
  "ivent": "production:lotIncremented",
  "message": "生産数がインクリメントされました"
}
```

---

各イベントで詳細情報が必要になった場合は、最新状態を取得するために該当エンドポイントへ GET リクエストを送信してください。
