/*
======== ファイル概要 ========
レガシー部品在庫アプリのドキュメント内スクリプトをモジュール化し、Next.js動作に合わせて初期化・イベント制御を担当する。
API取得・状態管理・DOM描画・モーダル操作を分離したサブモジュールを束ねている。
*/

// 既存の HTML 内 <script> のロジックを分割し、初期化関数をエクスポート
import { s, getRackNumericId, createLastRackStorage, transformApiDataToAppData } from './lib/utils';
import { createApi, mapApiSlotToAppPart } from './lib/api';
import {
    closeModal,
    showQrScannerModal,
    showAddRackModal,
    showDeleteRackModal,
    showUsePartModal,
    showDeletePartModal,
    showEditPartModal,
    showStorePartModal,
    showShelfQrModal,
    showBulkShelfQrModal
} from './lib/modals';
import { renderRackTabs, renderCurrentRack, renderDetails } from './lib/render';

/**
 * レガシー部品在庫アプリ全体を初期化し、必要なイベントや状態を組み立てる。
 * @returns {void}   戻り値なし。初期化完了後はDOMイベントへのバインドで継続的に動作する。
 */
export function initPartsInventoryApp() {
    // 既存インスタンスがあればクリーンアップしてから再初期化（戻ってきた時の再描画用）
    if (typeof window !== 'undefined' && window.__piAppTeardown) {
        try { window.__piAppTeardown(); } catch (e) { console.debug('previous teardown failed', e); }
        window.__piAppTeardown = undefined;
    }

    // =============================
    // 画面ロジック概要
    // - レイアウトをサイドバーからタブ形式に変更
    // - ダミーAPIデータをアプリ内部形式へ変換
    // - 上部: ラック選択タブ / 下部: ラックメッシュ + 詳細パネル
    // - 操作: 部品使用・格納・移動、棚QR表示、棚QR一括生成
    // - モーダルは openModal/closeModal で共通管理
    // =============================

    // APIから返ってくるであろうサンプルデータ (フェールバック用)
    const mockApiData = [
        {
            rack_id: 1,
            rack_name: 'スプリング・小物資材ラック',
            slots: [
                { slot_id: 'A-1', part: { part_name: 'ポケットコイル (シングル)', part_model_number: 'PC-S-H20', quantity: 25, color_code: '4A90E2' } },
                { slot_id: 'A-2', part: { part_name: 'ポケットコイル (シングル)', part_model_number: 'PC-S-H20', quantity: 25, color_code: '4A90E2' } },
                { slot_id: 'A-3', part: null },
                { slot_id: 'A-4', part: { part_name: 'ボンネルコイル (セミダブル)', part_model_number: 'BC-SD-H18', quantity: 20, color_code: '50E3C2' } },
                { slot_id: 'B-1', part: { part_name: 'コーナーガード', part_model_number: 'CG-STD', quantity: 500, color_code: '9B9B9B' } },
                { slot_id: 'B-2', part: { part_name: '製品ラベルセット', part_model_number: 'LBL-PREMIUM', quantity: 1000, color_code: 'F5A623' } },
                { slot_id: 'B-3', part: null },
                { slot_id: 'B-4', part: { part_name: '強化縫製糸 (白)', part_model_number: 'THD-W-HV', quantity: 50, color_code: 'E9E9E9' } },
                { slot_id: 'C-1', part: null },
                { slot_id: 'C-2', part: { part_name: 'ボンネルコイル (セミダブル)', part_model_number: 'BC-SD-H18', quantity: 20, color_code: '50E3C2' } },
                { slot_id: 'C-3', part: null },
                { slot_id: 'C-4', part: { part_name: 'ジッパー (200cm)', part_model_number: 'ZIP-200', quantity: 150, color_code: 'D0021B' } }
            ]
        },
        {
            rack_id: 2,
            rack_name: 'ウレタンフォーム保管棚',
            slots: [
                { slot_id: 'A-1', part: { part_name: '低反発ウレタン 20mm (S)', part_model_number: 'MF-T20-S', quantity: 40, color_code: '4A90E2' } },
                { slot_id: 'A-2', part: { part_name: '低反発ウレタン 20mm (S)', part_model_number: 'MF-T20-S', quantity: 40, color_code: '4A90E2' } },
                { slot_id: 'A-3', part: { part_name: '高反発ウレタン 30mm (S)', part_model_number: 'HR-T30-S', quantity: 40, color_code: '7ED321' } },
                { slot_id: 'A-4', part: { part_name: '高反発ウレタン 30mm (S)', part_model_number: 'HR-T30-S', quantity: 40, color_code: '7ED321' } },
                { slot_id: 'A-5', part: null },
                { slot_id: 'A-6', part: null },
                { slot_id: 'B-1', part: { part_name: '低反発ウレタン 20mm (SD)', part_model_number: 'MF-T20-SD', quantity: 30, color_code: '4A90E2' } },
                { slot_id: 'B-2', part: { part_name: '低反発ウレタン 20mm (SD)', part_model_number: 'MF-T20-SD', quantity: 30, color_code: '4A90E2' } },
                { slot_id: 'B-3', part: { part_name: '高反発ウレタン 30mm (SD)', part_model_number: 'HR-T30-SD', quantity: 30, color_code: '7ED321' } },
                { slot_id: 'B-4', part: { part_name: '高反発ウレタン 30mm (SD)', part_model_number: 'HR-T30-SD', quantity: 30, color_code: '7ED321' } },
                { slot_id: 'B-5', part: null },
                { slot_id: 'B-6', part: null },
                { slot_id: 'C-1', part: { part_name: 'ラテックスフォーム 40mm (D)', part_model_number: 'LTX-T40-D', quantity: 20, color_code: 'F8E71C' } },
                { slot_id: 'C-2', part: null },
                { slot_id: 'C-3', part: null },
                { slot_id: 'C-4', part: null },
                { slot_id: 'C-5', part: null },
                { slot_id: 'C-6', part: null }
            ]
        },
        {
            rack_id: 3,
            rack_name: '生地・充填材ラック',
            slots: [
                { slot_id: 'A-1', part: { part_name: 'ニット生地 (クール)', part_model_number: 'FAB-KN-COOL', quantity: 15, color_code: 'BD10E0' } },
                { slot_id: 'A-2', part: { part_name: 'ニット生地 (オーガニック)', part_model_number: 'FAB-KN-OGN', quantity: 15, color_code: 'BD10E0' } },
                { slot_id: 'A-3', part: null },
                { slot_id: 'B-1', part: { part_name: 'フェルトパッド (ハード)', part_model_number: 'FLT-HD-S', quantity: 200, color_code: '9B9B9B' } },
                { slot_id: 'B-2', part: { part_name: 'フェルトパッド (ハード)', part_model_number: 'FLT-HD-S', quantity: 200, color_code: '9B9B9B' } },
                { slot_id: 'B-3', part: { part_name: 'フェルトパッド (ソフト)', part_model_number: 'FLT-SF-S', quantity: 200, color_code: '4A4A4A' } }
            ]
        }
    ];

    // APIエンドポイントのベースURL
    // 優先度: URLクエリ ?apiBase= → window.API_BASE → 同一オリジン(空文字)
    const apiBase = new URLSearchParams(location.search).get('apiBase') || window.API_BASE || '';
    const api = createApi(apiBase);

    // 最後に表示していたラックIDを保存/復元
    const { setLastRackId, getLastRackId } = createLastRackStorage(apiBase);

    /**
     * ラック一覧と各ラックの詳細情報を取得し、UI描画しやすい形へまとめる。
     * @returns {Promise<Array>}   ラックごとの詳細データ（行列・スロット情報を含む）配列。
     */
    async function loadRacksFromApi() {
        const list = await api.listRacks();

        const racksWithDetails = await Promise.all(
            list.map(async rack => {
                try {
                    const detail = await api.getRack(rack.rack_id);
                    const slotsObj = detail.slots || {};

                    const slotsArr = Object.entries(slotsObj).map(([slotId, part]) => ({
                        slot_id: slotId,
                        part: part
                            ? {
                                part_name: part.part_name,
                                part_model_number: part.part_model_number,
                                quantity: part.quantity,
                                color_code: part.color_code
                            }
                            : null
                    }));

                    
return {
                        rack_id: detail.rack_id,
                        rack_name: detail.rack_name,
                        rows: detail.rows,
                        cols: detail.cols,
                        slots: slotsArr
                    };
                } catch (e) {
                    console.error('ラック詳細取得に失敗:', rack.rack_id, e);
                    
return {
                        rack_id: rack.rack_id,
                        rack_name: rack.rack_name,
                        rows: rack.rows,
                        cols: rack.cols,
                        slots: []
                    };
                }
            })
        );

        
return racksWithDetails;
    }

    /**
     * 現在選択中のラックをサーバーから再取得し、ローカル状態と描画を最新化する。
     * @returns {Promise<object|null>}   同期後のラックオブジェクト。取得できなければ null。
     */
    async function refreshCurrentRackFromApi() {
        const currentRack = racks.find(r => r.id === currentRackId);

        if (!currentRack) return null;
        const rackNumericId = getRackNumericId(currentRack);

        if (!Number.isFinite(rackNumericId)) return null;

        try {
            const detail = await api.getRack(rackNumericId);
            const slotsObj = detail?.slots || {};
            const newSlots = {};

            Object.entries(slotsObj).forEach(([slotId, part]) => {
                newSlots[slotId] = part
                    ? {
                        partName: part.part_name,
                        partModelNumber: part.part_model_number,
                        quantity: part.quantity,
                        color: part.color_code
                    }
                    : null;
            });
            currentRack.rows = detail.rows || currentRack.rows;
            currentRack.cols = detail.cols || currentRack.cols;
            currentRack.slots = newSlots; // 置き換えで同期
            // メッシュも即時更新（詳細は呼び出し元でupdateDetailsを使う）
            renderCurrentRack(racks, currentRackId, selectedSlotId, isMoveMode, moveOriginSlotId);
            
return currentRack;
        } catch (e) {
            console.warn('ラック再取得に失敗しました', e);
            
return null;
        }
    }

    /**
     * 指定スロットの部品が最新状態で存在するか検証し、必要に応じて再同期を行う。
     * @param {string} slotId           - チェック対象の棚ID (例: A-1)。
     * @returns {Promise<object>}       - { currentRack, part } を返却。部品が無い場合 part は null。
     */
    async function ensurePartInSlot(slotId) {
        let currentRack = racks.find(r => r.id === currentRackId);
        let part = currentRack && currentRack.slots ? currentRack.slots[slotId] : null;

        if (part) return { currentRack, part };
        await refreshCurrentRackFromApi();
        currentRack = racks.find(r => r.id === currentRackId);
        part = currentRack && currentRack.slots ? currentRack.slots[slotId] : null;
        
return { currentRack, part };
    }

    // ===== アプリ全体の状態 =====
    let racks = [];
    let currentRackId = null;
    let selectedSlotId = null;
    let isMoveMode = false;
    let moveOriginSlotId = null;

    // 移動 API の二重送信防止フラグ
    let isPostingMove = false;

    // モーダルを閉じた直後のゴーストクリック抑制用タイムスタンプ
    let clickGuardUntil = 0;

    /**
     * モーダルモジュールに渡す現在のアプリ状態と操作群をまとめたコンテキストを生成する。
     * @returns {object}   モーダル表示で必要となるAPIや状態操作関数の束。
     */
    const getCtx = () => ({
        api,
        racks,
        currentRackId,
        setRacks: next => { racks = next; },
        setCurrentRackId: id => { currentRackId = id; },
        setLastRackId,
        renderApp,
        updateDetails,
        refreshCurrentRackFromApi,
        mapApiSlotToAppPart
    });

    /**
     * 移動モードのフラグと選択状態をリセットし、グリッドへ即時反映する。
     * @returns {void}   描画のみ更新するため戻り値なし。
     */
    function exitMoveMode() {
        if (isMoveMode || moveOriginSlotId) {
            isMoveMode = false;
            moveOriginSlotId = null;

            // ハイライトなどを即時反映
            renderCurrentRack(racks, currentRackId, selectedSlotId, isMoveMode, moveOriginSlotId);
        }
    }

    // ===== DOM参照の取得 =====
    const rackNameEl = document.getElementById('rack-name');
    const rackTabsEl = document.getElementById('rack-tabs');
    const detailsPanel = document.getElementById('details-panel');
    const searchInput = document.getElementById('search-parts');

    // MUIダイアログブリッジはReactコンポーネントModalBridgeが提供する (MUI Dialog bridge is provided by React component ModalBridge)
    const bulkQrBtn = document.getElementById('bulk-qr-btn');
    const fabMain = document.getElementById('fab-main');
    const fabIcon = document.getElementById('fab-icon');
    const fabMenuItems = document.querySelectorAll('.fab-item');

    /**
     * ラックタブ・グリッド・詳細パネルを一括で再描画する初期化兼リフレッシュ関数。
     * @returns {void}
     */
    function renderApp() {
    renderRackTabs(racks, currentRackId);
        renderCurrentRack(racks, currentRackId, selectedSlotId, isMoveMode, moveOriginSlotId);
        renderDetails(racks, currentRackId, null);
    }

    /**
     * 現在選択しているスロット情報を更新し、詳細パネルとメッシュの強調表示を同期する。
     * @param {string|null} slotId   - 選択した棚ID。未選択時は null。
     * @returns {void}
     */
    function updateDetails(slotId) {
        selectedSlotId = slotId;
        renderDetails(racks, currentRackId, slotId);
        renderCurrentRack(racks, currentRackId, selectedSlotId, isMoveMode, moveOriginSlotId);
    }

        // モーダル群は lib/modals.js に分離

    // showDeleteRackModal: moved to module (以前のインライン実装を切り出し)

    // showUsePartModal: moved to module (以前のインライン実装を切り出し)

    // showDeletePartModal: moved to module (以前のインライン実装を切り出し)

    // showEditPartModal: moved to module (以前のインライン実装を切り出し)

    // showStorePartModal: moved to module (以前のインライン実装を切り出し)

        // showQrScannerModal: moved to module (以前のインライン実装を切り出し)

    // showShelfQrModal: moved to module (以前のインライン実装を切り出し)

    // showBulkShelfQrModal: moved to module (以前のインライン実装を切り出し)

    /**
     * FABメニューのイベントを設定し、開閉アニメーションを制御する。
     * @returns {boolean}   バインドに成功した場合は true、必要要素が無い場合は false。
     */
    const bindFabHandlers = () => {
        const btn = document.getElementById('fab-main');
        const icon = document.getElementById('fab-icon');
        const items = document.querySelectorAll('.fab-item');

        if (!btn || !icon) return false;

        // 初期状態ではメニュー項目を隠す
        items.forEach(item => {
            item.style.transform = 'scale(0)';
            item.style.transition = 'transform 150ms ease';
        });

        // 既存ハンドラを解除
        if (typeof window !== 'undefined' && window.__piOnFabMainClick && window.__piFabMainEl) {
            try { window.__piFabMainEl.removeEventListener('click', window.__piOnFabMainClick); } catch {}
        }

        const onClick = () => {
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';

            btn.setAttribute('aria-expanded', (!isExpanded).toString());
            icon.classList.toggle('rotate-45');

            if (!isExpanded) {
                items.forEach((item, index) => {
                    item.style.transitionDelay = `${index * 40}ms`;
                    item.style.transform = 'scale(1)';
                });
            } else {
                items.forEach(item => {
                    item.style.transform = 'scale(0)';
                });
            }
        };

        btn.addEventListener('click', onClick);

        if (typeof window !== 'undefined') {
            window.__piOnFabMainClick = onClick;
            window.__piFabMainEl = btn;
        }

        
return true;
    };

    if (!bindFabHandlers()) {
        // 初期化タイミングのズレに備えて1フレーム後に再試行
        setTimeout(bindFabHandlers, 0);
    }

    // FAB: ラック作成
    document.getElementById('add-rack-btn')?.addEventListener('click', () => showAddRackModal(getCtx()));

    // FAB: QR入庫（スキャンした棚に格納）
    document.getElementById('qr-stock-in-btn')?.addEventListener('click', () => {
        showStorePartModal(newPart => {
            showQrScannerModal('QR入庫', '棚QRコードを読み取ってください', async payload => {
                try {
                    const { type, rack_id, slot_identifier } = payload || {};
                    if (type !== 'rack_slot' || !rack_id || !slot_identifier) {
                        alert('無効なQRコードです。棚QRコードを読み取ってください。');
                        return;
                    }

                    const targetRack = racks.find(r => getRackNumericId(r) === Number(rack_id));
                    if (!targetRack) { alert('該当のラックが見つかりません。'); return; }

                    if (targetRack.slots[slot_identifier]) {
                        alert('この棚はすでに使用中です。別の棚を読み取ってください。');
                        return;
                    }

                    const rackNumericId = getRackNumericId(targetRack);
                    if (!Number.isFinite(rackNumericId)) { alert('ラックIDの解決に失敗しました'); return; }

                    const body = {
                        part_name: newPart.partName,
                        part_model_number: (newPart.partModelNumber || '').toString().trim() || null,
                        quantity: newPart.quantity,
                        color_code: (newPart.color || '').toString().replace(/^#/, '') || null
                    };

                    const res = await api.createSlot(rackNumericId, slot_identifier, body);
                    const saved = (res && res.slot) ? res.slot : body;

                    targetRack.slots[slot_identifier] = mapApiSlotToAppPart(saved);
                    await refreshCurrentRackFromApi();

                    if (currentRackId !== targetRack.id) {
                        currentRackId = targetRack.id;
                        setLastRackId(currentRackId);
                        renderApp();
                    }

                    setTimeout(() => updateDetails(slot_identifier), 0);
                } catch (err) {
                    console.error('部品の格納に失敗', err);
                    alert('格納に失敗しました。サーバーの状態を確認してください。');
                }
            });
        });
    });

    // FAB: QR出庫（スキャンした棚から使用）
    document.getElementById('qr-stock-out-btn')?.addEventListener('click', () => {
        showQrScannerModal('QR出庫', '出庫する棚QRコードを読み取ってください', async payload => {
            try {
                const { type, rack_id, slot_identifier } = payload || {};
                if (type !== 'rack_slot' || !rack_id || !slot_identifier) {
                    alert('無効なQRコードです。棚QRコードを読み取ってください。');
                    return;
                }

                const targetRack = racks.find(r => getRackNumericId(r) === Number(rack_id));
                if (!targetRack) { alert('該当のラックが見つかりません。'); return; }

                if (!targetRack.slots[slot_identifier]) {
                    alert('この棚には出庫できる部品がありません。');
                    return;
                }

                if (currentRackId !== targetRack.id) {
                    currentRackId = targetRack.id;
                    setLastRackId(currentRackId);
                    renderApp();
                }

                updateDetails(slot_identifier);

                (async () => {
                    await refreshCurrentRackFromApi();
                    const currentRack = racks.find(r => r.id === currentRackId);
                    const part = currentRack?.slots?.[slot_identifier];
                    if (!currentRack || !part) return;
                    showUsePartModal(getCtx(), slot_identifier, currentRack, part);
                })();
            } catch (err) {
                console.error('QR出庫処理に失敗', err);
                alert('出庫処理に失敗しました。サーバーの状態を確認してください。');
            }
        });
    });

    // 一括QR生成
    bulkQrBtn?.addEventListener('click', () => {
        const currentRack = racks.find(r => r.id === currentRackId);

        if (currentRack) showBulkShelfQrModal(currentRack);
    });

    // ラックタブのクリック
    rackTabsEl?.addEventListener('click', e => {
        e.preventDefault();
        const tab = e.target.closest('.rack-tab-item');
        const deleteBtn = e.target.closest('[data-action="delete-rack"]');

        if (deleteBtn) {
            showDeleteRackModal(getCtx(), deleteBtn.dataset.rackId, deleteBtn.dataset.rackName);
        } else if (tab) {
            currentRackId = tab.dataset.rackId;
            setLastRackId(currentRackId);
            selectedSlotId = null;
            isMoveMode = false;
            renderApp();
        }
    });

    // 詳細パネルの操作
    detailsPanel?.addEventListener('click', e => {
        if (Date.now() < clickGuardUntil) {
            e.preventDefault();
            
return;
        }

        const button = e.target.closest('button');

        if (!button) return;
        const { action, slotId } = button.dataset;
        const currentRack = racks.find(r => r.id === currentRackId);

        if (!currentRack) return;

        switch (action) {
            case 'use':
                exitMoveMode();

                (async () => {
                    await refreshCurrentRackFromApi();
                    const { currentRack, part } = await ensurePartInSlot(slotId);

                    if (!currentRack || !part) { alert('対象の箱が見つかりませんでした。画面を最新状態に更新します。'); updateDetails(slotId); 

return; }

                    showUsePartModal(getCtx(), slotId, currentRack, part);
                })();

                break;
            case 'store':
                exitMoveMode();
                showStorePartModal(async newPart => {
                    const rackNumericId = getRackNumericId(currentRack);

                    if (!Number.isFinite(rackNumericId)) {
                        alert('ラックIDの解決に失敗しました');
                        
return;
                    }

                    const body = {
                        part_name: newPart.partName,
                        part_model_number: (newPart.partModelNumber || '').toString().trim() || null,
                        quantity: newPart.quantity,
                        color_code: (newPart.color || '').toString().replace(/^#/, '') || null
                    };

                    try {
                        const res = await api.createSlot(rackNumericId, slotId, body);
                        const saved = (res && res.slot) ? res.slot : body;

                        currentRack.slots[slotId] = mapApiSlotToAppPart(saved);
                        await refreshCurrentRackFromApi();
                        closeModal();
                        setTimeout(() => updateDetails(slotId), 0);
                    } catch (err) {
                        console.error('部品の格納に失敗', err);
                        alert('格納に失敗しました。スロットが空か、サーバーの状態をご確認ください。');
                    }
                }, { confirmLabel: '格納' });
                break;
            case 'move':
                isMoveMode = true;
                moveOriginSlotId = slotId;
                detailsPanel.innerHTML = `<div class="fade-in text-center py-10"><ion-icon name="move-outline" class="text-5xl text-indigo-500 mx-auto"></ion-icon><p class="mt-2 font-bold">移動先の空き場所を選択してください</p><p class="text-sm text-gray-500">(移動元: ${slotId})</p><button id="cancel-move-btn" class="mt-4 text-sm text-red-600">移動をキャンセル</button></div>`;

                document.getElementById('cancel-move-btn').onclick = () => {
                    isMoveMode = false;
                    moveOriginSlotId = null;
                    updateDetails(slotId);
                };

                renderCurrentRack(racks, currentRackId, selectedSlotId, isMoveMode, moveOriginSlotId);
                break;
            case 'show-shelf-qr':
                exitMoveMode();

                (async () => {
                    await refreshCurrentRackFromApi();
                    const currentRack2 = racks.find(r => r.id === currentRackId);

                    if (!currentRack2) return;
                    showShelfQrModal(currentRack2, slotId);
                })();

                break;
            case 'edit':
                exitMoveMode();

                (async () => {
                    await refreshCurrentRackFromApi();
                    const { currentRack, part } = await ensurePartInSlot(slotId);

                    if (!currentRack || !part) { alert('対象の箱が見つかりませんでした。画面を最新状態に更新します。'); updateDetails(slotId); 

return; }

                    showEditPartModal(getCtx(), slotId, currentRack, part);
                })();

                break;
            case 'delete':
                exitMoveMode();

                (async () => {
                    await refreshCurrentRackFromApi();
                    const { currentRack, part } = await ensurePartInSlot(slotId);

                    if (!currentRack || !part) { alert('対象の箱が見つかりませんでした。画面を最新状態に更新します。'); updateDetails(slotId); 

return; }

                    showDeletePartModal(getCtx(), slotId, currentRack, part);
                })();

                break;
        }
    });

    // メッシュラックのクリック処理（移動/選択）
    // 既存のグローバルクリックリスナを解除してから登録
    if (typeof window !== 'undefined' && window.__piOnBodyClick) {
        try { document.body.removeEventListener('click', window.__piOnBodyClick); } catch {}
    }

    const __onBodyClick = e => {
        if (Date.now() < clickGuardUntil) {
            e.preventDefault();
            
return;
        }

        const rackDisplayArea = document.getElementById('rack-display-area');

        if (rackDisplayArea && rackDisplayArea.contains(e.target)) {
            const slotEl = e.target.closest('.rack-slot');

            if (!slotEl) return;
            const clickedSlotId = slotEl.dataset.slotId;
            const currentRack = racks.find(r => r.id === currentRackId);

            if (!currentRack) return;

            if (isMoveMode) {
                if (!currentRack.slots[clickedSlotId] && clickedSlotId !== moveOriginSlotId) {
                    const rackNumericId = getRackNumericId(currentRack);

                    if (!Number.isFinite(rackNumericId)) {
                        alert('ラックIDの解決に失敗しました');
                        
return;
                    }

                    if (isPostingMove) {
                        // すでに送信中なら無視（ダブルクリック・二重リスナ対策）
                        return;
                    }

                    (async () => {
                        try {
                            isPostingMove = true;
                            await api.moveSlot(rackNumericId, moveOriginSlotId, rackNumericId, clickedSlotId);

                            // サーバーが204や空レスを返してもここまで来たら成功として扱い、ローカル状態を更新
                            currentRack.slots[clickedSlotId] = currentRack.slots[moveOriginSlotId];
                            currentRack.slots[moveOriginSlotId] = null;

                            // 念のためサーバーの最新状態で同期
                            await refreshCurrentRackFromApi();
                            isMoveMode = false;
                            moveOriginSlotId = null;
                            updateDetails(clickedSlotId);
                            console.debug('部品移動: UI更新完了(同期済み)');
                        } catch (err) {
                            console.error('移動に失敗', err);
                            alert('移動に失敗しました。スロットの状態やサーバーをご確認ください。');
                        } finally {
                            isPostingMove = false;
                        }
                    })();
                }
            } else {
                // スロット選択時も最新化してから詳細更新
                (async () => {
                    await refreshCurrentRackFromApi();
                    updateDetails(clickedSlotId);
                })();
            }
        }
    };

    if (typeof window !== 'undefined') {
        window.__piOnBodyClick = __onBodyClick;
        document.body.addEventListener('click', window.__piOnBodyClick);


        // クリックに先行するpointerdown/mousedownをキャプチャ段階で抑止（より確実）
        const guarder = ev => {
            if (Date.now() < clickGuardUntil) {
                ev.stopPropagation();
                ev.preventDefault();
            }
        };


        // 保存してteardownで解除
        window.__piPointerGuard = guarder;
        document.addEventListener('pointerdown', guarder, true);
        document.addEventListener('mousedown', guarder, true);
    }

    // teardown登録（戻り時のクリーンアップ用）
    if (typeof window !== 'undefined') {
        window.__piAppTeardown = () => {
            if (window.__piOnBodyClick) {
                try { document.body.removeEventListener('click', window.__piOnBodyClick); } catch {}
                window.__piOnBodyClick = undefined;
            }

            if (window.__piOnFabMainClick && window.__piFabMainEl) {
                try { window.__piFabMainEl.removeEventListener('click', window.__piOnFabMainClick); } catch {}
                window.__piOnFabMainClick = undefined;
                window.__piFabMainEl = undefined;
            }

            if (window.__piPointerGuard) {
                try {
                    document.removeEventListener('pointerdown', window.__piPointerGuard, true);
                    document.removeEventListener('mousedown', window.__piPointerGuard, true);
                } catch {}

                window.__piPointerGuard = undefined;
            }
        };
    }

    // 部品検索
    searchInput?.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();

        document.querySelectorAll('.rack-slot').forEach(slot => {
            slot.classList.remove('highlight-slot');
            const currentRack = racks.find(r => r.id === currentRackId);

            if (!currentRack || searchTerm.length < 2) return;
            const part = currentRack.slots[slot.dataset.slotId];

            if (part) {
                const nameLc = ((part.partName || '') + '').toLowerCase();
                const modelLc = ((part.partModelNumber || '') + '').toLowerCase();

                if (nameLc.includes(searchTerm) || modelLc.includes(searchTerm)) {
                slot.classList.add('highlight-slot');
                }
            }
        });
    });

    // モーダルの黒背景クリックで閉じる
    // Backdrop click handled by MUI Dialog

    // 初期データロード
    (async function init() {
        const rackNameEl2 = document.getElementById('rack-name');

        if (rackNameEl2) rackNameEl2.textContent = '読み込み中...';

        try {
            const apiData = await loadRacksFromApi();

            racks = transformApiDataToAppData(apiData);

            // 保存されているラックIDが存在すれば復元、なければ先頭ラック
            const savedId = getLastRackId();

            currentRackId = (savedId && racks.some(r => r.id === savedId))
                ? savedId
                : (racks.length > 0 ? racks[0].id : null);
        } catch (e) {
            console.error('APIからのデータ取得に失敗したため、モックデータを使用します。', e);
            racks = transformApiDataToAppData(mockApiData);
            const savedId = getLastRackId();

            currentRackId = (savedId && racks.some(r => r.id === savedId))
                ? savedId
                : (racks.length > 0 ? racks[0].id : null);
        }

        setLastRackId(currentRackId);
        renderApp();
    })();
}
