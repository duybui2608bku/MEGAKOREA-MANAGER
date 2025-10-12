import type { RoleItemType } from '#src/api/system'
import type { ProColumns } from '@ant-design/pro-components'

import { Tag } from 'antd'

export function getConstantColumns(): ProColumns<RoleItemType>[] {
  return [
    {
      dataIndex: 'index',
      title: 'Index',
      valueType: 'indexBorder',
      width: 80
    },
    {
      title: 'Name',
      dataIndex: 'name',
      disable: true,
      ellipsis: true,
      width: 120,
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'Required'
          }
        ]
      }
    },
    {
      disable: true,
      title: 'ID',
      dataIndex: 'code',
      width: 120,
      filters: true,
      onFilter: true,
      ellipsis: true
    },
    {
      disable: true,
      title: 'Status',
      dataIndex: 'status',
      valueType: 'select',
      width: 80,
      render: (text, record) => {
        return <Tag color={record.status === 1 ? 'success' : 'default'}>{text}</Tag>
      },
      valueEnum: {
        1: {
          text: 'Enabled'
        },
        0: {
          text: 'Deactivated'
        }
      }
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
      search: false
    },
    {
      title: 'Create Time',
      dataIndex: 'createTime',
      valueType: 'date',
      width: 100,
      search: false
    },
    {
      title: 'Update Time',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      width: 170,
      search: false
    }
  ]
}
