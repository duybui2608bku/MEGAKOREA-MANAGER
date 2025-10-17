import type { AppRouteRecordRaw } from '#src/router/types'
import { ContainerLayout } from '#src/layout'
import { lazy } from 'react'
import { ApartmentOutlined } from '@ant-design/icons'
import { createElement } from 'react'

const Department = lazy(() => import('#src/pages/department'))

const routes: AppRouteRecordRaw[] = [
  {
    path: '/department',
    Component: ContainerLayout,
    handle: {
      icon: createElement(ApartmentOutlined),
      title: 'Phòng ban',
      order: 60,
      roles: ['admin']
    },
    children: [
      {
        index: true,
        Component: Department,
        handle: {
          title: 'Phòng ban',
          icon: createElement(ApartmentOutlined),
          permissions: ['permission:button:add', 'permission:button:update', 'permission:button:delete']
        }
      }
    ]
  }
]

export default routes
