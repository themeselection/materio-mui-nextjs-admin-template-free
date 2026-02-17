# Copilot instructions for this repo

Short, repo-specific rules so AI agents can be productive immediately.

## Big picture
- App: Next.js 14 (App Router) under `javascript-version/` using MUI + Tailwind. Tailwind preflight is disabled and styles are scoped with `important: '#__next'` (`tailwind.config.cjs`).
- Dashboard composition: `Providers` → `AuthGuard` → `LayoutWrapper` → `VerticalLayout` (Navigation/Navbar/Footer) → page. See `src/app/(dashboard)/layout.jsx`, `src/components/AuthGuard.jsx`.
- Path aliases from `jsconfig.json`: `@/*`, `@core/*`, `@layouts/*`, `@menu/*`, `@assets/*`, `@components/*`, `@configs/*`, `@views/*`.

## Dev workflow
- Install: pnpm recommended. Postinstall builds Iconify CSS (`src/assets/iconify-icons/bundle-icons-css.cjs`).
- Run: `pnpm dev` (Windows fallback `npm run dev:win`), Build: `pnpm build`, Start: `pnpm start`, Lint/Format: `pnpm lint`, `pnpm lint:fix`, `pnpm format`.
- Dev suppresses Node deprecation warnings via `NODE_OPTIONS=--no-deprecation` in scripts.

## Routing, auth, and storage
- Public auth routes live in `src/app/(blank-layout-pages)/*` (login/register/forgot-password). Protected app is under `src/app/(dashboard)/*` and uses `AuthGuard`.
- Login: `POST /api/auth/login` then persist `access_token` and `user` to `localStorage` (remember me) or `sessionStorage`. Redirects to `next` query or `/` (`src/views/Login.jsx`).
- Guard: checks token, calls `GET /api/auth/me` with 5s timeout; on 401 it clears both storages and redirects to `/login?next=<pathname>`, on network/timeout it redirects to `/error?code=network|timeout`.

## Backend access and base paths
- Rewrites: `/api/:path*` → backend (default `http://localhost:3001/api/:path*`). Edit `javascript-version/next.config.mjs`.
- Subpath deploys: set `BASEPATH`; client builds absolute URLs with `process.env.NEXT_PUBLIC_BASE_PATH || ''` and still requests `/api/...`.
- Legacy parts inventory uses `process.env.NEXT_PUBLIC_API_BASE` for its own API base (see `src/app/(dashboard)/parts-inventory/page.jsx`).

## Legacy integration patterns
- Iframe wrapper: `src/app/(dashboard)/production-management/page.jsx` renders `public/production-management/生産数管理ページ.html` via `<iframe>`. To add more, drop HTML under `public/<dir>/file.html` and set `src="/<dir>/<file>.html"`.
- Bridging non-React UI: parts inventory boots a legacy app with `initPartsInventoryApp()`, sets `window.API_BASE`, waits for `pi:modal-ready`, and tears down via `window.__piAppTeardown`. MUI dialogs are bridged with `ModalBridge`.

## Theming and layout
- Providers: `src/components/Providers.jsx` wires `@core/contexts`, `@menu/contexts`, and `ThemeProvider`; includes `UpgradeToProButton`.
- Navigation: `@components/layout/vertical/*` with defaults in `@menu/defaultConfigs.js`. Tailwind plugin at `src/@core/tailwind/plugin`.

## Dark modeの使い方（MUI + Tailwind）
- 仕組みの全体像
  - テーマ状態は `SettingsProvider`（`src/@core/contexts/settingsContext.jsx`）で管理され、`mode: 'light' | 'dark'` が Cookie（`themeConfig.settingsCookieName` = `materio-mui-next-free-demo`）に保存されます。
  - `Providers`（`src/components/Providers.jsx`）は SSR で `getSettingsFromCookie()`/`getMode()` を使って初期モードを取得し、MUI の `CssVarsProvider` を包む `ThemeProvider`（`src/components/theme/index.jsx`）へ渡します。これにより初回レンダリング時のちらつきや水和ミスマッチを回避します。
  - `ModeChanger`（`src/components/theme/ModeChanger.jsx`）が `useColorScheme()` により MUI のモードを反映します。

