import type { MenuItemType } from '#src/api/system'
import type { ProColumns } from '@ant-design/pro-components'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

import { ColorStatusEnum } from '#src/enum/global.js'
import { MenuStatus } from '#src/enum/menu/enum.menu.js'

export function getConstantColumns(): ProColumns<MenuItemType>[] {
  return [
    {
      dataIndex: 'index',
      title: 'STT',
      valueType: 'indexBorder',
      width: 80,
      align: 'center'
    },
    {
      title: 'Tên menu',
      dataIndex: 'name',
      ellipsis: true,
      width: 150,
      render: (_, record) => {
        return record.name
      },
      fieldProps: {
        placeholder: 'Nhập tên menu'
      }
    },
    {
      title: 'Đường dẫn',
      dataIndex: 'path',
      width: 150,
      filters: true,
      onFilter: true,
      ellipsis: true,
      search: false
    },
    {
      title: 'Thứ tự',
      dataIndex: 'order',
      valueType: 'digit',
      width: 80,
      search: false
    },
    {
      title: 'Icon',
      dataIndex: 'icon',
      width: 130,
      search: false
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      valueType: 'select',
      align: 'center',
      fieldProps: {
        placeholder: 'Chọn trạng thái'
      },
      width: 150,
      render: (status) => {
        return status ? (
          <CheckOutlined style={{ color: ColorStatusEnum.SUCCESS }} />
        ) : (
          <CloseOutlined style={{ color: ColorStatusEnum.DANGER }} />
        )
      },
      valueEnum: {
        [MenuStatus.ENABLE]: {
          text: 'Kích hoạt'
        },
        [MenuStatus.DISABLE]: {
          text: 'Ngưng'
        }
      }
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
      align: 'center',
      render: (_, record) => {
        return record.keepAlive ? (
          <CheckOutlined style={{ color: ColorStatusEnum.SUCCESS }} />
        ) : (
          <CloseOutlined style={{ color: ColorStatusEnum.DANGER }} />
        )
      },
      search: false
    },
    {
      title: 'Hiển thị',
      dataIndex: 'hideInMenu',
      align: 'center',
      width: 150,
      render: (_: any, record: any) => {
        const hide = record.hideInMenu
        return hide ? (
          <CheckOutlined style={{ color: ColorStatusEnum.SUCCESS }} />
        ) : (
          <CloseOutlined style={{ color: ColorStatusEnum.DANGER }} />
        )
      },
      valueEnum: {
        true: { text: 'Có' },
        false: { text: 'Không' }
      }
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      valueType: 'date',
      width: 150,
      search: false,
      align: 'center'
    },
    {
      title: 'Ngày cập nhật',
      dataIndex: 'updated_at',
      valueType: 'dateTime',
      width: 250,
      search: false,
      align: 'center'
    }
  ]
}
