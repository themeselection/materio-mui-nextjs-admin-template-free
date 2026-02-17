/*
======== ファイル概要 ========
モーダル表示ロジックをまとめ、レガシーDOMとReactモーダルブリッジの間を仲介するヘルパー群。
部品在庫アプリで利用する各種モーダルをここから呼び出す。
*/

// モーダル制御ヘルパー群 (Modal helpers bridged via ModalBridge React component)
import { s, getRackNumericId } from './utils';
import { startQrScanner } from './qrScanner';

/**
 * モーダルブリッジが公開する関数を通じてHTML文字列モーダルを開く。
 * @param {object} [options={}]                     - モーダルの構成情報。
 * @param {string} [options.title='']              - タイトル文字列。
 * @param {string} [options.html='']               - 内容として埋め込むHTML文字列。
 * @param {Array}  [options.actions=[]]            - ボタン定義配列。
 * @param {string} [options.maxWidth='sm']         - MUI DialogのmaxWidth指定。
 * @param {Function|null} [options.onOpen=null]    - 表示完了後に呼ばれるフック。
 * @returns {void}
 */
export function openModalWithBridge({ title = '', html = '', actions = [], maxWidth = 'sm', onOpen = null } = {}) {
  if (typeof window !== 'undefined' && typeof window.__pi_openModal === 'function') {
    window.__pi_openModal({ title, html, actions, maxWidth, onOpen });
  } else {
    console.warn('Modal bridge not ready; falling back to alert');
    alert('モーダルを開けません (Bridge未初期化)');
  }
}

/**
 * モーダルブリッジが提供するクローズ関数を呼び出す。
 * @returns {void}
 */
export function closeModal() {
  if (typeof window !== 'undefined' && typeof window.__pi_closeModal === 'function') window.__pi_closeModal();
}

/**
 * QRコードスキャナー付きモーダルを表示し、読み取り結果をコールバックへ渡す。
 * @param {string}   title         - モーダルタイトル。
 * @param {string}   instruction   - ユーザーへの案内文。
 * @param {Function} onScan        - 読み取り成功時に呼ばれるコールバック。
 * @returns {void}
 */
export function showQrScannerModal(title, instruction, onScan) {
  openModalWithBridge({
    title,
    html: `
      <div class="p-6 text-center">
        <div class="grid grid-cols-2 gap-4 items-start">
          <div class="text-left">
            <ion-icon name="grid-outline" class="text-6xl text-gray-400"></ion-icon>
            <p class="mt-2 font-semibold">${s(instruction)}</p>
            <p id="qr-error" class="mt-2 text-sm text-red-600 hidden"></p>
          </div>
          <div class="relative rounded-lg overflow-hidden bg-black aspect-square">
            <video id="qr-video" autoplay playsinline class="absolute inset-0 w-full h-full object-cover"></video>
            <canvas id="qr-canvas" class="absolute inset-0 w-full h-full pointer-events-none opacity-0"></canvas>
            <div class="scanner-line absolute left-0 h-1 bg-red-500 w-full animate-pulse" style="top: 10%"></div>
          </div>
        </div>
      </div>
      <div class="p-4 bg-gray-50 flex justify-end space-x-2 rounded-b-xl">
        <button id="cancel-btn" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">キャンセル</button>
      </div>` ,
    onOpen: () => {
      const video = document.getElementById('qr-video');
      const canvas = document.getElementById('qr-canvas');
      const errEl = document.getElementById('qr-error');

      function showErr(msg) { if (!errEl) return; errEl.textContent = msg; errEl.classList.remove('hidden'); }

      let stopScanner = null;

      try {
        stopScanner = startQrScanner({
          videoEl: video,
          canvasEl: canvas,
          onDecode: data => {
            let payload = null;
            try { payload = JSON.parse(data); } catch { payload = { raw: data }; }
            // 停止とクローズ後にコールバック
            try { stopScanner && stopScanner(); } catch {}
            closeModal();
            try { onScan && onScan(payload); } catch (e) { console.warn('onScan callback error', e); }
          },
          onError: err => {
            console.error('QRスキャナ初期化エラー', err);
            showErr('カメラの起動に失敗しました。権限や接続状態をご確認ください。');
          },
          // 画面中央80%の正方形を検知範囲に設定（画面外や端の誤検知を低減）
          roi: { x: 0.1, y: 0.1, width: 0.8, height: 0.8 }
        });
      } catch (e) {
        console.error('QRスキャナ起動失敗', e);
        showErr('QRスキャナを開始できませんでした。');
      }

      document.getElementById('cancel-btn').onclick = () => {
        try { stopScanner && stopScanner(); } catch {}
        closeModal();
      };
    }
  });
}

