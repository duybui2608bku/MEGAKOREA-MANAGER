import type { AppRouteRecordRaw } from '#src/router/types'
import { ContainerLayout } from '#src/layout'

import { home } from '#src/router/extra-info'
import { HomeOutlined } from '@ant-design/icons'
import { createElement, lazy } from 'react'

const Home = lazy(() => import('#src/pages/home'))

const routes: AppRouteRecordRaw[] = [
  {
    path: '/home',
    Component: ContainerLayout,
    handle: {
      order: home,
      title: 'Trang chủ',
      icon: createElement(HomeOutlined)
    },
    children: [
      {
        index: true,
        Component: Home,
        handle: {
          title: 'Trang chủ',
          icon: createElement(HomeOutlined)
        }
      }
    ]
  }
]

export default routes
