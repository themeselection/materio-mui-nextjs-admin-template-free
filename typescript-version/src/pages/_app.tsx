// ** Next Imports
import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'
import type { EmotionCache } from '@emotion/cache'

// ** Config Imports
import themeConfig from 'src/configs/themeConfig'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import ThemeComponent from 'src/@core/theme/ThemeComponent'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** Global css styles
import '../../styles/globals.css'
import HypotecarLayoutWrapper from 'src/layouts/HipotecarLayoutWrapper'
import { Credit, banksCsvUrl, creditsCsvUrl, loadDataFromCSV } from 'src/configs/constants'
import { useEffect, useState } from 'react'
import { useAsync } from 'react-async'

// ** Extend App Props with Emotion
type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

// ** Configure JSS & ClassName
const App = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  const router = useRouter()

  // Variables
  const getLayout =
    Component.getLayout ??
    (page =>
      router.pathname !== '/theme' ? (
        <HypotecarLayoutWrapper>{page}</HypotecarLayoutWrapper>
      ) : (
        <UserLayout>{page}</UserLayout>
      ))

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{`Mi credito hipotecario - Tu aliado para surfear la ola de creditos`}</title>
        <meta name='description' content={`Mi credito hipotecario - Tu aliado para surfear la ola de creditos`} />
        <meta name='keywords' content='Hipotecas, Creditos Hipotecarios, Argentina' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>

      <SettingsProvider>
        <SettingsConsumer>
          {({ settings }) => {
            return <ThemeComponent settings={settings}>{getLayout(<Component {...pageProps} />)}</ThemeComponent>
          }}
        </SettingsConsumer>
      </SettingsProvider>
    </CacheProvider>
  )
}

export default App
