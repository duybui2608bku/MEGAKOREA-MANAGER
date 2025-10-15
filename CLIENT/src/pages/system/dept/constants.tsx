import type { RoleItemType } from '#src/api/system'
import type { ProColumns } from '@ant-design/pro-components'

import { DerpartmentStatus } from './enum'
import { GradientTag } from '#src/components/tag/index.js'

export function getConstantColumns(): ProColumns<RoleItemType>[] {
  return [
    {
      dataIndex: 'STT',
      title: 'Index',
      valueType: 'indexBorder',
      width: 80
    },
    {
      title: 'Tên phòng ban',
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
      title: 'Mã phòng ban',
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
      width: 80,
      render: (status) => {
        return (
          <GradientTag type={status === DerpartmentStatus.ACTIVE ? 'success' : 'default'}>
            {status === DerpartmentStatus.ACTIVE ? 'Hoạt động' : 'Không hoạt động'}
          </GradientTag>
        )
      },
      valueEnum: {
        [DerpartmentStatus.ACTIVE]: {
          text: 'Hoạt động'
        },
        [DerpartmentStatus.INACTIVE]: {
          text: 'Không hoạt động'
        }
      }
    },
    {
      title: 'Miêu tả',
      dataIndex: 'description',
      search: false
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      valueType: 'date',
      width: 100,
      search: false
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updated_at',
      valueType: 'dateTime',
      width: 170,
      search: false
    }
  ]
}
