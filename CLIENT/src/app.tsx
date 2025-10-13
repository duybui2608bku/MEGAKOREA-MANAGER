import { AntdApp, JSSThemeProvider } from '#src/components'
import { usePreferences, useScrollToHash } from '#src/hooks'
import { AppVersionMonitor } from '#src/layout/widgets/version-monitor'

import { theme as antdTheme, ConfigProvider } from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import { Suspense, useCallback, useEffect } from 'react'
import { RouterProvider } from 'react-router/dom'

import { router } from './router'
import { customAntdDarkTheme, customAntdLightTheme } from './styles/theme/antd/antd-theme'

export default function App() {
  const {
    isDark,
    theme,
    themeColorPrimary,
    colorBlindMode,
    colorGrayMode,
    themeRadius,
    changeSiteTheme,

    enableCheckUpdates,
    checkUpdatesInterval,
    sideCollapsedWidth
  } = usePreferences()

  useScrollToHash()

  /**
   * day.js internationalization
   */

  useEffect(() => {
    dayjs.locale('vi')
  }, [])

  /**
   * Change theme when the system theme changes
   */
  const setEmulateTheme = useCallback(
    // eslint-disable-next-line unused-imports/no-unused-vars
    (dark?: boolean) => {
      changeSiteTheme('auto')
    },
    [changeSiteTheme]
  )

  /**
   * Watch system theme change
   */
  useEffect(() => {
    if (theme === 'auto') {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      function matchMode(e: MediaQueryListEvent) {
        setEmulateTheme(e.matches)
      }
      setEmulateTheme(darkModeMediaQuery.matches)
      darkModeMediaQuery.addEventListener('change', matchMode)
      return () => {
        darkModeMediaQuery.removeEventListener('change', matchMode)
      }
    }
  }, [theme, setEmulateTheme])

  const updateColorMode = () => {
    const dom = document.documentElement
    const COLOR_BLIND = 'color-blind-mode'
    const COLOR_GRAY = 'gray-mode'
    colorBlindMode ? dom.classList.add(COLOR_BLIND) : dom.classList.remove(COLOR_BLIND)
    colorGrayMode ? dom.classList.add(COLOR_GRAY) : dom.classList.remove(COLOR_GRAY)
  }

  useEffect(() => {
    updateColorMode()
  }, [colorBlindMode, colorGrayMode])

  return (
    <ConfigProvider
      input={{ autoComplete: 'off' }}
      theme={{
        cssVar: true,
        hashed: false,
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        ...(isDark ? customAntdDarkTheme : customAntdLightTheme),
        token: {
          ...(isDark ? customAntdDarkTheme.token : customAntdLightTheme.token),
          borderRadius: themeRadius,
          colorPrimary: themeColorPrimary
        },
        components: {
          ...(isDark ? customAntdDarkTheme.components : customAntdLightTheme.components),
          Menu: {
            darkItemBg: '#141414',
            itemBg: '#fff',
            ...(isDark ? customAntdDarkTheme.components?.Menu : customAntdLightTheme.components?.Menu),
            collapsedWidth: sideCollapsedWidth
          }
        }
      }}
    >
      <AntdApp>
        <JSSThemeProvider>
          <Suspense fallback={null}>
            {enableCheckUpdates ? <AppVersionMonitor checkUpdatesInterval={checkUpdatesInterval} /> : null}
            <RouterProvider router={router} />
          </Suspense>
        </JSSThemeProvider>
      </AntdApp>
    </ConfigProvider>
  )
}
