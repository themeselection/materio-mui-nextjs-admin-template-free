'use client'

/*
======== ファイル概要 ========
SSEで配信される検査イベントをリアルタイムで監視するためのページコンポーネント。
接続状態の可視化・自動再接続・イベントログ表示までを一括で面倒見るよ。
*/

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

const EVENT_STREAM_PATH = '/api/events'
const DEFAULT_BACKEND_PORT = process.env.NEXT_PUBLIC_BACKEND_PORT || '3001'
const CONFIG_BACKEND_HOST = process.env.NEXT_PUBLIC_BACKEND_HOST || null
const CONFIG_BACKEND_PROTOCOL = process.env.NEXT_PUBLIC_BACKEND_PROTOCOL || null
const CONFIG_API_BASE = process.env.NEXT_PUBLIC_API_BASE || null

/**
 * サーバー送信イベント(SSE)の購読を司るカスタムフックだよ。
 * @param {object}   params              - フックに渡すパラメータ袋。
 * @param {string}   params.streamUrl    - 監視対象のSSEエンドポイントURL。
 * @param {Function} params.onEvent      - イベント受信時に呼ぶコールバック。
 * @param {Function} params.onConnecting - 接続開始直前に呼ぶコールバック。
 * @param {Function} params.onOpen       - 接続確立後に呼ぶコールバック。
 * @param {Function} params.onError      - エラー発生時に呼ぶコールバック。
 * @param {Function} params.onConnectionInfo - 接続関連の追加情報を渡すコールバック。
 * @param {number}   params.retryToken   - 再接続トリガーとして使う外部カウンタ。
 */
const useInspectionEvents = ({
  streamUrl,
  onEvent,
  onConnecting,
  onOpen,
  onError,
  onConnectionInfo,
  retryToken
}) => {
  useEffect(() => {
    // ======== 処理ステップ: コールバック検査 → SSE生成 → イベント結線 → クリーンアップ ========
    // 1. コールバックとURLが揃っていないと正常監視できないので即リターンで無用な接続を避ける。
    if (!onEvent || !streamUrl) {
      return undefined
    }

    // 2. 接続開始を親へ通知しローディング表示などを準備させる。
    onConnecting?.()

    let source

    try {
      // 3. withCredentialsを有効化してCookie認証が必要な環境にも対応してる。
      source = new EventSource(streamUrl, { withCredentials: true })
    } catch (error) {
      console.error('SSE 初期化エラー', error)
      onError?.(error)
      onConnectionInfo?.({
        streamUrl,
        initializationFailed: true
      })

      return undefined
    }

    try {
      // 4. EventSource内部のURLは文字列扱いなので、新たにURLオブジェクトで分解して接続先を可視化している。
      const resolvedUrl = new URL(source.url)
      const protocol = resolvedUrl.protocol.replace(':', '')
      const defaultPort = protocol === 'https' ? '443' : protocol === 'http' ? '80' : null

      onConnectionInfo?.({
        streamUrl,
        url: resolvedUrl.toString(),
        origin: resolvedUrl.origin,
        host: resolvedUrl.hostname,
        port: resolvedUrl.port || null,
        defaultPort,
        protocol,
        path: resolvedUrl.pathname + resolvedUrl.search,
        withCredentials: source.withCredentials ?? true,
        initializationFailed: false
      })
    } catch (error) {
      onConnectionInfo?.({
        streamUrl,
        url: source.url,
        withCredentials: source.withCredentials ?? true,
        initializationFailed: false
      })
    }

    source.onopen = () => {
      // 接続復活がログに反映されるようタイムスタンプも共有するよ。
      onOpen?.()
      onConnectionInfo?.({
        openedAt: new Date().toISOString(),
        disconnectedAt: null
      })
    }

    source.onmessage = event => {
      // SSE本文はJSON前提だからparseしてから上位へ渡す。
      try {
        const data = JSON.parse(event.data)
        onEvent(data)
      } catch (error) {
        console.error('イベント解析エラー', error)
      }
    }

    source.onerror = error => {
      // 一度エラーが起きると接続は基本閉じる想定。ここで即closeして再接続制御に委ねる。
      console.error('SSE 接続エラー', error)
      onError?.(error)
      onConnectionInfo?.({
        disconnectedAt: new Date().toISOString()
      })
      source.close()
    }

    return () => {
      // クリーンアップでEventSourceを閉じてリークを防ぐ。
      source?.close()
    }
  }, [streamUrl, onConnecting, onOpen, onEvent, onError, onConnectionInfo, retryToken])
}

