import { ProColumns } from '#node_modules/@ant-design/pro-components/es'
import { UserInfoType } from '#src/api/user/types.js'
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
        console.log(record)

        return (
          <Space>
            <Avatar src={record.avatar} />
            <span>{record.name}</span>
          </Space>
        )
      }
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      ellipsis: true,
      width: 120
    },
    {
      title: 'Email',
      dataIndex: 'email',
      ellipsis: true,
      width: 120
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
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
      }
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      valueType: 'date',
      width: 120,
      search: false
    }
  ]
}
