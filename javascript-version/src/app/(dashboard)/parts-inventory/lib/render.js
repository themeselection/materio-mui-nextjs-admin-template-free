/*
======== ファイル概要 ========
ラックタブ・メッシュ・詳細パネルといったDOM描画処理をまとめたレンダリング専用モジュール。
主処理からDOM構築を切り離し、再描画とハイライト制御を担当する。
*/

import { s } from './utils';

// ラックタブを描画する関数 (Renders tab headers)
/**
 * ラック一覧に基づきタブUIを生成・更新する。
 * @param {Array}  racks          - 表示対象のラック配列。
 * @param {string} currentRackId  - 現在アクティブなラックID。
 * @returns {void}
 */
export function renderRackTabs(racks, currentRackId) {
  const rackTabsEl = document.getElementById('rack-tabs');

  if (!rackTabsEl) return;
  rackTabsEl.innerHTML = '';
  racks.forEach(rack => {
    const a = document.createElement('a');

    a.href = '#';
    a.dataset.rackId = rack.id;
    a.className = `rack-tab-item group whitespace-nowrap flex items-center py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200${rack.id === currentRackId ? ' active' : ''}`;
    a.innerHTML = `
      <ion-icon name="server-outline" class="mr-2 text-lg"></ion-icon>
      <span class="truncate">${rack.name}</span>
      <button data-action="delete-rack" data-rack-id="${rack.id}" data-rack-name="${rack.name}" class="ml-3 p-1 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
        <ion-icon name="trash-outline" class="pointer-events-none"></ion-icon>
      </button>`;
    rackTabsEl.appendChild(a);
  });
}

// 現在選択中ラックのメッシュを描画する関数 (Renders the grid of the currently selected rack)
/**
 * 選択中ラックのレイアウトとハイライト状態に基づいて棚グリッドを生成する。
 * @param {Array}   racks             - 全ラック配列。
 * @param {string}  currentRackId     - 現在のラックID。
 * @param {string}  selectedSlotId    - 選択中の棚ID。
 * @param {boolean} isMoveMode        - 移動モード中かどうか。
 * @param {string}  moveOriginSlotId  - 移動元の棚ID。
 * @returns {void}
 */
export function renderCurrentRack(racks, currentRackId, selectedSlotId, isMoveMode, moveOriginSlotId) {
  const rackDisplayArea = document.getElementById('rack-display-area');
  const rackNameEl = document.getElementById('rack-name');
  const bulkQrBtn = document.getElementById('bulk-qr-btn');

  if (!rackDisplayArea || !rackNameEl || !bulkQrBtn) return;

  rackDisplayArea.innerHTML = '';
  const currentRack = racks.find(r => r.id === currentRackId);

  if (!currentRack) {
    rackNameEl.textContent = 'ラックがありません';
    rackDisplayArea.innerHTML = '<p class="text-center text-gray-500 p-10">右下のボタンから新しいラックを作成してください。</p>';
    bulkQrBtn.classList.add('hidden');
    
return;
  }

  bulkQrBtn.classList.remove('hidden');
  rackNameEl.textContent = currentRack.name;

  const layoutContainer = document.createElement('div');

  layoutContainer.className = 'grid pi-surface';
  layoutContainer.style.gridTemplateColumns = 'auto 1fr';
  layoutContainer.style.gridTemplateRows = 'auto 1fr';

  const corner = document.createElement('div');

  corner.className = 'w-12 h-8 sticky left-0 top-0 z-20 pi-surface';
  layoutContainer.appendChild(corner);

  const colHeadersContainer = document.createElement('div');

  colHeadersContainer.className = 'grid sticky top-0 z-10 pi-surface';
  colHeadersContainer.style.gridTemplateColumns = `repeat(${currentRack.cols}, 9rem)`;
  colHeadersContainer.style.gap = '1rem';
  colHeadersContainer.style.paddingLeft = '1rem';

  for (let c = 1; c <= currentRack.cols; c++) {
    const header = document.createElement('div');

    header.className = 'h-8 flex items-end justify-center font-bold text-gray-500 rounded-md transition-colors duration-200';
    header.textContent = c;
    if (selectedSlotId && selectedSlotId.split('-')[1] == c) header.classList.add('header-highlight');
    colHeadersContainer.appendChild(header);
  }

  layoutContainer.appendChild(colHeadersContainer);

  const rowHeadersContainer = document.createElement('div');

  rowHeadersContainer.className = 'grid sticky left-0 pi-surface z-10';
  rowHeadersContainer.style.gridTemplateRows = `repeat(${currentRack.rows}, 9rem)`;
  rowHeadersContainer.style.gap = '1rem';
  rowHeadersContainer.style.paddingTop = '1rem';

  for (let r = 1; r <= currentRack.rows; r++) {
    const rowChar = String.fromCharCode(64 + r);
    const header = document.createElement('div');

    header.className = 'w-12 flex items-center justify-center font-bold text-gray-500 rounded-md transition-colors duration-200';
    header.textContent = rowChar;
    if (selectedSlotId && selectedSlotId.split('-')[0] === rowChar) header.classList.add('header-highlight');
    rowHeadersContainer.appendChild(header);
  }

  layoutContainer.appendChild(rowHeadersContainer);

  const rackContainer = document.createElement('div');

  rackContainer.id = 'mesh-rack';
  rackContainer.className = 'grid gap-4 bg-gray-200 p-4 rounded-xl shadow-inner';
  rackContainer.style.gridTemplateColumns = `repeat(${currentRack.cols}, 9rem)`;
  rackContainer.style.gridTemplateRows = `repeat(${currentRack.rows}, 9rem)`;

  for (let r = 1; r <= currentRack.rows; r++) {
    const rowChar = String.fromCharCode(64 + r);

    for (let c = 1; c <= currentRack.cols; c++) {
      const slotId = `${rowChar}-${c}`;
      const part = currentRack.slots[slotId];
      const slot = document.createElement('div');

      slot.id = `slot-${slotId}`;
      slot.dataset.slotId = slotId;
      slot.className = 'rack-slot aspect-square bg-gray-300/50 rounded-lg flex flex-col justify-between p-2 cursor-pointer transition-all duration-300 hover:bg-gray-300';
      let content = `<div class="text-sm font-bold text-gray-500">${slotId}</div>`;

      if (part) {
        content += `
          <div class="text-center overflow-hidden min-w-0">
            <div class="w-full h-4 rounded-full mb-2" style="background-color: ${part.color ? '#' + part.color : 'var(--mui-palette-divider)'};"></div>
            <p class="font-bold text-gray-800 text-sm truncate">${s(part.partName)}</p>
            <p class="text-xs text-gray-500 truncate">${s(part.partModelNumber, '')}</p>
          </div>
          <div class="text-right text-lg font-bold">${part.quantity}</div>`;
      } else if (isMoveMode) {
        slot.classList.add('move-mode-empty');
      }

      slot.innerHTML = content;
      rackContainer.appendChild(slot);
    }
  }

  layoutContainer.appendChild(rackContainer);
  rackDisplayArea.appendChild(layoutContainer);

  if (selectedSlotId) {
    document.getElementById(`slot-${selectedSlotId}`)?.classList.add('selected-slot');
  }

  if (isMoveMode && moveOriginSlotId) {
    document.getElementById(`slot-${moveOriginSlotId}`)?.classList.add('move-mode-origin');
  }
}

