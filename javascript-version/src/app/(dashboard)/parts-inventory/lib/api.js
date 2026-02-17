/*
======== ファイル概要 ========
部品在庫APIとの通信を行う軽量クライアント。
GET時のキャッシュ無効化や共通エラーハンドリングを備え、アプリ側からはモック/本番を意識せず呼び出せるようにする。
*/

// パーツ在庫向けAPIクライアント (API client for Parts Inventory)

// GET 時にキャッシュをバイパスする JSON フェッチユーティリティ (Generic JSON fetch with cache-bypass for GET)
/**
 * JSONエンドポイントへアクセスし、GET時はタイムスタンプでキャッシュを回避する。
 * @param {string} url            - リクエスト先URL。
 * @param {object} [options={}]   - fetchに渡す追加オプション。
 * @returns {Promise<any>}        - パース済みJSON、またはJSONでない場合はテキスト/ null。
 */
export async function fetchJson(url, options = {}) {
  const opts = { ...options };
  const method = (opts.method || 'GET').toUpperCase();
  let finalUrl = url;

  if (method === 'GET') {
    finalUrl = url + (url.includes('?') ? '&' : '?') + `_=ts${Date.now()}`;
    opts.cache = 'no-store';
    opts.headers = { ...(opts.headers || {}), 'Cache-Control': 'no-cache' };
  }

  const res = await fetch(finalUrl, opts);

  if (!res.ok) {
    const txt = await res.text().catch(() => '');

    throw new Error(`HTTP ${res.status} ${res.statusText} - ${txt}`);
  }

  const contentType = (res.headers.get('content-type') || '').toLowerCase();

  if (res.status === 204) return null;

  if (!contentType.includes('application/json')) {
    const txt = await res.text().catch(() => '');

    if (!txt) return null;
    try { return JSON.parse(txt); } catch { return null; }
  }

  
return res.json().catch(() => null);
}

/**
 * APIベースURLを受け取り、在庫操作に必要なエンドポイント関数群を返す。
 * @param {string} apiBase   - APIサーバーのルートURL。空文字なら同一オリジン。
 * @returns {object}         - 各種REST操作を行うメソッドセット。
 */
export function createApi(apiBase) {
  const base = apiBase || '';

  
return {
    listRacks: () => fetchJson(`${base}/api/racks`),
    getRack: rackId => fetchJson(`${base}/api/racks/${rackId}`),
    createRack: payload => fetchJson(`${base}/api/racks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }),
    deleteRack: rackId => fetchJson(`${base}/api/racks/${rackId}`, { method: 'DELETE' }),

    upsertSlot: (rackId, slotId, body) => fetchJson(`${base}/api/racks/${rackId}/slots/${encodeURIComponent(slotId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }),
    createSlot: (rackId, slotId, body) => fetchJson(`${base}/api/racks/${rackId}/slots/${encodeURIComponent(slotId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }),
    deleteSlot: (rackId, slotId) => fetchJson(`${base}/api/racks/${rackId}/slots/${encodeURIComponent(slotId)}`, { method: 'DELETE' }),
    useSlot: (rackId, slotId, qty) => fetchJson(`${base}/api/racks/${rackId}/slots/${encodeURIComponent(slotId)}/use`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity_to_use: qty })
    }),
    moveSlot: (fromRackId, fromSlotId, toRackId, toSlotId) => fetchJson(`${base}/api/racks/move/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from_rack_id: fromRackId,
        from_slot_identifier: fromSlotId,
        to_rack_id: toRackId,
        to_slot_identifier: toSlotId
      })
    })
  };
}

/**
 * APIから返却されたスロット情報をアプリ内部の部品モデルへ変換する。
 * @param {object|null} slot   - APIレスポンスのslotオブジェクト。
 * @returns {object|null}      - アプリ内で扱いやすい部品情報。部品なしなら null。
 */
export function mapApiSlotToAppPart(slot) {
  if (!slot) return null;
  
return {
    partName: slot.part_name,
    partModelNumber: slot.part_model_number || '',
    quantity: slot.quantity,
    color: (slot.color_code || '').toString().replace(/^#/, '')
  };
}
