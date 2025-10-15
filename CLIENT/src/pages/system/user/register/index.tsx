import { BasicContent } from '#src/components'
import { Button, Form, Input } from 'antd'

const Register = () => {
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    console.log('Register form values:', values)
  }

  return (
    <BasicContent>
      <div style={{ maxWidth: 600, margin: '20px auto' }}>
        <h2>User Registration</h2>
        <Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
          <Form.Item label='Username' name='username' rules={[{ required: true, message: 'Please input username!' }]}>
            <Input placeholder='Enter username' />
          </Form.Item>

          <Form.Item
            label='Email'
            name='email'
            rules={[
              { required: true, message: 'Please input email!' },
              { type: 'email', message: 'Please enter valid email!' }
            ]}
          >
            <Input placeholder='Enter email' />
          </Form.Item>

          <Form.Item label='Password' name='password' rules={[{ required: true, message: 'Please input password!' }]}>
            <Input.Password placeholder='Enter password' />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' style={{ width: '100%' }}>
              Register User
            </Button>
          </Form.Item>
        </Form>
      </div>
    </BasicContent>
  )
}

export default Register
