/*
======== ファイル概要 ========
出荷指示画面のローカル動作用サンプルデータと選択肢定義。新しい API 形式に合わせたフィールド名を保持して
います。
*/

// サンプルデータ: 新しいAPI仕様に合わせた形
/**
 * サンプル出荷指示。
 * @type {Array<object>}
 */
export const initialInstructions = [
    {
        id: 1,                                          // 指示ID
        line: 'ボトム',                                 // ライン名
        product_name: '木枠',                           // 製品名
        size: '1200x1950x170',                          // サイズ
        color: 'こげ茶',                                // 色
        spring_type: '2R/M8脚',                         // スプリング種類
        included_items: '',                            // 同梱物
        shipping_method: '㈱西',                        // 出荷方法
        destination: 'フラワーホテル',                  // 出荷先
        remarks: '',                                    // 備考
        quantity: 1,                                    // 数量
        is_completed: false,                            // 完了フラグ
        created_at: '2025-04-23T10:00:00Z'              // 作成日時
    },
    {
        id: 2, // 指示ID
        line: 'ボトム', // ライン名
        product_name: '木枠', // 製品名
        size: '1200x1950x170', // サイズ
        color: 'こげ茶', // 色
        spring_type: '2R/M8脚', // スプリング種類
        included_items: '', // 同梱物
        shipping_method: '㈱濃', // 出荷方法
        destination: 'グリーンホテル北上', // 出荷先
        remarks: '', // 備考
        quantity: 1, // 数量
        is_completed: false, // 完了フラグ
        created_at: '2025-04-23T15:30:00Z' // 作成日時
    },
    {
        id: 3, // 指示ID
        line: 'マット', // ライン名
        product_name: 'マット', // 製品名
        size: '1200x1950x200 SD', // サイズ
        color: 'GMBE', // 色
        spring_type: '平/1.9', // スプリング種類
        included_items: '西川仕様 / 西川アイロンシール', // 同梱物
        shipping_method: '西', // 出荷方法
        destination: 'フラワーホテル / ㈱西川', // 出荷先
        remarks: '', // 備考
        quantity: 1, // 数量
        is_completed: false, // 完了フラグ
        created_at: '2025-04-23T15:30:00Z' // 作成日時
    },
    {
        id: 4, // 指示ID
        line: 'マット', // ライン名
        product_name: 'マット', // 製品名
        size: '1200x1950x200 SD', // サイズ
        color: 'GMBE', // 色
        spring_type: '平/1.9', // スプリング種類
        included_items: '西川仕様 / 西川アイロンシール', // 同梱物
        shipping_method: '㈱濃', // 出荷方法
        destination: 'グリーンホテル北上 / ㈱西川', // 出荷先
        remarks: '', // 備考
        quantity: 1, // 数量
        is_completed: false, // 完了フラグ
        created_at: '2025-04-23T15:30:00Z' // 作成日時
    },
    {
        id: 5, // 指示ID
        line: 'マット', // ライン名
        product_name: 'サポート', // 製品名
        size: '80巾', // サイズ
        color: '5cm', // 色
        spring_type: '', // スプリング種類
        included_items: '', // 同梱物
        shipping_method: 'Amazon', // 出荷方法
        destination: '福岡県 小都 / Amazon', // 出荷先
        remarks: '', // 備考
        quantity: 1, // 数量
        is_completed: false, // 完了フラグ
        created_at: '2025-04-23T15:30:00Z' // 作成日時
    },
    {
        id: 6, // 指示ID
        line: 'マット', // ライン名
        product_name: '天の羽衣', // 製品名
        size: '', // サイズ
        color: '', // 色
        spring_type: '', // スプリング種類
        included_items: '', // 同梱物
        shipping_method: '夜', // 出荷方法
        destination: '名古屋 / Amazon / オアシス便', // 出荷先
        remarks: '', // 備考
        quantity: 2, // 数量
        is_completed: false, // 完了フラグ
        created_at: '2025-04-23T15:30:00Z' // 作成日時
    },
    {
        id: 7, // 指示ID
        line: 'マット', // ライン名
        product_name: 'マット', // 製品名
        size: '', // サイズ
        color: '', // 色
        spring_type: '', // スプリング種類
        included_items: '', // 同梱物
        shipping_method: '積', // 出荷方法
        destination: '名古屋 / Amazon / オアシス便', // 出荷先
        remarks: '', // 備考
        quantity: 8, // 数量
        is_completed: false, // 完了フラグ
        created_at: '2025-04-23T15:30:00Z' // 作成日時
    },
    {
        id: 8, // 指示ID
        line: 'マット', // ライン名
        product_name: '木枠', // 製品名
        size: '', // サイズ
        color: '', // 色
        spring_type: '', // スプリング種類
        included_items: '', // 同梱物
        shipping_method: '', // 出荷方法
        destination: '名古屋 / Amazon / オアシス便', // 出荷先
        remarks: '', // 備考
        quantity: 37, // 数量
        is_completed: false, // 完了フラグ
        created_at: '2025-04-23T15:30:00Z' // 作成日時
    },
]

/**
 * ライン選択肢。
 * @type {Array<{value:string,label:string}>}
 */
export const lineOptions = [
    { value: 'すべて', label: 'すべて' },
    { value: 'マット', label: 'マット' },
    { value: 'ボトム', label: 'ボトム' },
    { value: 'その他', label: 'その他' },
]

/**
 * 完了状態選択肢。
 * @type {Array<{value:string,label:string}>}
 */
export const completedOptions = [
    { value: 'all', label: 'すべて' },
    { value: 'completed', label: '完了' },
    { value: 'not-completed', label: '未完了' },
]
