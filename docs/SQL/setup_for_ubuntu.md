# Ubuntu で PostgreSQL をセットアップして本プロジェクト用 DB を構築する

この手順では、Ubuntu 上に PostgreSQL をインストールし、本プロジェクトの接続情報に合わせて「ユーザー: `nakamura` / パスワード: `g3`、データベース: `g3db`」を用意します。

> 想定環境: Ubuntu 22.04/24.04 系、PostgreSQL 14 〜 16

## 1. PostgreSQL のインストール

```bash
# パッケージ更新
sudo apt update

# PostgreSQL と拡張(サーバ/クライアント/追加ツール)をインストール
sudo apt install -y postgresql postgresql-contrib

# バージョン確認（任意）
psql --version
```

## 2. サービス起動と初期状態確認

```bash
# サービス起動（通常は自動起動済み）
sudo systemctl enable --now postgresql

# ステータス確認
sudo systemctl status postgresql --no-pager
```

## 3. DB ユーザー/DB 作成と基本設定

以下のSQLを一括実行します。リポジトリのルートで実行してください。

```bash
sudo -u postgres psql -f SQL/setup_for_ubuntu.sql
```

実行される内容:
- ロール `nakamura` の作成/更新（ログイン権限・パスワード `g3`）
- DB `g3db` の作成（未作成時のみ）
- タイムゾーンを `Asia/Tokyo` に設定
- `public` スキーマの所有者/権限を `nakamura` に設定
- `SQL/create.sql`（スキーマ）と `SQL/testdata.sql`（サンプルデータ）を適用

### (任意) OS の Linux ユーザーも作成する場合
`pg_hba.conf` を `peer` 認証にする運用や、サービス実行ユーザーを作っておきたい場合は、OS の `nakamura` ユーザーも作成しておくと便利です。

```bash
# UID/GID 自動採番、ホームディレクトリ付きで作成
sudo adduser --disabled-password --gecos "" nakamura

# 必要に応じてパスワードを設定（DBのパスワードとは別物）
# 例1) 対話的に設定（推奨）
sudo passwd nakamura

# サービス実行ユーザーとして使う場合、sudo 付与は慎重に検討
# sudo usermod -aG sudo nakamura
```

OSユーザーを作成した場合、`pg_hba.conf` を `peer`/`ident` などへ切り替えると、OSユーザー=DBユーザーの紐付けでパスワード無し接続も可能です（セキュリティ/運用方針に合わせて設定してください）。

#### 品質チェックを回避して OS パスワードを『g3』に固定する
開発用途などでどうしても弱いパスワードを設定したい場合は、`pam_pwquality` の辞書チェックを通さずに暗号化済みパスワードを直接適用します。

```bash
# OpenSSL が未インストールなら導入
sudo apt update && sudo apt install -y openssl

# 'g3' を SHA-512 でハッシュ化して環境変数に格納
HASH=$(openssl passwd -6 'g3')

# 暗号化済み(-e)として chpasswd に適用（品質チェックを回避）
echo "nakamura:$HASH" | sudo chpasswd -e
```

注意: セキュリティ上は非推奨です。本番やインターネットに露出する環境では使用しないでください。

## 4. リモート接続の許可（必要な場合）

LAN など他ホストから接続したい場合は PostgreSQL サーバ設定を変更します。

```bash
# 設定ファイルの場所確認（例: 16 の場合）
PG_MAJOR=$(psql -V | awk '{print $3}' | cut -d. -f1)
CONF_DIR="/etc/postgresql/${PG_MAJOR}/main"

echo $CONF_DIR
```

- `postgresql.conf` の `listen_addresses` を `'*'` に設定

```bash
sudo sed -i "s/^#\?listen_addresses.*/listen_addresses = '*' /" "$CONF_DIR/postgresql.conf"
```

- `pg_hba.conf` に接続許可を追加（例: 192.168.0.0/16 からの md5 認証を許可）

```bash
echo "host    all             all             192.168.0.0/16        md5" | sudo tee -a "$CONF_DIR/pg_hba.conf"
```

- サービス再起動

```bash
sudo systemctl restart postgresql
```

## 5. 接続確認

ローカル/リモートいずれでも、以下で接続を確認できます。

```bash
psql -h 192.168.0.20 -U nakamura -d g3db
# パスワード: g3
```

SQLが通ることを確認:

```sql
SELECT current_database(), current_user, current_setting('timezone');
SELECT COUNT(*) FROM employees;  -- スキーマ適用済みなら実行可
```

## 6. Next.js からの接続（参考）

アプリ側の接続先はネットワークIP自動判定で切り替わります。
- 192.168.x.x のサーバ上で実行 → `192.168.0.20:5432`
- 10.x.x.x のサーバ上で実行 → `10.100.54.170:5432`

該当コード: `src/lib/db.js`

## トラブルシュート

- `psql: error: connection to server ... refused` → ファイアウォール/`listen_addresses`/ポート5432開放を確認
- `password authentication failed` → ユーザー/パスワード/`pg_hba.conf` の方式が `md5` か確認
- `relation "employees" does not exist` → `SQL/create.sql` の適用漏れ。`setup_for_ubuntu.sql` を再実行

---
以上で、Ubuntu 上に本プロジェクトの DB 環境が整います。必要に応じてパラメータ（`shared_buffers` など）をチューニングしてください。