/**
 * 新しいラックを作成するモーダルを開き、完了後にアプリ状態を更新する。
 * @param {object} ctx   - ラック作成時に利用するアプリケーションコンテキスト。
 * @returns {void}
 */
// ラック追加モーダル (Add Rack)
export function showAddRackModal(ctx) {
  openModalWithBridge({
    title: '新しいラックを作成',
    html: `
      <div class="p-6">
        <form id="add-rack-form" class="space-y-4">
          <div>
            <label for="new-rack-name" class="text-sm font-medium text-gray-700">ラック名</label>
            <input id="new-rack-name" name="rackName" required class="w-full bg-gray-100 focus:bg-white border-gray-300 rounded-md mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3" placeholder="例: A棟-3F-スチール棚">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="new-rack-rows" class="text-sm font-medium text-gray-700">縦 (行数)</label>
              <input id="new-rack-rows" name="rows" type="number" min="1" max="26" required class="w-full bg-gray-100 focus:bg-white border-gray-300 rounded-md mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3" value="5">
            </div>
            <div>
              <label for="new-rack-cols" class="text-sm font-medium text-gray-700">横 (列数)</label>
              <input id="new-rack-cols" name="cols" type="number" min="1" max="50" required class="w-full bg-gray-100 focus:bg-white border-gray-300 rounded-md mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3" value="5">
            </div>
          </div>
        </form>
      </div>
      <div class="p-4 bg-gray-100 flex justify-end space-x-2 rounded-b-xl">
        <button id="cancel-btn" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">キャンセル</button>
        <button id="confirm-add-rack-btn" type="submit" form="add-rack-form" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">作成</button>
      </div>`,
    onOpen: () => {
      document.getElementById('add-rack-form').onsubmit = async e => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const payload = {
          rack_name: formData.get('rackName'),
          rows: Number(formData.get('rows')),
          cols: Number(formData.get('cols'))
        };

        try {
          const created = await ctx.api.createRack(payload);

          const newRack = {
            id: `rack-${created.rack_id}`,
            name: created.rack_name || payload.rack_name,
            rows: created.rows || payload.rows,
            cols: created.cols || payload.cols,
            slots: {}
          };

          const next = ctx.racks.slice();

          next.push(newRack);
          ctx.setRacks(next);
          ctx.setCurrentRackId(newRack.id);
          ctx.setLastRackId(newRack.id);
          ctx.renderApp();
          closeModal();
        } catch (err) {
          console.error('ラック作成に失敗', err);
          alert('ラックの作成に失敗しました。サーバーの状態を確認してください。');
        }
      };

      document.getElementById('cancel-btn').onclick = closeModal;
    }
  });
}

/**
 * ラック削除確認モーダルを表示し、承認時にAPI削除およびUI更新を行う。
 * @param {object} ctx       - アプリケーションコンテキスト。
 * @param {string} rackId    - 削除対象のラックID。
 * @param {string} rackName  - 確認メッセージに表示するラック名。
 * @returns {void}
 */
