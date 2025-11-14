import { Card } from 'antd'
import { BasicContent } from '#src/components'
import { CreateForm } from '../components/create-form'

export default function CreateLeaveRequest() {
  return (
    <BasicContent>
      <Card title="Tạo đơn nghỉ phép mới" style={{ maxWidth: 800, margin: '0 auto' }}>
        <CreateForm />
      </Card>
    </BasicContent>
  )
}
