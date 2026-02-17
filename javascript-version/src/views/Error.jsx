'use client'

import Link from 'next/link'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

import Illustrations from '@components/Illustrations'
import { useImageVariant } from '@core/hooks/useImageVariant'

export default function ErrorView({ mode, code: rawCode, from: rawFrom }) {
  const darkImg = '/images/pages/misc-mask-dark.png'
  const lightImg = '/images/pages/misc-mask-light.png'
  const miscBackground = useImageVariant(mode, lightImg, darkImg)

  const code = rawCode || 'unknown'
  const from = typeof rawFrom === 'string' && rawFrom.startsWith('/') ? rawFrom : '/'

  const titleMap = {
    timeout: 'サーバーが応答しません',
    network: 'ネットワークエラー',
    unknown: 'エラーが発生しました'
  }

  const descriptionMap = {
    timeout: '数秒待ちましたがバックエンドから応答がありません。少し時間をおいて再度お試しください。',
    network: 'サーバーに接続できませんでした。ネットワークを確認して再度お試しください。',
    unknown: '問題が発生しました。後ほどもう一度お試しください。'
  }

  const isHttpStatus = /^\d{3}$/.test(code)
  const title = isHttpStatus ? `エラー ${code}` : (titleMap[code] || titleMap.unknown)

  const description = isHttpStatus
    ? 'バックエンドがエラーを返しました。時間をおいて再度お試しください。'
    : (descriptionMap[code] || descriptionMap.unknown)

  return (
    <div className='flex items-center justify-center min-bs-[100dvh] relative p-6 overflow-x-hidden'>
      <div className='flex items-center flex-col text-center gap-10'>
        <div className='flex flex-col gap-2 is-[90vw] sm:is-[unset]'>
          <Typography className='font-medium text-5xl sm:text-6xl' color='text.primary'>
            {title}
          </Typography>
          <Typography>{description}</Typography>
          {from && (
            <Typography variant='body2' color='text.secondary'>
              元のページ: {from}
            </Typography>
          )}
        </div>
        <img
          alt='error-illustration'
          src='/images/illustrations/characters/6.png'
          className='object-cover bs-[340px] md:bs-[420px] lg:bs-[480px]'
        />
        <div className='flex gap-3'>
          <Button href={from || '/'} component={Link} variant='contained'>
            元のページへ戻る
          </Button>
          <Button href='/' component={Link} variant='outlined'>
            ホーム
          </Button>
          <Button href='/login' component={Link} variant='outlined'>
            ログイン
          </Button>
        </div>
      </div>
      <Illustrations maskImg={{ src: miscBackground }} />
    </div>
  )
}
