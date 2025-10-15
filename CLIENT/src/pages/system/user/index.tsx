import { BasicContent } from '#src/components'
import { Outlet } from 'react-router'
import { Input } from 'antd'

export default function User() {
  return (
    <BasicContent>
      <h1>User Management</h1>
      <Input placeholder='Enter your username' />
    </BasicContent>
  )
}
