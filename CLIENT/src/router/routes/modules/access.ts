import type { AppRouteRecordRaw } from '#src/router/types'

import { ContainerLayout } from '#src/layout'
import { access } from '#src/router/extra-info'
import { accessControlCodes } from '#src/hooks/use-access/constants'

import { lazy } from 'react'

const PageControl = lazy(() => import('#src/pages/access/page-control'))
const ButtonControl = lazy(() => import('#src/pages/access/button-control'))
const AdminVisible = lazy(() => import('#src/pages/access/admin-visible'))
const CommonVisible = lazy(() => import('#src/pages/access/common-visible'))

const routes: AppRouteRecordRaw[] = [
  {
    path: '/access',
    Component: ContainerLayout,
    handle: {
      icon: 'SafetyOutlined',
      title: 'Truy cập',
      order: access
    },
    children: [
      {
        path: '/access/page-control',
        Component: PageControl,
        handle: {
          icon: 'FileTextOutlined',
          title: 'Điều khiển trang',
          permissions: [accessControlCodes.get]
        }
      },
      {
        path: '/access/button-control',
        Component: ButtonControl,
        handle: {
          icon: 'LockOutlined',
          title: 'Điều khiển nút'
        }
      },
      {
        path: '/access/admin-visible',
        Component: AdminVisible,
        handle: {
          icon: 'EyeOutlined',
          title: 'Hiển thị với Admin',
          roles: ['admin']
        }
      },
      {
        path: '/access/common-visible',
        Component: CommonVisible,
        handle: {
          icon: 'EyeOutlined',
          title: 'Hiển thị với người dùng thường',
          roles: ['common']
        }
      }
    ]
  }
]

export default routes
