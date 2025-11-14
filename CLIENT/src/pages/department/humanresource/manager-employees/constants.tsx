import { ProColumns } from '#node_modules/@ant-design/pro-components/es'
import { UserInfoType } from '#src/api/user/types.js'
import { UserGender } from '#src/enum/user.js'
import DepValueEnumQuery from '#src/pages/hook/dep/dep-query.js'
import RoleValueEnumQuery from '#src/pages/hook/role/role-query.js'
import { Avatar, Space } from 'antd'

export const getConstantColumns = (): ProColumns<UserInfoType>[] => {
  return [
    {
      dataIndex: 'index',
      title: 'STT',
      valueType: 'indexBorder',
      width: 80,
      align: 'center'
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'name',
      ellipsis: true,
      width: 120,
      render: (_, record) => {
        return (
          <Space>
            <Avatar src={record.avatar} />
            <span>{record.name}</span>
          </Space>
        )
      }
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      ellipsis: true,
      width: 150,
      copyable: true
    },
    {
      title: 'Email',
      dataIndex: 'email',
      copyable: true,
      width: 300
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      width: 120,
      render: (_, record) => {
        return record.gender === UserGender.MALE ? 'Nam' : record.gender === UserGender.FEMALE ? 'Nữ' : 'Khác'
      },
      search: false
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      ellipsis: true,
      width: 120
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      ellipsis: true,
      width: 120,
      render: (_, record) => {
        return record.department.name
      },
      valueEnum: DepValueEnumQuery(),
      fieldProps: {
        showSearch: true,
        placeholder: 'Chọn phòng ban',
        allowClear: true
      }
    },
    {
      title: 'Vai trò',
      dataIndex: 'roles',
      width: 250,
      render: (_, record) => {
        return record.roles.map((role: any) => role.name).join(', ')
      },
      valueEnum: RoleValueEnumQuery(),
      fieldProps: {
        showSearch: true,
        placeholder: 'Chọn vai trò',
        allowClear: true
      }
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      valueType: 'date',
      width: 120
    }
  ]
}