// ラック削除モーダル (Delete Rack)
export function showDeleteRackModal(ctx, rackId, rackName) {
  const rackToDelete = ctx.racks.find(r => r.id === rackId);
  const hasParts = Object.values(rackToDelete?.slots || {}).some(slot => slot !== null);

  const warningMessage = hasParts
    ? '<p class="text-red-600 bg-red-100 p-3 rounded-lg text-sm mt-4"><ion-icon name="warning-outline" class="mr-2"></ion-icon>このラックには部品が保管されています。削除すると部品情報も失われます。</p>'
    : '';

  openModalWithBridge({
    title: 'ラックの削除',
    html: `
      <div class="p-6">
        <p class="mt-2 text-sm text-gray-600">本当に「<strong class="text-gray-900">${rackName}</strong>」を削除しますか？<br>この操作は取り消せません。</p>
        ${warningMessage}
      </div>
      <div class="p-4 bg-gray-50 flex justify-end space-x-2 rounded-b-xl">
        <button id="cancel-btn" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">キャンセル</button>
        <button id="confirm-delete-btn" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">削除</button>
      </div>`,
    onOpen: () => {
      document.getElementById('confirm-delete-btn').onclick = async () => {
        try {
          const rackNumericId = parseInt(String(rackId).replace(/[^0-9]/g, ''), 10);

          if (!Number.isFinite(rackNumericId)) throw new Error('無効なrack_id');
          await ctx.api.deleteRack(rackNumericId);
          const next = ctx.racks.filter(r => r.id !== rackId);

          ctx.setRacks(next);

          if (ctx.currentRackId === rackId) {
            ctx.setCurrentRackId(next.length > 0 ? next[0].id : null);
          }

          ctx.setLastRackId(ctx.currentRackId);
          ctx.renderApp();
          closeModal();
        } catch (err) {
          console.error('ラック削除に失敗', err);
          alert('ラックの削除に失敗しました。サーバーの状態を確認してください。');
        }
      };

      document.getElementById('cancel-btn').onclick = closeModal;
    }
  });
}

/**
 * 部品使用モーダルを表示し、使用数量を入力させてAPIを呼び出す。
 * @param {object} ctx             - アプリケーションコンテキスト。
 * @param {string} slotId          - 操作対象の棚ID。
 * @param {object} currentRack     - 現在表示中のラック情報。
 * @param {object} part            - 現在棚に入っている部品情報。
 * @returns {void}
 */
// 部品使用モーダル (Use Part)
export function showUsePartModal(ctx, slotId, currentRack, part) {
  openModalWithBridge({
    title: `「${s(part.partName)}」を使用`,
    html: `
      <div class="p-6">
        <div class="p-4 rounded-lg">
          <label for="use-quantity" class="block text-sm font-medium text-gray-700">使用する数量</label>
          <p class="text-xs text-gray-500 mb-2">(現在庫: ${part.quantity})</p>
          <input id="use-quantity" type="number" min="1" max="${part.quantity}" class="w-full bg-gray-100 focus:bg-white border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3" placeholder="数量を入力">
          <p id="use-error" class="mt-2 text-sm text-red-600 hidden"></p>
        </div>
      </div>
      <div class="p-4 bg-gray-100 flex justify-end space-x-2 rounded-b-xl">
        <button id="cancel-btn" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">キャンセル</button>
        <button id="confirm-use-btn" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">確定</button>
      </div>`,
    onOpen: () => {
      const qtyInput = document.getElementById('use-quantity');
      const errEl = document.getElementById('use-error');
      const confirmBtn = document.getElementById('confirm-use-btn');

      function showErrorMsg(msg) { errEl.textContent = msg; errEl.classList.remove('hidden'); }

      function hideErrorMsg() { errEl.textContent = ''; errEl.classList.add('hidden'); }

      function validateUseInput() {
        const v = parseInt(qtyInput.value);

        if (!Number.isFinite(v) || v < 1) { showErrorMsg('1以上の数量を入力してください。'); confirmBtn.disabled = true; 

return false; }

        if (v > part.quantity) { showErrorMsg(`現在庫数(${part.quantity})を超えています。`); confirmBtn.disabled = true; 

return false; }

        hideErrorMsg(); confirmBtn.disabled = false; 

return true;
      }

      qtyInput.addEventListener('input', validateUseInput);
      validateUseInput();

      document.getElementById('confirm-use-btn').onclick = async () => {
        if (!validateUseInput()) { qtyInput.focus(); 

return; }

        const quantity = parseInt(qtyInput.value);
        const rackNumericId = getRackNumericId(currentRack);

        if (!Number.isFinite(rackNumericId)) { alert('ラックIDの解決に失敗しました'); 

return; }

        try {
          const res = await ctx.api.useSlot(rackNumericId, slotId, quantity);
          const remain = res && res.remaining_quantity != null ? Number(res.remaining_quantity) : NaN;

          if (Number.isFinite(remain)) { if (remain <= 0) { currentRack.slots[slotId] = null; } else { part.quantity = remain; } }
          else { part.quantity -= quantity; if (part.quantity <= 0) currentRack.slots[slotId] = null; }

          closeModal();
          setTimeout(() => ctx.updateDetails(slotId), 0);
        } catch (err) {
          console.error('使用APIに失敗', err);
          alert('部品の使用に失敗しました。サーバーの状態を確認してください。');
        }
      };

      document.getElementById('cancel-btn').onclick = closeModal;
    }
  });
}

