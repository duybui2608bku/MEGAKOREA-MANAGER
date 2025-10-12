import type { AppRouteRecordRaw } from '#src/router/types'

import { Iframe } from '#src/components/iframe'
import { RiReactjsLine } from '#src/icons'
import { ContainerLayout } from '#src/layout'
import { outside } from '#src/router/extra-info'

import { AntDesignOutlined, ContainerOutlined } from '@ant-design/icons'
import { createElement } from 'react'
import { Outlet } from 'react-router'

const routes: AppRouteRecordRaw[] = [
  {
    path: '/outside',
    Component: ContainerLayout,
    handle: {
      icon: 'OutsidePageIcon',
      title: 'Bên ngoài',
      order: outside
    },
    children: [
      {
        path: '/outside/embedded',
        Component: Outlet,
        handle: {
          icon: 'EmbeddedIcon',
          title: 'Nhúng'
        },
        children: [
          {
            path: '/outside/embedded/ant-design',
            Component: Iframe,
            handle: {
              icon: createElement(AntDesignOutlined),
              title: 'Ant Design',
              iframeLink: 'https://ant.design/'
            }
          },
          {
            path: '/outside/embedded/project-docs',
            Component: Iframe,
            handle: {
              icon: createElement(ContainerOutlined),
              title: 'Tài liệu dự án',
              iframeLink: 'https://condorheroblog.github.io/react-antd-admin/docs/'
            }
          }
        ]
      },
      {
        path: '/outside/external-link',
        Component: Outlet,
        handle: {
          icon: 'ExternalIcon',
          title: 'Liên kết ngoài'
        },
        children: [
          {
            path: '/outside/external-link/react-docs',
            Component: Iframe,
            handle: {
              icon: createElement(RiReactjsLine),
              title: 'Tài liệu React',
              externalLink: 'https://react.dev/'
            }
          }
        ]
      }
    ]
  }
]

export default routes
