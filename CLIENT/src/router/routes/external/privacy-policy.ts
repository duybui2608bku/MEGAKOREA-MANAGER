import type { AppRouteRecordRaw } from '#src/router/types'

import { lazy } from 'react'
import { Outlet } from 'react-router'

const PrivacyPolicy = lazy(() => import('#src/pages/privacy-policy'))

const routes: AppRouteRecordRaw[] = [
  {
    path: '/privacy-policy',
    Component: Outlet,
    handle: {
      hideInMenu: true,
      title: 'Chính sách bảo mật'
    },
    children: [
      {
        index: true,
        Component: PrivacyPolicy,
        handle: {
          title: 'Chính sách bảo mật'
        }
      }
    ]
  }
]

export default routes
