-- 【Role (権限) マスタ化】
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,            -- 自動採番
    role_name VARCHAR(50) UNIQUE NOT NULL  -- 権限名(例:"管理者"や"一般")
);

-- 【Production Line (担当ライン) マスタ化】
CREATE TABLE production_lines (
    line_id SERIAL PRIMARY KEY,            -- 自動採番
    line_name VARCHAR(100) UNIQUE NOT NULL -- ライン名(例:"ラインA"や"ラインB")
);

-- 【Employee ID (従業員ID) で統一管理】
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,               -- 自動採番
    employee_name VARCHAR(100) NOT NULL,          -- 名前（フルネーム）
    employee_user_id VARCHAR(50) UNIQUE NOT NULL, -- ユーザーID(ログイン用、一意)
    employee_password VARCHAR(255) NOT NULL,      -- パスワード(ハッシュ保存推奨)
    employee_is_active BOOLEAN DEFAULT TRUE,      -- 有効/無効フラグ(TRUE=有効)
    employee_role_name VARCHAR(50) NOT NULL,      -- 権限名
    employee_line_name VARCHAR(50) NOT NULL,      -- 担当ライン名
    employee_special_notes TEXT,                  -- 特記事項（メモなど）
    employee_color_code CHAR(6)                   -- カラーコード（例:"FF0000"）
    --FOREIGN KEY (employee_role_name) REFERENCES roles(role_id),
    --FOREIGN KEY (employee_line_name) REFERENCES production_lines(line_id)
);

-- 【Reports(日報)】
CREATE TABLE reports (
    report_id SERIAL PRIMARY KEY,            -- 自動採番
    report_employee_id INT NOT NULL,         -- 担当者ID（employeesテーブルの外部キー）
    report_date DATE NOT NULL,               -- 日付（対象の日報日）
    report_product_name VARCHAR(100),        -- 製品名（任意）
    report_line_id INT NOT NULL,             -- 担当ラインID（production_linesテーブルの外部キー）
    report_production_result INT,            -- 生産結果（数量）
    report_today_work TEXT,                  -- 本日の作業内容
    report_memo TEXT,                        -- メモ・備考
    FOREIGN KEY (report_employee_id) REFERENCES employees(employee_id),
    FOREIGN KEY (report_line_id) REFERENCES production_lines(line_id)
);

-- 【Notification Priority (優先度) マスタ化】
CREATE TABLE priorities (
    priority_id SERIAL PRIMARY KEY,           -- 優先度ID（自動採番）
    priority_label VARCHAR(20) UNIQUE NOT NULL -- 優先度ラベル（例: "至急対応", "通常対応"）
);

-- 【Notifications(生産目標通知)】
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,         -- 通知ID（自動採番）
    notification_data_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 通知日時（自動設定）
    notification_line_id INT NOT NULL,          -- 担当ラインID（外部キー）
    notification_quantity INT NOT NULL,         -- 生産数量
    notification_item_name VARCHAR(50),         -- 品名
    notification_item_size VARCHAR(50),         -- サイズ
    notification_color VARCHAR(50),             -- カラー
    notification_spring_type VARCHAR(50),       -- バネタイプ
    notification_accessories VARCHAR(50),       -- 同梱品
    notification_delivery_method VARCHAR(50),   -- 配送方法
    notification_delivery_address VARCHAR(100), -- 配送先住所
    notification_delivery_company VARCHAR(50),  -- 配送会社名
    notification_remarks TEXT,                  -- 備考
    notification_priority_id INT NOT NULL,      -- 優先度ID（外部キー）
    FOREIGN KEY (notification_line_id) REFERENCES production_lines(line_id),
    FOREIGN KEY (notification_priority_id) REFERENCES priorities(priority_id)
);

-- 【Machine Name (機械名) マスタ化】
CREATE TABLE machines (
    machine_id SERIAL PRIMARY KEY,             -- 機械ID（自動採番）
    machine_name VARCHAR(100) UNIQUE NOT NULL  -- 機械名（例: "生産機Mk-I"）
);

-- 【Machine Status(生産機械状況)】
CREATE TABLE machine_status (
    machine_status_id SERIAL PRIMARY KEY,
    machine_data_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    machine_id INT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('稼働中','停止中','異常あり','メンテ中')),
    today_uptime_seconds INT DEFAULT 0,
    today_production_count INT DEFAULT 0,
    machine_last_inspection DATE,
    next_inspection_date DATE
    --FOREIGN KEY (machine_id) REFERENCES machines(machine_id)
);
-- 【Machine Logs（機械エラーログ履歴）】
CREATE TABLE machine_logs (
    log_id SERIAL PRIMARY KEY,
    machine_id INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    log_type VARCHAR(10) CHECK (log_type IN ('error','warning','info')),
    title VARCHAR(100) NOT NULL,
    message TEXT,
    FOREIGN KEY (machine_id) REFERENCES machines(machine_id)
);