// 詳細パネルを描画する関数 (Details panel)
/**
 * 詳細パネルに部品情報・操作ボタンを描画する。
 * @param {Array}   racks         - 全ラック配列。
 * @param {string}  currentRackId - 現在のラックID。
 * @param {string}  slotId        - 詳細表示する棚ID。
 * @returns {void}
 */
export function renderDetails(racks, currentRackId, slotId) {
  const detailsPanel = document.getElementById('details-panel');

  if (!detailsPanel) return;
  const currentRack = racks.find(r => r.id === currentRackId);
  let content = '';

  if (!currentRack) {
  detailsPanel.innerHTML = '<div class="text-center text-gray-500 py-10"><ion-icon name="grid-outline" class="text-5xl mx-auto"></ion-icon><p class="mt-2">ラックを選択してください</p></div>';
    
return;
  }

  const part = slotId ? currentRack.slots[slotId] : null;

  if (part) {
    content = `
      <div class="fade-in">
        <div class="flex items-center mb-4"><div class="w-4 h-4 rounded-full mr-3" style="background-color: ${part.color ? '#' + part.color : 'var(--mui-palette-divider)'};"></div><h3 class="text-xl font-bold">${s(part.partName)}</h3></div>
        <div class="space-y-2 text-sm">
          <p><strong class="w-24 inline-block text-gray-500">部品型番:</strong> ${s(part.partModelNumber, 'N/A')}</p>
          <p><strong class="w-24 inline-block text-gray-500">現在庫数:</strong> <span class="text-2xl font-bold">${part.quantity}</span></p>
          <p><strong class="w-24 inline-block text-gray-500">保管場所:</strong> <span class="text-lg font-bold">${currentRack.name} / ${slotId}</span></p>
        </div>
        <div class="mt-6 border-t pt-4 space-y-2">
          <button data-action="use" data-slot-id="${slotId}" class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">部品を使用</button>
          <button data-action="move" data-slot-id="${slotId}" class="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">箱を移動</button>
          <div class="grid grid-cols-2 gap-2">
            <button data-action="edit" data-slot-id="${slotId}" class="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center justify-center"><ion-icon name="pencil-outline" class="mr-2"></ion-icon>編集</button>
            <button data-action="delete" data-slot-id="${slotId}" class="w-full bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 flex items-center justify-center"><ion-icon name="trash-bin-outline" class="mr-2"></ion-icon>削除</button>
          </div>
          <hr class="my-2"/>
          <button data-action="show-shelf-qr" data-slot-id="${slotId}" class="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center justify-center"><ion-icon name="grid-outline" class="mr-2"></ion-icon>棚QRコードを生成</button>
        </div>
      </div>`;
  } else if (slotId) {
    content = `
      <div class="fade-in text-center py-6">
        <p class="text-lg font-bold mb-2">場所: ${currentRack.name} / ${slotId}</p>
        <ion-icon name="archive-outline" class="text-5xl text-gray-400 mx-auto"></ion-icon>
        <p class="mt-2 text-gray-500">この場所は空です</p>
        <div class="mt-6 space-y-2">
          <button data-action="store" data-slot-id="${slotId}" class="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">新しい箱を格納</button>
          <button data-action="show-shelf-qr" data-slot-id="${slotId}" class="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 flex items-center justify-center"><ion-icon name="grid-outline" class="mr-2"></ion-icon>棚QRコードを生成</button>
        </div>
      </div>`;
  } else {
    content = `
      <div class="text-center text-gray-500 py-10">
        <ion-icon name="grid-outline" class="text-5xl mx-auto"></ion-icon>
        <p class="mt-2">ラックの場所を選択して詳細を表示</p>
      </div>`;
  }

  detailsPanel.innerHTML = content;
}
