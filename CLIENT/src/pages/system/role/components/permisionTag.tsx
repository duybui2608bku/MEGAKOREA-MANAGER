import { Tag, Space, Divider } from 'antd'
import { EyeOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { PermissionItemType } from '#src/api/system/index.js'
import { Fragment } from 'react/jsx-runtime'

const getPermissionConfig = (action: string) => {
  switch (action) {
    case 'get':
      return {
        icon: EyeOutlined,
        label: 'Xem',
        color: 'blue'
      }
    case 'add':
      return {
        icon: PlusOutlined,
        label: 'Thêm',
        color: 'green'
      }
    case 'update':
      return {
        icon: EditOutlined,
        label: 'Sửa',
        color: 'orange'
      }
    case 'delete':
      return {
        icon: DeleteOutlined,
        label: 'Xóa',
        color: 'red'
      }
    default:
      return {
        icon: EyeOutlined,
        label: action.charAt(0).toUpperCase() + action.slice(1),
        color: 'default'
      }
  }
}

export const PermissionTag = ({ permissions }: { permissions: PermissionItemType[] }) => {
  if (!permissions || permissions.length === 0) {
    return <>-</>
  }

  return (
    <Space size={[8, 8]}>
      {permissions.map((permission) => {
        const { icon: Icon, label, color } = getPermissionConfig(permission.action)
        return (
          <Fragment>
            <Tag icon={<Icon />} color={color} style={{ cursor: 'pointer', marginRight: 0 }}>
              {label}
            </Tag>
            <Divider type='vertical' key={permission._id} />
          </Fragment>
        )
      })}
    </Space>
  )
}
