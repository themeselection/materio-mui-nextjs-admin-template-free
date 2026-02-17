'use client'

/*
======== ファイル概要 ========
アカウント設定画面のページコンポーネントを定義するファイル。
タブごとの内容コンポーネントを取りまとめてベースレイアウトへ渡す役目を持つ。
*/

// View Imports
import AccountSettings from '@views/account-settings'
import Account from '@views/account-settings/account'
import Notifications from '@views/account-settings/notifications'
import Connections from '@views/account-settings/connections'

/**
 * アカウント設定ページ全体をまとめるエントリーポイント。
 * @returns {JSX.Element} アカウント設定画面のレイアウトに必要なタブ群を返すページコンポーネント。
 */
export default function AccountSettingsPage() {
  // ======== 処理ステップ: タブ内容の準備 → ベースレイアウトへ受け渡し ========
  // 1. タブ内容の準備では各タブのコンポーネントを紐づけて、タブ切り替え時に適切なビューが表示されるようにする。
  // 2. ベースレイアウトへ受け渡しでは上記のマッピングをAccountSettingsへ渡し、共通レイアウト内でレンダリングを統一する。
  const tabContentList = {
    /**
     * アカウント情報を編集するタブ。
     * Accountコンポーネントは個人情報のフォーム群を扱うため、ここに紐づけている。
     */
    account: <Account />,
    /**
     * 通知設定を調整するタブ。
     * Notificationsコンポーネント側で通知チャネルの状態管理を行うため、このキーと結びつけている。
     */
    notifications: <Notifications />,
    /**
     * 外部サービス連携状況を表示するタブ。
     * Connectionsコンポーネントが連携リストの描画と操作を担うので、このタブから呼び出す。
     */
    connections: <Connections />
  }

  return <AccountSettings tabContentList={tabContentList} />
}