/**
 * 棚から部品を削除する確認モーダルを表示する。
 * @param {object} ctx         - アプリケーションコンテキスト。
 * @param {string} slotId      - 棚ID。
 * @param {object} currentRack - 現在のラック情報。
 * @param {object} part        - 削除対象の部品情報。
 * @returns {void}
 */
// 部品削除モーダル (Delete Part)
export function showDeletePartModal(ctx, slotId, currentRack, part) {
  openModalWithBridge({
    title: '箱の削除',
    html: `
      <div class="p-6">
        <p class="mt-2 text-sm text-gray-600">本当に「<strong class="text-gray-900">${s(part.partName)}</strong>」を棚から削除しますか？</p>
        <p class="text-red-600 bg-red-100 p-3 rounded-lg text-sm mt-4"><ion-icon name="warning-outline" class="mr-2"></ion-icon>この操作は取り消せません。</p>
      </div>
      <div class="p-4 bg-gray-50 flex justify-end space-x-2 rounded-b-xl">
        <button id="cancel-btn" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">キャンセル</button>
        <button id="confirm-delete-part-btn" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">削除</button>
      </div>`,
    onOpen: () => {
      document.getElementById('confirm-delete-part-btn').onclick = async () => {
        const rackNumericId = getRackNumericId(currentRack);

        if (!Number.isFinite(rackNumericId)) { alert('ラックIDの解決に失敗しました'); 

return; }

        try {
          await ctx.api.deleteSlot(rackNumericId, slotId);
          currentRack.slots[slotId] = null;
          closeModal();
          setTimeout(() => ctx.updateDetails(slotId), 0);
        } catch (err) {
          console.error('部品削除に失敗', err);
          alert('部品の削除に失敗しました。サーバーの状態を確認してください。');
        }
      };

      document.getElementById('cancel-btn').onclick = closeModal;
    }
  });
}

/**
 * 部品情報の編集モーダルを表示し、数量ゼロ時の削除分岐も担当する。
 * @param {object} ctx         - アプリケーションコンテキスト。
 * @param {string} slotId      - 棚ID。
 * @param {object} currentRack - ラック情報。
 * @param {object} part        - 編集対象の部品情報。
 * @returns {void}
 */
