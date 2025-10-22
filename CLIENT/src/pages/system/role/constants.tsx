import type { RoleItemType } from '#src/api/system'
import type { ProColumns } from '@ant-design/pro-components'
import { PermissionTag } from './components/permisionTag'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { ColorStatusEnum } from '#src/enum/global.js'

export function getConstantColumns(): ProColumns<RoleItemType>[] {
  return [
    {
      dataIndex: 'index',
      title: 'STT',
      valueType: 'indexBorder',
      width: 80
    },
    {
      title: 'Tên chức vụ',
      dataIndex: 'name',
      disable: true,
      ellipsis: true,
      width: 120
    },
    {
      disable: true,
      title: 'Code',
      dataIndex: 'code',
      width: 120,
      filters: true,
      onFilter: true,
      ellipsis: true
    },
    {
      disable: true,
      title: 'Trạng thái',
      dataIndex: 'status',
      valueType: 'select',
      align: 'center',
      width: 120,
      render: (_, record) => {
        return record.status ? (
          <CheckOutlined style={{ color: ColorStatusEnum.SUCCESS }} />
        ) : (
          <CloseOutlined style={{ color: ColorStatusEnum.DANGER }} />
        )
      }
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      search: false
    },
    {
      title: 'Quyền',
      dataIndex: 'permissions',
      valueType: 'select',
      width: 120,
      render: (_text, record) => {
        return <PermissionTag permissions={record.permissions} />
      }
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      valueType: 'date',
      width: 120,
      search: false
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updated_at',
      valueType: 'dateTime',
      width: 200,
      search: false
    }
  ]
}
