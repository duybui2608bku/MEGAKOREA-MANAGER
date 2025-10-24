import { ProColumns } from '#node_modules/@ant-design/pro-components/es'
import { Avatar, Space, Typography } from '#node_modules/antd/es'
import { UserInfoType } from '#src/api/user/types.js'

export const getConstantColumns = (): ProColumns<UserInfoType>[] => {
  return [
    {
      dataIndex: 'index',
      title: 'STT',
      valueType: 'indexBorder',
      width: 80
    },
    {
      title: 'Tên nhân viên',
      dataIndex: 'name',
      ellipsis: true,
      width: 120
      // render: (_, record) => (
      //   <Space align='center'>
      //     <Avatar size={24} src={record.avatar} />
      //     <Typography.Text strong>{record.name}</Typography.Text>
      //   </Space>
      // )
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
