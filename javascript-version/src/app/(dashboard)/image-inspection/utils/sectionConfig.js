/*
======== ファイル概要 ========
セクション名ごとにどのカメラが存在するかを定義した設定モジュール。
*/
/**
 * セクション名→カメラ配列の定義。
 * @type {Record<string, {cameras: string[]}>}
 */
export const SECTION_CONFIG = {
    'バネ留め': { cameras: ['B-spring01', 'B-spring02', 'B-spring03', 'B-spring04'] },
    'A層': { cameras: ['A-main01'] },
}

export const SECTIONS = Object.keys(SECTION_CONFIG)
