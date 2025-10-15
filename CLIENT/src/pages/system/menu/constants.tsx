import type { MenuItemType } from '#src/api/system'
import type { ProColumns } from '@ant-design/pro-components'

import { getYesNoOptions } from '#src/constants'

import { MenuStatus, MenuType } from '#src/enum/menu/enum.menu.js'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { GradientTag } from '#src/components/tag/index.js'
import { ColorStatusEnum } from '#src/enum/global.js'

export function getMenuTypeOptions() {
  return [
    {
      label: 'Menu',
      value: MenuType.MENU
    },
    {
      label: 'Button',
      value: MenuType.BUTTON
    }
  ]
}

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
      width: 150,
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
      align: 'center',
      width: 150,
      render: (text, record) => {
        return <GradientTag type={record.status === MenuStatus.ENABLE ? 'success' : 'default'}>{text}</GradientTag>
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
      align: 'center',
      render: (_, record) => {
        return record.menuType === MenuType.MENU ? (
          <GradientTag type='info'>Menu</GradientTag>
        ) : (
          <GradientTag type='danger'>Button</GradientTag>
        )
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
      align: 'center',
      render: (_, record) => {
        return record.hideInMenu ? (
          <CheckOutlined style={{ color: ColorStatusEnum.SUCCESS }} />
        ) : (
          <CloseOutlined style={{ color: ColorStatusEnum.DANGER }} />
        )
      },
      valueEnum: getYesNoOptions().reduce((acc, curr) => {
        acc.set(curr.value, curr.label)
        return acc
      }, new Map())
    },
    {
      title: 'Hiển thị',
      dataIndex: 'currentActiveMenu',
      align: 'center',
      width: 150,
      render: (currentActiveMenu) => {
        return currentActiveMenu ? (
          <CheckOutlined style={{ color: ColorStatusEnum.SUCCESS }} />
        ) : (
          <CloseOutlined style={{ color: ColorStatusEnum.DANGER }} />
        )
      }
    },
    // {
    //   title: 'Iframe',
    //   dataIndex: 'iframeLink',
    //   width: 120
    // },
    // {
    //   title: 'External',
    //   dataIndex: 'externalLink',
    //   width: 120
    // },
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
