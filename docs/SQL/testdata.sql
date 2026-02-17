-- roles (権限) テーブルへの仮データ挿入
INSERT INTO roles (role_name) VALUES
('管理者'),
('一般'),
('リーダー'),
('研修生'),
('スタッフ');

-- production_lines (担当ライン) テーブルへの仮データ挿入
INSERT INTO production_lines (line_name) VALUES
('組立'),
('塗装'),
('検査'),
('梱包'),
('特殊');

-- employees (従業員) テーブルへの仮データ挿入
-- パスワードは実際にはハッシュ化して保存してください
INSERT INTO employees (employee_name, employee_user_id, employee_password, employee_is_active, employee_role_name, employee_line_name, employee_special_notes, employee_color_code) VALUES
('山田 太郎', 't.yamada', 'password123', TRUE, 'リーダー', '組立', 'フォークリフト免許保持', 'a3a8e6'),
('佐藤 花子', 'h.sato', 'password123', TRUE, 'スタッフ', '塗装', '色彩検定2級', 'e6a3c8');

-- reports (日報) テーブルへの仮データ挿入
INSERT INTO reports (report_employee_id, report_date, report_product_name, report_line_id, report_production_result, report_today_work, report_memo) VALUES
(1, '2025-07-24', 'システム保守', 1, NULL, 'サーバーの定期メンテナンスを実施。', '特に問題なし。'),
(2, '2025-07-24', '製品A', 1, 155, '製品Aの組立作業。', '部品の供給がスムーズだった。'),
(3, '2025-07-24', '製品B', 2, 210, '製品Bの塗装作業。', '新人への指導を実施。'),
(4, '2025-07-24', '製品C', 3, 500, '製品Cの外観検査。', '軽微な傷を2件発見。'),
(5, '2025-07-24', '製品D', 4, 300, '製品Dの梱包および出荷準備。', '梱包材が残りわずか。');

-- priorities (優先度) テーブルへの仮データ挿入
INSERT INTO priorities (priority_label) VALUES
('至急対応'),
('通常対応'),
('高'),
('中'),
('低');

-- notifications (生産目標通知) テーブルへの仮データ挿入
INSERT INTO notifications (notification_line_id, notification_quantity, notification_item_name, notification_item_size, notification_color, notification_spring_type, notification_accessories, notification_delivery_method, notification_delivery_address, notification_delivery_company, notification_remarks, notification_priority_id) VALUES
(1, 500, 'フックリングV2', 'M', 'シルバー', '標準バネ', '説明書A', '通常便', '東京都千代田区1-1-1', 'ABC運送', '7月末納期厳守', 1),
(2, 1000, '装飾パネル', 'L', 'ブラック', NULL, '取付ネジセット', 'チャーター便', '大阪府大阪市北区2-2-2', 'XYZ物流', NULL, 2),
(3, 2500, '検査キット', 'S', 'クリア', NULL, NULL, '通常便', '愛知県名古屋市中区3-3-3', '東海運輸', '割れ物注意', 3),
(4, 800, '梱包箱セット', 'M', '茶', NULL, '緩衝材', '定期便', '福岡県福岡市博多区4-4-4', '九州急便', NULL, 4),
(1, 1200, 'フックリングV3', 'M', 'ゴールド', '強化バネ', '説明書B', '航空便', '北海道札幌市中央区5-5-5', '北国空輸', '至急オーダー', 1);

-- machines (機械名) テーブルへの仮データ挿入
INSERT INTO machines (machine_name) VALUES
('プレス機Mk-I'),
('自動塗装機-02'),
('画像検査装置-Z'),
('自動梱包機-X1'),
('特殊加工機-α');

-- machine_status (生産機械状況) テーブルへの仮データ挿入
INSERT INTO machine_status (
  machine_id, status, machine_last_inspection
)
VALUES
(1, '稼働中', '2025-07-01'),
(2, '停止中', '2025-07-20'),
(3, '稼働中', '2025-06-15'),
(4, '異常あり', '2025-05-10'),
(5, 'メンテ中', '2025-07-22');

-- 【machine_logs（機械エラーログ履歴）】テスト用データ挿入
INSERT INTO machine_logs (machine_id, log_type, title, message, timestamp)
VALUES
(1, 'error',   'E-102: トルク過負荷',           'モーターの負荷が規定値を超えました。', '2025-07-15 10:15:32'),
(1, 'warning', 'W-05: 潤滑油低下',               '潤滑油が規定レベルを下回っています。', '2025-07-15 09:30:11'),
(1, 'info',    'I-001: 起動シーケンス完了',       '',                                  '2025-07-15 08:00:05');


-- inspection_results (検査画像) テーブルへの仮データ挿入
INSERT INTO inspection_results (inspection_status, inspection_trouble_info, inspection_image_path) VALUES
('PASS', NULL, '/images/inspection/20250901_01.jpg'),
('FAIL', '位置ずれ', '/images/inspection/20250901_02.jpg');



-- machine_production (ホックリング残数・生産数) テーブルへの仮データ挿入
INSERT INTO machine_production (machine_prod_hook_remaining, machine_prod_count) VALUES
(5000, 10250),
(4850, 10400),
(4700, 10550),
(4550, 10700),
(4400, 10850);

-- production_reports (生産数管理) テーブルへの仮データ挿入
INSERT INTO production_reports (prodreport_date, prodreport_product_name, prodreport_plan_quantity, prodreport_actual_quantity, prodreport_achievement_rate, prodreport_defective_quantity, prodreport_employee_id, prodreport_remarks) VALUES
('2025-07-23', '製品A', 300, 270, 90.00, 5, 2, '材料の入荷遅れにより計画未達。'),
('2025-07-23', '製品B', 200, 200, 100.00, 2, 3, '計画通り完了。'),
('2025-07-24', '製品A', 300, 310, 103.33, 3, 2, '計画を上回って生産。'),
('2025-07-24', '製品B', 200, 195, 97.50, 1, 3, '塗料のトラブルで一時停止。'),
('2025-07-24', '製品C', 500, 500, 100.00, 2, 4, '検査完了。');



--棚作成
INSERT INTO racks (rack_name, rows, cols) VALUES
('スプリング・小物資材ラック', 3, 4);

--上記rack_id=1('スプリング・小物資材ラック')に部品追加
INSERT INTO slots (rack_id, slot_identifier, part_name, part_model_number, quantity, color_code) VALUES
(1, 'A-1', 'ポケットコイル', 'PC-S-H20', 25, '#FF5733');

--空スロット用
INSERT INTO slots (rack_id, slot_identifier)VALUES
(1, 'A-2');