- 既存のトグル UI を使う（最短）
  - ヘッダー用のモード切替が用意されています: `src/components/layout/shared/ModeDropdown.jsx`。
  - 内部では `useSettings()` の `updateSettings({ mode: 'light' | 'dark' })` を呼び出し、Cookie と状態が同期されます。追加の配線は不要です。

- 任意の場所にトグルを置く（再利用パターン）
  - 任意のコンポーネントで以下の要領で切り替え可能です。
    - `const { settings, updateSettings } = useSettings()`
    - `updateSettings({ mode: settings.mode === 'dark' ? 'light' : 'dark' })`
  - Cookieに保存されるため、ページ遷移やSSRでも設定が保持されます。

- コンポーネント側のスタイルの当て方（MUI）
  - MUIコンポーネントはモードに応じて自動で配色が切り替わります。カスタムCSSや`SxProps`では `useTheme()` で `theme.palette`（例: `text.primary`, `background.default`）を参照してください。
  - プライマリカラーは `src/components/theme/index.jsx` で `primaryColorConfig` を `lighten`/`darken` と共に各モードへ適用済みです。

- Tailwind の dark ユーティリティを併用したい場合（任意）
  - 既定では Tailwind の `dark:` 変種は未構成です。Tailwind 側でも明暗を使いたい場合は：
    1) `javascript-version/tailwind.config.cjs` に `darkMode: 'class'` を追加。
  2) MUI のモードと Tailwind の `.dark` クラスを同期する小さなブリッジを作成し、`document.documentElement`（html）に `.dark` を付与/除去します（Next.js のルート要素 id="__next" より上位に付けるのが重要。Tailwind の dark 変種は html もしくは body に .dark が付与されていれば適用されます）。
    3) そのブリッジは `ThemeProvider` の子としてマウントしてください（`Providers.jsx` で `ThemeProvider` 内に配置）。
  - 参考実装（概略）
    - `const { settings } = useSettings(); useEffect(() => { const root = document.documentElement; settings.mode === 'dark' ? root.classList.add('dark') : root.classList.remove('dark'); }, [settings.mode]);`
  - これで `className="dark:bg-gray-900"` のような Tailwind の `dark:` 変種をMUIのモードと一致させて使えます。

- よくある落とし穴
  - `mode` を直接 `localStorage` 等に保存しないこと（既存の Cookie ベースと二重管理になるため）。`useSettings().updateSettings` を必ず使う。
  - Tailwind の `.dark` クラスは Next.js のルート要素（id="__next"）ではなく html（または body）に付けること。Tailwind の `important` 設定の影響で、ルート配下のユーティリティを安定して適用できます。
  - `themeConfig.mode` を変更しただけでは開発中は反映されません。カスタマイザのリセット（Cookie初期化）またはブラウザのストレージから対象Cookieを削除してからリロードしてください（`src/configs/themeConfig.js` のコメント参照）。

## Examples
- Protected page: add `src/app/(dashboard)/your-page/page.jsx` (inherits Providers/Layout/Guard automatically).
- Public page: add `src/app/(blank-layout-pages)/your-page/page.jsx`.
- Backend call pattern:
  `await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/your/endpoint`, { headers: { Authorization: \`Bearer ${token}\` } })`

## Gotchas
- Changing rewrites/basePath requires restarting the dev server.
- When `basePath` is set, prefix asset and iframe URLs (or compute with `NEXT_PUBLIC_BASE_PATH`).
- Ensure storage keys are exactly `access_token` and `user` to interoperate with `AuthGuard` and pages.

—
Open questions to confirm with the team:
- Standardize `NEXT_PUBLIC_BASE_PATH` vs `NEXT_PUBLIC_API_BASE` for legacy areas; both appear today.
- Confirm the shape of auth/user responses for `/api/auth/login` and `/api/auth/me` to keep storage in sync.