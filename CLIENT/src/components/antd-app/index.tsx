import type { ReactNode } from 'react'

import { StaticAntd } from '#src/utils'

import { theme as antdTheme, App } from 'antd'
import { useEffect } from 'react'

import { setupAntdThemeTokensToHtml } from './setup-antd-theme'

export interface AntdAppProps {
  children: ReactNode
}

export function AntdApp({ children }: AntdAppProps) {
  const { token: antdTokens } = antdTheme.useToken()

  useEffect(() => {
    setupAntdThemeTokensToHtml(antdTokens)
  }, [antdTokens])

  return (
    <App className='h-full'>
      <StaticAntd />
      {children}
    </App>
  )
}
