import type { MenuItemType } from '#src/api/system'
import type { ProColumns } from '@ant-design/pro-components'

import { getYesNoOptions } from '#src/constants'

import { Tag } from 'antd'

export function getMenuTypeOptions() {
  return [
    {
      label: 'system.menu.menu',
      value: 0
    },
    {
      label: 'system.menu.iframe',
      value: 1
    },
    {
      label: 'system.menu.externalLink',
      value: 2
    },
    {
      label: 'system.menu.button',
      value: 3
    }
  ]
}

export function getConstantColumns(): ProColumns<MenuItemType>[] {
  return [
    {
      dataIndex: 'index',
      title: 'STT',
      valueType: 'indexBorder',
      width: 80
    },
    {
      title: 'Tên menu',
      dataIndex: 'name',
      ellipsis: true,
      width: 150,
      render: (_, record) => {
        return record.name
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'form.required'
          }
        ]
      }
    },
    {
      title: 'Đường dẫn',
      dataIndex: 'path',
      width: 120,
      filters: true,
      onFilter: true,
      ellipsis: true
    },
    {
      title: 'Thứ tự',
      dataIndex: 'order',
      valueType: 'digit',
      width: 80
    },
    {
      title: 'Icon',
      dataIndex: 'icon',
      width: 130
    },
    {
      disable: true,
      title: 'Trạng thái',
      dataIndex: 'status',
      valueType: 'select',
      width: 150,
      render: (text, record) => {
        return <Tag color={record.status === 1 ? 'success' : 'default'}>{text}</Tag>
      },
      valueEnum: {
        1: {
          text: 'Kích hoạt'
        },
        0: {
          text: 'Ngưng'
        }
      }
    },
    {
      title: 'Loại menu',
      dataIndex: 'menuType',
      width: 100,
      valueEnum: getMenuTypeOptions().reduce((acc, curr) => {
        acc[curr.value] = curr.label
        return acc
      }, {} as Record<number, string>)
    },
    {
      title: 'Đường dẫn component',
      dataIndex: 'component',
      width: 200,
      search: false
    },
    {
      title: 'Cache',
      dataIndex: 'keepAlive',
      valueType: 'select',
      width: 80,
      render: (_, record) => {
        return record.keepAlive ? 'Có' : 'Không'
      },
      valueEnum: getYesNoOptions().reduce((acc, curr) => {
        acc.set(curr.value, curr.label)
        return acc
      }, new Map())
    },
    {
      title: 'Ẩn trong menu',
      dataIndex: 'hideInMenu',
      valueType: 'select',
      width: 180,
      render: (_, record) => {
        return record.hideInMenu ? 'Có' : 'Không'
      },
      valueEnum: getYesNoOptions().reduce((acc, curr) => {
        acc.set(curr.value, curr.label)
        return acc
      }, new Map())
    },
    {
      title: 'Menu active',
      dataIndex: 'currentActiveMenu',
      width: 150
    },
    {
      title: 'Iframe',
      dataIndex: 'iframeLink',
      width: 120
    },
    {
      title: 'External',
      dataIndex: 'externalLink',
      width: 120
    },
    {
      title: 'Tạo',
      dataIndex: 'createTime',
      valueType: 'date',
      width: 150,
      search: false
    },
    {
      title: 'Cập nhật',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      width: 170,
      search: false
    }
  ]
}
