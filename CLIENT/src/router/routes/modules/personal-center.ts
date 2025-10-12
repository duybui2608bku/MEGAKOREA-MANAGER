import type { AppRouteRecordRaw } from '#src/router/types'
import { ProfileCardIcon, RiAccountCircleLine, RiUserSettingsLine } from '#src/icons'
import { ContainerLayout } from '#src/layout'
import { personalCenter } from '#src/router/extra-info'

import { createElement, lazy } from 'react'

const MyProfile = lazy(() => import('#src/pages/personal-center/my-profile'))
const Settings = lazy(() => import('#src/pages/personal-center/settings'))

const routes: AppRouteRecordRaw[] = [
  {
    path: '/personal-center',
    Component: ContainerLayout,
    handle: {
      order: personalCenter,
      title: 'Personal Center',
      icon: createElement(RiAccountCircleLine)
    },
    children: [
      {
        path: '/personal-center/my-profile',
        Component: MyProfile,
        handle: {
          title: 'Profile',
          icon: createElement(ProfileCardIcon)
        }
      },
      {
        path: '/personal-center/settings',
        Component: Settings,
        handle: {
          title: 'Settings',
          icon: createElement(RiUserSettingsLine)
        }
      }
    ]
  }
]

export default routes