const statusChipConfig = {
  connecting: { label: '接続中', color: 'warning' },
  open: { label: '受信中', color: 'success' },
  retrying: { label: '再接続待機中', color: 'warning' },
  error: { label: '切断', color: 'error' }
}

const SSEMonitoringPage = () => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const [events, setEvents] = useState([])
  const [status, setStatus] = useState('connecting')
  const [errorMessage, setErrorMessage] = useState(null)
  const [retryToken, setRetryToken] = useState(0)
  const [connectionInfo, setConnectionInfo] = useState(null)
  const [retryAttempt, setRetryAttempt] = useState(0)
  const [nextRetryInMs, setNextRetryInMs] = useState(null)
  const isClient = typeof window !== 'undefined'
  const reconnectTimeoutRef = useRef(null)
  const retryAttemptRef = useRef(0)

  const streamUrl = useMemo(() => {
    // ======== 処理ステップ: APIベース確認 → プロトコル・ホスト推定 → URL組み立て ========
    // 1. NEXT_PUBLIC_API_BASE があればそちらを優先し、リバースプロキシ経由でも確実にアクセスできるようにする。
    const trimmedApiBase = CONFIG_API_BASE ? CONFIG_API_BASE.replace(/\/$/, '') : null

    if (trimmedApiBase) {
      return `${trimmedApiBase}${EVENT_STREAM_PATH}`
    }

    // 2. プロトコルは環境変数 > window.location > http の順で決める。BFFやサブドメイン構成でも破綻しにくい。
    const protocolSource = CONFIG_BACKEND_PROTOCOL
      ? CONFIG_BACKEND_PROTOCOL.replace(/:/g, '')
      : isClient
        ? window.location.protocol.replace(':', '')
        : 'http'

    const protocol = (protocolSource || 'http').toLowerCase()

    // 3. ホストは設定値が無いときブラウザホストを使って、ローカル/本番のどちらでも同じコードで動かす。
    const host = CONFIG_BACKEND_HOST || (isClient ? window.location.hostname : 'localhost')

    const portSegment = DEFAULT_BACKEND_PORT ? `:${DEFAULT_BACKEND_PORT}` : ''

    return `${protocol}://${host}${portSegment}${EVENT_STREAM_PATH}`
  }, [isClient])

  const clearScheduledReconnect = useCallback(() => {
    // 既存のタイマーを確実に消して多重再接続を防ぐ。
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    setNextRetryInMs(null)
  }, [])

  const scheduleReconnect = useCallback(() => {
    clearScheduledReconnect()

    retryAttemptRef.current += 1
    setRetryAttempt(retryAttemptRef.current)

    // Exponential backoff capped at 30 seconds keeps retry cadence sane even when the backend flaps
    const baseDelay = 2000
    const maxDelay = 30000
    const computedDelay = Math.min(maxDelay, baseDelay * 2 ** (retryAttemptRef.current - 1))

    setStatus('retrying')
    setNextRetryInMs(computedDelay)

    reconnectTimeoutRef.current = setTimeout(() => {
      // setTimeout経由でretryTokenを更新するとuseEffectが再評価されて再接続が走る。
      setRetryToken(token => token + 1)
    }, computedDelay)
  }, [clearScheduledReconnect])

  const handleConnecting = useCallback(() => {
    // 明示的にエラーメッセージを消してユーザーの混乱を防ぐ。
    clearScheduledReconnect()
    setStatus('connecting')
    setErrorMessage(null)
  }, [clearScheduledReconnect])

  const handleOpen = useCallback(() => {
    // 接続成功したら試行回数をリセットし、UIも正常状態へ戻す。
    clearScheduledReconnect()
    retryAttemptRef.current = 0
    setRetryAttempt(0)
    setStatus('open')
    setErrorMessage(null)
  }, [clearScheduledReconnect])

  const handleEvent = useCallback(payload => {
    // 最新イベントを先頭に積んで最大100件まで保持し、古いログが溢れすぎないようにする。
    setEvents(prev => {
      const eventEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        receivedAt: new Date().toISOString(),
        payload
      }

      const next = [eventEntry, ...prev]

      return next.slice(0, 100)
    })
  }, [])

  const handleError = useCallback(() => {
    // エラー時は再試行を誘発しつつ告知文を表示。
    setStatus('error')
    setErrorMessage('SSE接続でエラーが発生しました。ブラウザのコンソールログを確認してください。')
    scheduleReconnect()
  }, [scheduleReconnect])

  const handleConnectionInfo = useCallback(update => {
    // connectionInfoはオブジェクトをマージして履歴的な項目も残す。
    setConnectionInfo(prev => ({ ...(prev || {}), ...update }))
  }, [])

  useInspectionEvents({
    streamUrl,
    onEvent: handleEvent,
    onConnecting: handleConnecting,
    onOpen: handleOpen,
    onError: handleError,
    onConnectionInfo: handleConnectionInfo,
    retryToken
  })

  const latestEventTime = events[0]?.receivedAt

  const formattedLatestEventTime = useMemo(() => {
    if (!latestEventTime) {
      return '未受信'
    }

    const date = new Date(latestEventTime)

    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
  }, [latestEventTime])

  const connectionDisplay = useMemo(() => {
    // ======== 処理ステップ: フォールバック確保 → ラベル整形 → 表示用オブジェクト生成 ========
    // ビルド時はwindowが無いからフォールバックを用意してSSRでも落ちないようにしているよ。
    const hasWindow = typeof window !== 'undefined'
    const fallbackHost = CONFIG_BACKEND_HOST || (hasWindow ? window.location.hostname : 'localhost')
    const fallbackProtocol = CONFIG_BACKEND_PROTOCOL
      ? CONFIG_BACKEND_PROTOCOL.replace(/:/g, '').toUpperCase()
      : hasWindow
        ? window.location.protocol.replace(':', '').toUpperCase()
        : 'HTTP'

    const protocolLabel = connectionInfo?.protocol
      ? connectionInfo.protocol.toUpperCase()
      : fallbackProtocol

    const resolvedDefaultPort = connectionInfo?.defaultPort || (DEFAULT_BACKEND_PORT || '---')
    const portLabel = connectionInfo?.port || (resolvedDefaultPort && resolvedDefaultPort !== '---' ? `${resolvedDefaultPort} (設定)` : '---')

    const absoluteUrl = connectionInfo?.url || streamUrl || '-'
    const openedAtLabel = connectionInfo?.openedAt ? new Date(connectionInfo.openedAt).toLocaleString() : '---'
    const disconnectedAtLabel = connectionInfo?.disconnectedAt
      ? new Date(connectionInfo.disconnectedAt).toLocaleString()
      : '---'

    return {
      absoluteUrl,
      relativeUrl: EVENT_STREAM_PATH,
      host: connectionInfo?.host || fallbackHost,
      port: portLabel,
      protocol: protocolLabel,
      withCredentialsLabel:
        connectionInfo?.withCredentials === false
          ? '無効 (Cookieを送信しません)'
          : '有効 (Cookie/資格情報を送信)',
      basePath: basePath || '(未設定)',
      openedAt: openedAtLabel,
      disconnectedAt: disconnectedAtLabel,
      initializationFailed: connectionInfo?.initializationFailed === true
    }
  }, [connectionInfo, streamUrl, basePath])

  const clearEvents = useCallback(() => {
    setEvents([])
  }, [])

  const reconnect = useCallback(() => {
    // 手動再接続では状態を初期化してからretryTokenを進める。
    clearScheduledReconnect()
    retryAttemptRef.current = 0
    setRetryAttempt(0)
    setStatus('connecting')
    setRetryToken(token => token + 1)
  }, [clearScheduledReconnect])

  const statusChip = statusChipConfig[status] || statusChipConfig.connecting

  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        // ページ離脱時にもタイマーが残らないようにクリーンアップ。
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [])

  const nextRetryLabel = useMemo(() => {
    if (!retryAttempt || !nextRetryInMs) {
      return null
    }

    const seconds = Math.ceil(nextRetryInMs / 1000)

    return `自動再接続 ${retryAttempt} 回目: 約 ${seconds} 秒後に再試行します。`
  }, [retryAttempt, nextRetryInMs])

  return (
    <Grid container spacing={6} sx={{ pb: 6 }}>
      <Grid item xs={12}>
        <Stack direction='row' justifyContent='space-between' alignItems='center' spacing={4} flexWrap='wrap' rowGap={2}>
          <Box>
            <Typography variant='h4' sx={{ mb: 1 }}>
              SSE監視ページ
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              バックエンドが配信するサーバー送信イベントをリアルタイムにモニタリングします。
            </Typography>
          </Box>
          <Stack direction='row' spacing={2} alignItems='center'>
            <Chip color={statusChip.color} label={statusChip.label} />
            <Typography variant='body2' color='text.secondary'>
              最終受信: {formattedLatestEventTime}
            </Typography>
            <Button variant='outlined' onClick={reconnect}>
              再接続
            </Button>
            <Button variant='outlined' color='secondary' onClick={clearEvents} disabled={events.length === 0}>
              ログをクリア
            </Button>
          </Stack>
        </Stack>
        {nextRetryLabel ? (
          <Typography variant='caption' color='text.secondary' sx={{ mt: 2, display: 'block' }}>
            {nextRetryLabel}
          </Typography>
        ) : null}
      </Grid>

      {errorMessage ? (
        <Grid item xs={12}>
          <Alert severity='error'>{errorMessage}</Alert>
        </Grid>
      ) : null}

      <Grid item xs={12} md={5}>
        <Card>
          <CardHeader title='接続情報' subheader='現在のSSE接続先の詳細を確認できます。' />
          <CardContent>
            <Stack spacing={3}>
              {connectionDisplay.initializationFailed ? (
                <Alert severity='warning'>SSEの初期化に失敗しました。接続設定を確認してください。</Alert>
              ) : null}
              <Stack spacing={0.5}>
                <Typography variant='caption' color='text.secondary'>接続URL (絶対)</Typography>
                <Typography variant='body2' sx={{ wordBreak: 'break-all' }}>{connectionDisplay.absoluteUrl}</Typography>
              </Stack>
              <Stack spacing={0.5}>
                <Typography variant='caption' color='text.secondary'>SSEエンドポイント (相対)</Typography>
                <Typography variant='body2' sx={{ wordBreak: 'break-all' }}>{connectionDisplay.relativeUrl}</Typography>
              </Stack>
              <Stack spacing={0.5}>
                <Typography variant='caption' color='text.secondary'>サーバホスト (IP/ドメイン)</Typography>
                <Typography variant='body2'>{connectionDisplay.host}</Typography>
              </Stack>
              <Stack spacing={0.5}>
                <Typography variant='caption' color='text.secondary'>ポート</Typography>
                <Typography variant='body2'>{connectionDisplay.port}</Typography>
              </Stack>
              <Stack spacing={0.5}>
                <Typography variant='caption' color='text.secondary'>プロトコル</Typography>
                <Typography variant='body2'>{connectionDisplay.protocol}</Typography>
              </Stack>
              <Stack spacing={0.5}>
                <Typography variant='caption' color='text.secondary'>資格情報送信</Typography>
                <Typography variant='body2'>{connectionDisplay.withCredentialsLabel}</Typography>
              </Stack>
              <Stack spacing={0.5}>
                <Typography variant='caption' color='text.secondary'>接続確立 (最新)</Typography>
                <Typography variant='body2'>{connectionDisplay.openedAt}</Typography>
              </Stack>
              <Stack spacing={0.5}>
                <Typography variant='caption' color='text.secondary'>最終切断</Typography>
                <Typography variant='body2'>{connectionDisplay.disconnectedAt}</Typography>
              </Stack>
              <Stack spacing={0.5}>
                <Typography variant='caption' color='text.secondary'>ベースパス</Typography>
                <Typography variant='body2'>{connectionDisplay.basePath}</Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={7}>
        <Card>
          <CardHeader title='イベントログ' subheader={`受信件数: ${events.length}`} />
          <CardContent>
            {events.length === 0 ? (
              <Typography variant='body2' color='text.secondary'>
                まだイベントを受信していません。イベントが届くとここに表示されます。
              </Typography>
            ) : (
              <List disablePadding>
                {events.map((event, index) => (
                  <Fragment key={event.id}>
                    <ListItem disableGutters alignItems='flex-start' sx={{ py: 3 }}>
                      <Stack spacing={1} sx={{ width: '100%' }}>
                        <Typography variant='caption' color='text.secondary'>
                          受信時刻: {new Date(event.receivedAt).toLocaleString()}
                        </Typography>
                        <Box
                          component='pre'
                          sx={{
                            m: 0,
                            p: 2,
                            borderRadius: 1,
                            bgcolor: 'action.hover',
                            fontFamily: 'monospace',
                            fontSize: 13,
                            lineHeight: 1.6,
                            maxHeight: 240,
                            overflow: 'auto'
                          }}
                        >
                          {JSON.stringify(event.payload, null, 2)}
                        </Box>
                      </Stack>
                    </ListItem>
                    {index < events.length - 1 ? <Divider component='li' /> : null}
                  </Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default SSEMonitoringPage
