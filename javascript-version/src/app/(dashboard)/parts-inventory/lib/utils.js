/*
======== ファイル概要 ========
レガシー部品在庫アプリで再利用する文字列整形やID変換、ローカルストレージ補助関数を集約。
描画やモーダルモジュールからの共通利用を想定している。
*/

// 部品在庫レガシーアプリ向けユーティリティ群 (Utility helpers for Parts Inventory legacy app)

// 表示用のサニタイズ処理 (Sanitize for display)
/**
 * nullや文字列 "null" を空文字に揃えつつ、表示用の文字列に変換する。
 * @param {any}    v               - 表示したい値。
 * @param {string} [fallback='']   - 無効値の場合に返すフォールバック文字列。
 * @returns {string}               - 表示用に整形された文字列。
 */
export function s(v, fallback = '') {
  if (v === null || v === undefined) return fallback;
  if (v === 'null' || v === 'undefined') return fallback;
  
return String(v);
}

// rack-1 のようなIDから数値のラックIDを取り出す (Extract numeric rack id from element/id like "rack-1")
/**
 * ラック要素やID文字列から数値部分のみを安全に抽出する。
 * @param {string|object} rackLike   - idプロパティを持つオブジェクトまたは文字列ID。
 * @returns {number|null}            - 数値ID。抽出できなければ null。
 */
export function getRackNumericId(rackLike) {
  if (!rackLike) return null;
  const id = parseInt(String(rackLike.id ?? rackLike).replace(/[^0-9]/g, ''), 10);

  
return Number.isFinite(id) ? id : null;
}

// 最後に開いたラックを記憶するストレージヘルパー (Last rack selection storage helpers, keyed by apiBase)
/**
 * APIベースURLごとに最後に閲覧したラックIDを保存・取得する関数を返す。
 * @param {string} apiBase   - APIベースURL。ローカルストレージのキーに含めて環境差異を避ける。
 * @returns {object}         - setLastRackId / getLastRackId を含む操作オブジェクト。
 */
export function createLastRackStorage(apiBase) {
  const key = `pi:lastRackId:${apiBase || 'same-origin'}`;

  const setLastRackId = id => {
    try {
      if (id) localStorage.setItem(key, id);
      else localStorage.removeItem(key);
    } catch {}
  };

  const getLastRackId = () => {
    try { return localStorage.getItem(key); } catch { return null; }
  };

  
return { setLastRackId, getLastRackId };
}

// APIレスポンスをアプリ内部のデータ構造へ変換する (Transform backend API data shape to internal app data shape)
/**
 * ラック配列のレスポンスをアプリで扱うプロパティ名へ変換する。
 * @param {Array} apiData   - APIから返却されたラックデータ配列。
 * @returns {Array}         - アプリ内部で利用するラックオブジェクト配列。
 */
export function transformApiDataToAppData(apiData) {
  return apiData.map(rack => {
    const slotsObject = {};
    let maxRow = rack.rows || 0;
    let maxCol = rack.cols || 0;

    if (rack.slots) {
      rack.slots.forEach(slot => {
        if (slot.part) {
          slotsObject[slot.slot_id] = {
            partName: slot.part.part_name,
            partModelNumber: slot.part.part_model_number,
            quantity: slot.part.quantity,
            color: slot.part.color_code
          };
        }

        if (!rack.rows || !rack.cols) {
          const [rowChar, colNumStr] = slot.slot_id.split('-');
          const rowNum = rowChar.charCodeAt(0) - 64;
          const colNum = parseInt(colNumStr);

          if (rowNum > maxRow) maxRow = rowNum;
          if (colNum > maxCol) maxCol = colNum;
        }
      });
    }

    return {
      id: `rack-${rack.rack_id}`,
      name: rack.rack_name,
      rows: maxRow,
      cols: maxCol,
      slots: slotsObject
    };
  });
}