--【画像検査テーブル】
CREATE TABLE inspection_results (
    inspection_id SERIAL PRIMARY KEY,                                   -- 自動採番
    inspection_camera_id VARCHAR(50) NOT NULL,                          -- カメラ名
    inspection_product_id VARCHAR(50) NOT NULL,                         -- 製品名
    inspection_result VARCHAR(50) NULL,                                 -- 検査結果（良品、不良など）
    inspection_reason TEXT NULL,                                        -- 問題点詳細
    inspection_image_path TEXT NOT NULL,                                -- 検査画像パス
    inspection_captured_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,       -- 撮影日時
    inspection_inspected_time TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP -- 検査日時
);

--【ホックリング残数・生産数テーブル】
CREATE TABLE machine_production (
    machine_prod_id SERIAL PRIMARY KEY,                             -- 生産データID（自動採番）
    machine_prod_captured_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 記録日時
    machine_prod_hook_remaining INT NOT NULL,                       -- ホックリング残数
    machine_prod_count INT NOT NULL                                 -- 生産数
);

-- 【生産数管理テーブル】
CREATE TABLE production_reports (
    prodreport_id SERIAL PRIMARY KEY,              -- 自動採番
    prodreport_date DATE NOT NULL,                 -- 日付
    prodreport_product_name VARCHAR(100) NOT NULL, -- 製品名
    prodreport_plan_quantity INT NOT NULL,         -- 計画数量
    prodreport_actual_quantity INT NOT NULL,       -- 実績数量
    prodreport_achievement_rate DECIMAL(5,2),      -- 達成率（例: 95.00）
    prodreport_defective_quantity INT NOT NULL,    -- 不良数
    prodreport_employee_id INT,                    -- 担当者ID（employeesテーブルの外部キー）
    prodreport_remarks TEXT,                       -- 備考
    FOREIGN KEY (prodreport_employee_id) REFERENCES employees(employee_id)
);


--【部品在庫管理(棚ver)テーブル】
CREATE TABLE racks (
    rack_id SERIAL PRIMARY KEY,             -- 棚のID、自動で番号が振られる
    rack_name VARCHAR(255) NOT NULL UNIQUE, -- 棚の名前 (例: スプリング・小物資材ラック)
    rows INT NOT NULL CHECK (rows > 0),     -- 棚の行数 (1, 2, 3...)
    cols INT NOT NULL CHECK (cols > 0)      -- 棚の列数 (1, 2, 3...)
);

--【部品在庫管理(部品情報ver)テーブル】
CREATE TABLE slots (
    slot_id SERIAL PRIMARY KEY,                                       -- スロットのID、これも自動
    rack_id INT NOT NULL,                                             -- どの棚に属してるかのID
    slot_identifier VARCHAR(10) NOT NULL,                             -- 場所を示す識別子 (例: 'A-1', 'C-4')
    part_name VARCHAR(255),                                           -- ↓部品が入ってるときだけ値が入る↓
    part_model_number VARCHAR(100),
    quantity INT CHECK (quantity >= 0),
    color_code VARCHAR(7),
    UNIQUE (rack_id, slot_identifier),                                -- 同じ棚の同じ場所に2個は置けないようにする設定
    FOREIGN KEY (rack_id) REFERENCES racks(rack_id) ON DELETE CASCADE -- 存在しない棚には部品を置けないようにする設定
);









--以下廃棄？--

-- 【racks テーブル（棚マスタ）】
--CREATE TABLE racks (
    --rack_id SERIAL PRIMARY KEY,              -- レコードID（自動連番）
    --rack_name VARCHAR(100) UNIQUE NOT NULL,  -- 棚の名前（例: "A-1棚"）
    --rack_location VARCHAR(255) NOT NULL,     -- 保管場所（例: "第1倉庫 A-1列"）
    --rack_qr_path VARCHAR(255)                -- QRコード画像パス
--);

-- 【parts_inventory テーブル（部品在庫）】
--CREATE TABLE parts_inventory (
    --parts_id SERIAL PRIMARY KEY,                 -- 部品在庫ID（自動連番）
    --parts_rack_id INT NOT NULL,                  -- 棚ID（外部キー）
    --parts_name VARCHAR(100) NOT NULL,            -- 部品名
    --parts_number VARCHAR(100) NOT NULL,          -- 部品型番
    --parts_quantity INT NOT NULL DEFAULT 0,       -- 部品個数
    --parts_qr_path VARCHAR(255),                  -- 出庫用QRコード画像パス
    --parts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    --FOREIGN KEY (parts_rack_id) REFERENCES racks(rack_id) -- 外部キー制約
--);

