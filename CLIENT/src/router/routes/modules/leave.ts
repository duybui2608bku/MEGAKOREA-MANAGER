import type { AppRouteRecordRaw } from '#src/router/types'
import { ContainerLayout } from '#src/layout'
import { lazy } from 'react'

const LeaveRequestLayout = lazy(() => import('#src/pages/request/leave'))
const MyLeaveRequests = lazy(() => import('#src/pages/request/leave/my-request'))
const CreateLeaveRequest = lazy(() => import('#src/pages/request/leave/create'))
const PendingLeaveRequests = lazy(() => import('#src/pages/request/leave/list'))

const routes: AppRouteRecordRaw[] = [
  {
    path: '/leave',
    Component: ContainerLayout,
    handle: {
      icon: 'CalendarOutlined',
      title: 'Nghỉ phép',
      order: 6
    },
    children: [
      {
        path: '/leave/my-request',
        Component: MyLeaveRequests,
        handle: {
          icon: 'FileTextOutlined',
          title: 'Đơn của tôi'
        }
      },
      {
        path: '/leave/create',
        Component: CreateLeaveRequest,
        handle: {
          icon: 'PlusCircleOutlined',
          title: 'Tạo đơn mới'
        }
      },
      {
        path: '/leave/list',
        Component: PendingLeaveRequests,
        handle: {
          icon: 'CheckCircleOutlined',
          title: 'Đơn chờ duyệt',
          roles: ['admin', 'manager']
        }
      }
    ]
  }
]

export default routes
