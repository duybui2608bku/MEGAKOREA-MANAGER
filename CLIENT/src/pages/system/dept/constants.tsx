import type { ProColumns } from '@ant-design/pro-components'
import { DerpartmentStatus } from './enum'
import { DepartmentItemType } from '#src/api/derpartment/types.js'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { ColorStatusEnum } from '#src/enum/global.js'

export function getConstantColumns(): ProColumns<DepartmentItemType>[] {
  return [
    {
      dataIndex: '_id',
      title: 'STT',
      valueType: 'indexBorder',
      width: 80
    },
    {
      title: 'Tên phòng ban',
      dataIndex: 'name',
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
      title: 'Mã phòng ban',
      dataIndex: 'code',
      width: 120,
      filters: true,
      onFilter: true,
      ellipsis: true
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      valueType: 'select',
      align: 'center',
      width: 120,
      render: (status) => {
        return status ? (
          <CheckOutlined style={{ color: ColorStatusEnum.SUCCESS }} />
        ) : (
          <CloseOutlined style={{ color: ColorStatusEnum.DANGER }} />
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
