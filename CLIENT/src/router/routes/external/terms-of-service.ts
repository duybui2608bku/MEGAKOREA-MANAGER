import type { AppRouteRecordRaw } from '#src/router/types'

import { lazy } from 'react'
import { Outlet } from 'react-router'

const TermsOfService = lazy(() => import('#src/pages/terms-of-service'))

const routes: AppRouteRecordRaw[] = [
  {
    path: '/terms-of-service',
    Component: Outlet,
    handle: {
      hideInMenu: true,
      title: 'Điều khoản dịch vụ'
    },
    children: [
      {
        index: true,
        Component: TermsOfService,
        handle: {
          title: 'Điều khoản dịch vụ'
        }
      }
    ]
  }
]

export default routes