// 部品編集モーダル (Edit Part)
export function showEditPartModal(ctx, slotId, currentRack, part) {
  const colorPalette = ['4A90E2', '50E3C2', 'F5A623', 'D0021B', '9013FE', '7ED321', 'F8E71C', 'BD10E0', '4A4A4A', 'E9E9E9'];
  const colorPaletteHtml = colorPalette.map(color => `<button type="button" data-color="${color}" class="color-swatch w-8 h-8 rounded-full border-2" style="background-color: #${color};"></button>`).join('');

  openModalWithBridge({
    title: '箱の情報を編集',
    html: `
      <style>.color-swatch.selected { outline: 2px solid #4f46e5; outline-offset: 2px; }</style>
      <div class="p-6">
        <form id="edit-part-form" class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-700">部品名</label>
            <input name="partName" required class="w-full bg-gray-100 focus:bg-white border-gray-300 rounded-md mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3" value="${s(part?.partName)}">
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">部品型番 (任意)</label>
            <input name="partModelNumber" class="w-full bg-gray-100 focus:bg-white border-gray-300 rounded-md mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3" value="${s(part?.partModelNumber, '')}">
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">数量</label>
            <input name="quantity" type="number" min="0" required class="w-full bg-gray-100 focus:bg-white border-gray-300 rounded-md mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3" value="${part?.quantity ?? ''}">
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">カラーラベル</label>
            <div id="color-palette" class="flex flex-wrap gap-2 mt-2 p-2 bg-white rounded-md">${colorPaletteHtml}</div>
            <input type="hidden" name="color" value="${s(part?.color, '')}">
          </div>
        </form>
      </div>
      <div class="p-4 bg-gray-100 flex justify-end space-x-2 rounded-b-xl">
        <button id="cancel-btn" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">キャンセル</button>
        <button id="confirm-edit-part-btn" type="submit" form="edit-part-form" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">保存</button>
      </div>`,
    onOpen: () => {
      const colorPaletteEl = document.getElementById('color-palette');
      const hiddenColorInput = document.querySelector('input[name="color"]');
      const initialColor = ((part?.color) || '').toString().toUpperCase();
      const initialColorEl = initialColor ? colorPaletteEl.querySelector(`[data-color="${initialColor}"]`) : null;

      if (initialColorEl) initialColorEl.classList.add('selected');
      colorPaletteEl.addEventListener('click', e => {
        const swatch = e.target.closest('.color-swatch');

        if (!swatch) return;
        colorPaletteEl.querySelector('.selected')?.classList.remove('selected');
        swatch.classList.add('selected');
        hiddenColorInput.value = swatch.dataset.color;
      });

      document.getElementById('edit-part-form').onsubmit = async e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newQuantity = parseInt(formData.get('quantity'));
        const rackNumericId = getRackNumericId(currentRack);

        if (!Number.isFinite(rackNumericId)) { alert('ラックIDの解決に失敗しました'); 

return; }

        if (newQuantity === 0) {
          try {
            await ctx.api.deleteSlot(rackNumericId, slotId);
            currentRack.slots[slotId] = null;
            await ctx.refreshCurrentRackFromApi();
            closeModal();
            setTimeout(() => ctx.updateDetails(slotId), 0);
          } catch (err) {
            console.error('部品削除(数量0)に失敗', err);
            alert('削除に失敗しました。サーバーをご確認ください。');
          }

          
return;
        }

        const body = {
          part_name: formData.get('partName'),
          part_model_number: (formData.get('partModelNumber') || '').toString().trim() || null,
          quantity: newQuantity,
          color_code: (formData.get('color') || '').toString().replace(/^#/, '') || null
        };

        try {
          const res = await ctx.api.upsertSlot(rackNumericId, slotId, body);
          const saved = (res && res.slot) ? res.slot : body;

          currentRack.slots[slotId] = ctx.mapApiSlotToAppPart(saved);
          await ctx.refreshCurrentRackFromApi();
          closeModal();
          setTimeout(() => ctx.updateDetails(slotId), 0);
        } catch (err) {
          console.error('部品更新に失敗', err);
          alert('更新に失敗しました。サーバーの状態を確認してください。');
        }
      };

      document.getElementById('cancel-btn').onclick = closeModal;
    }
  });
}

/**
 * 新規部品情報の入力フォームだけを提供するモーダルを表示する。
 * @param {Function} callback                     - 入力確定後の処理コールバック。
 * @param {object}   [options={}]                 - 表示オプション。
 * @param {string}   [options.confirmLabel='棚をスキャンして格納'] - 確認ボタンのラベル。
 * @returns {void}
 */
// 新規部品入力モーダル (Store new part form only, caller supplies callback)
export function showStorePartModal(callback, { confirmLabel = '棚をスキャンして格納' } = {}) {
  openModalWithBridge({
    title: '新しい部品の情報を入力',
    html: `
      <div class="p-6">
        <form id="store-form" class="space-y-4">
          <div><label class="text-sm font-medium text-gray-700">部品名</label><input name="partName" required class="w-full bg-gray-100 focus:bg-white border-gray-300 rounded-md mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3"></div>
          <div><label class="text-sm font-medium text-gray-700">部品型番 (任意)</label><input name="partModelNumber" class="w-full bg-gray-100 focus:bg-white border-gray-300 rounded-md mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3"></div>
          <div><label class="text-sm font-medium text-gray-700">数量</label><input name="quantity" type="number" min="1" required class="w-full bg-gray-100 focus:bg-white border-gray-300 rounded-md mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-3"></div>
        </form>
      </div>
      <div class="p-4 bg-gray-100 flex justify-end space-x-2 rounded-b-xl">
        <button id="cancel-btn" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">キャンセル</button>
        <button id="confirm-store-btn" type="submit" form="store-form" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">${s(confirmLabel)}</button>
      </div>`,
    onOpen: () => {
      document.getElementById('store-form').onsubmit = e => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const newPart = {
          partName: formData.get('partName'),
          partModelNumber: formData.get('partModelNumber'),
          quantity: parseInt(formData.get('quantity')),
          color: ['4A90E2', '50E3C2', 'F5A623', 'D0021B', '9013FE'][Math.floor(Math.random() * 5)]
        };

        callback(newPart);
      };

      document.getElementById('cancel-btn').onclick = closeModal;
    }
  });
}

