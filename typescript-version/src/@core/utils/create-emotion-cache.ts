import createCache from '@emotion/cache'

export const createEmotionCache = () => {
  const cache = createCache({ key: 'css' })

  // cache.compat = true;

  return cache
}
