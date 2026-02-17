/*
 * Machine API client for legacy signage pages
 * - Fetches /api/machines/{id} (id defaults to 1)
 * - Exposes a global `window.MachineAPI` UMD-style for easy use in plain HTML
 * - Includes 5s timeout and basic error handling
 *
 * Usage in HTML:
 *   <script src="/machine-signage/machine-api.js"></script>
 *   <script>
 *     MachineAPI.getMachine().then(console.log).catch(console.error)
 *   </script>
 */
(function (global) {
    'use strict';

    var DEFAULT_ID = 1;
    var DEFAULT_TIMEOUT_MS = 5000; // 5 seconds

    /**
     * Build API URL. Per repo rules, clients still request `/api/...` even with basePath.
     * @param {number|string} id
     * @returns {string}
     */
    function buildUrl(id) {
        return '/api/machines/' + String(id);
    }

    /**
     * Build logs API URL: /api/machines/{id}/logs?page=1&limit=10
     * @param {number|string} id
     * @param {{ page?: number, limit?: number }} [params]
     * @returns {string}
     */
    function buildLogsUrl(id, params) {
        params = params || {};
        var page = params.page == null ? 1 : params.page;
        var limit = params.limit == null ? 10 : params.limit;
        return '/api/machines/' + String(id) + '/logs?page=' + encodeURIComponent(String(page)) + '&limit=' + encodeURIComponent(String(limit));
    }

    // Inspection APIs
    function buildCurrentLotUrl() {
        return '/api/ingress/inspection/current-lot';
    }

    function buildLotShotsUrl(lotId) {
        return '/api/inspections/lots/' + encodeURIComponent(String(lotId)) + '/shots';
    }

    /**
     * Fetch JSON with timeout and helpful errors
     * @param {string} url
     * @param {number} timeoutMs
     * @returns {Promise<any>}
     */
    function fetchJson(url, timeoutMs) {
        var controller = new AbortController();
        var timer = setTimeout(function () { controller.abort(); }, timeoutMs);

        return fetch(url, { signal: controller.signal, headers: { 'Accept': 'application/json' } })
            .then(function (res) {
                clearTimeout(timer);
                if (!res.ok) {
                    var err = new Error('API error: ' + res.status + ' ' + res.statusText);
                    err.status = res.status;
                    throw err;
                }
                return res.json();
            })
            .catch(function (err) {
                // Normalize AbortError to a clearer message
                if (err && (err.name === 'AbortError' || err.code === 'ABORT_ERR')) {
                    var e = new Error('API timeout after ' + timeoutMs + 'ms');
                    e.code = 'TIMEOUT';
                    throw e;
                }
                throw err;
            });
    }

    /**
     * Get machine data
     * レスポンス例:
     * {
     *   "machine_id": 1,
     *   "machine_name": "半自動表層バネどめ機",
     *   "started_at": "2025-10-01T10:04:56Z",
     *   "today_uptime_seconds": 48650,
     *   "today_uptime_hms": "13:30:50",
     *   "today_production_count": 19,
     *   "last_inspection_date": "2025-10-24",
     *   "next_inspection_date": "2026-01-22",
     *   "inspection_interval_days": 90
     * }
     * @param {number} [id=1]
     * @param {{ timeoutMs?: number }} [opts]
     * @returns {Promise<object>}
     */
    function getMachine(id, opts) {
        if (id == null) id = DEFAULT_ID;
        opts = opts || {};
        var timeoutMs = typeof opts.timeoutMs === 'number' ? opts.timeoutMs : DEFAULT_TIMEOUT_MS;
        var url = buildUrl(id);
        return fetchJson(url, timeoutMs);
    }

    /**
     * Get machine logs
     * レスポンス例はユーザー提供に準拠（{ total_pages, current_page, logs: [...] }）
     * @param {number} [id=1]
     * @param {{ page?: number, limit?: number, timeoutMs?: number }} [opts]
     * @returns {Promise<{ total_pages:number, current_page:number, logs:Array<any> }>}
     */
    function getMachineLogs(id, opts) {
        if (id == null) id = DEFAULT_ID;
        opts = opts || {};
        var timeoutMs = typeof opts.timeoutMs === 'number' ? opts.timeoutMs : DEFAULT_TIMEOUT_MS;
        var url = buildLogsUrl(id, { page: opts.page == null ? 1 : opts.page, limit: opts.limit == null ? 10 : opts.limit });
        return fetchJson(url, timeoutMs);
    }

    /**
     * Get current lot id for inspections
     * returns: { lot_id: string }
     */
    function getCurrentLot(opts) {
        opts = opts || {};
        var timeoutMs = typeof opts.timeoutMs === 'number' ? opts.timeoutMs : DEFAULT_TIMEOUT_MS;
        var url = buildCurrentLotUrl();
        return fetchJson(url, timeoutMs);
    }

    /**
     * Get lot shots detail
     * returns: {
     *   lot_id: string,
     *   captured_at?: string, // ISO-8601 タイムスタンプ (仕様追加)
     *   shots: Array<{ camera_id:string, status:string, details?:string|null, image_path?:string }>
     * }
     */
    function getLotShots(lotId, opts) {
        opts = opts || {};
        var timeoutMs = typeof opts.timeoutMs === 'number' ? opts.timeoutMs : DEFAULT_TIMEOUT_MS;
        var url = buildLotShotsUrl(lotId);
        return fetchJson(url, timeoutMs);
    }

    // Minimal utility: safe accessor for h:m:s formatting if needed later
    function secondsToHMS(seconds) {
        seconds = Math.max(0, Math.floor(Number(seconds) || 0));
        var h = Math.floor(seconds / 3600);
        var m = Math.floor((seconds % 3600) / 60);
        var s = seconds % 60;
        function pad(n) { return (n < 10 ? '0' : '') + n; }
        return pad(h) + ':' + pad(m) + ':' + pad(s);
    }

    // UMD-style export
    var api = { getMachine: getMachine, getMachineLogs: getMachineLogs, getCurrentLot: getCurrentLot, getLotShots: getLotShots, _secondsToHMS: secondsToHMS };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    } else {
        global.MachineAPI = api;
    }
})(typeof window !== 'undefined' ? window : this);
