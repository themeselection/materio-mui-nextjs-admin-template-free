// app/GoogleAnalytics

'use client'

import Script from 'next/script'

export const GA_TRACKING_ID = 'G-3ZB17SX46P'

const GoogleAnalytics = () => {
  return (
    <>
      {GA_TRACKING_ID && (
        <>
          <Script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
          <Script id='google-analytics'>
            {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}');
              `}
          </Script>
        </>
      )}
    </>
  )
}

export default GoogleAnalytics