/**
 * 単一棚分のQRコードを表示するモーダルを開く。
 * @param {object} rack   - 対象ラック情報。
 * @param {string} slotId - 棚ID。
 * @returns {void}
 */
// 棚QR表示モーダル (Shelf QR)
export function showShelfQrModal(rack, slotId) {
  const rackNumericId = parseInt(String(rack.id).replace(/[^0-9]/g, ''), 10);
  const payload = { type: 'rack_slot', rack_id: Number.isFinite(rackNumericId) ? rackNumericId : rack.id, slot_identifier: slotId };
  const qrData = encodeURIComponent(JSON.stringify(payload));

  openModalWithBridge({
    title: '棚QRコード',
    html: `
      <div class="p-6 text-center">
        <p class="text-sm text-gray-600 mb-4">このQRコードを印刷して棚の<br><strong>${slotId}</strong>の場所に貼り付けてください。</p>
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}" alt="QR Code" class="mx-auto border-4">
        <p class="mt-2 font-semibold">${rack.name}</p>
        <p class="text-xs text-gray-500">場所: ${slotId}</p>
      </div>
      <div class="p-4 bg-gray-50 flex justify-end space-x-2 rounded-b-xl">
        <button id="cancel-btn" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">閉じる</button>
        <button id="print-btn" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">印刷</button>
      </div>`,
    onOpen: () => {
      document.getElementById('print-btn').onclick = () => console.log('印刷処理を実行 (ダミー)');
      document.getElementById('cancel-btn').onclick = closeModal;
    }
  });
}

/**
 * ラック全体の棚QRコードを一覧生成し、印刷対応モーダルを表示する。
 * @param {object} rack   - 対象ラック情報。
 * @returns {void}
 */
// 棚QR一括モーダル (Bulk shelf QR)
export function showBulkShelfQrModal(rack) {
  let qrGridHtml = '';

  for (let r = 1; r <= rack.rows; r++) {
    const rowChar = String.fromCharCode(64 + r);

    for (let c = 1; c <= rack.cols; c++) {
      const slotId = `${rowChar}-${c}`;
      const rackNumericId = parseInt(String(rack.id).replace(/[^0-9]/g, ''), 10);
      const payload = { type: 'rack_slot', rack_id: Number.isFinite(rackNumericId) ? rackNumericId : rack.id, slot_identifier: slotId };
      const qrData = encodeURIComponent(JSON.stringify(payload));

      qrGridHtml += `
        <div class="qr-item border rounded-md p-2 flex flex-col items-center justify-center bg-white">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${qrData}" alt="QR Code" class="mx-auto">
          <p class="mt-2 font-bold text-center text-sm">${rack.name}</p>
          <p class="font-mono text-center text-lg">${slotId}</p>
        </div>`;
    }
  }

  const modalHtml = `
    <style>
      #printable-qrs { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px; }
      @media print {
        .modal-header, .modal-footer { display: none !important; }
        #printable-qrs { grid-template-columns: repeat(${rack.cols}, 1fr); max-height: none !important; overflow: visible !important; }
      }
    </style>
    <div class="p-6 modal-header">
      <h3 class="text-lg font-bold mb-2">棚QRコード一括生成</h3>
      <p class="text-sm text-gray-600">「${rack.name}」のすべての棚QRコードです。印刷して貼り付けてください。</p>
    </div>
    <div id="printable-qrs" class="p-4 max-h-[60vh] overflow-y-auto bg-gray-100">${qrGridHtml}</div>
    <div class="p-4 bg-gray-50 flex justify-end space-x-2 modal-footer rounded-b-xl">
      <button id="cancel-btn" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">閉じる</button>
      <button id="print-btn" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">印刷</button>
    </div>`;

  openModalWithBridge({ title: '棚QRコード一括生成', html: modalHtml, maxWidth: 'lg', onOpen: () => {
    document.getElementById('print-btn').onclick = () => window.print();
    document.getElementById('cancel-btn').onclick = () => closeModal();
  }});
}
