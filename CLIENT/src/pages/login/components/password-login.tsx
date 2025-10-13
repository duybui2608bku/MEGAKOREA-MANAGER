import { PASSWORD_RULES, EMAIL_RULES } from '#src/constants'
import { useAuthStore } from '#src/store'

import { Button, Form, Input, message, Space } from 'antd'
import { Fragment, useState } from 'react'

import { useNavigate, useSearchParams } from 'react-router'

const FORM_INITIAL_VALUES = {
  email: 'dev@megakorea.vn',
  password: 'Thuuyen123aA@'
}

export type PasswordLoginFormType = typeof FORM_INITIAL_VALUES

export function PasswordLogin() {
  const [loading, setLoading] = useState(false)
  const [passwordLoginForm] = Form.useForm()
  const [messageLoadingApi, contextLoadingHolder] = message.useMessage()
  const [searchParams] = useSearchParams()

  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const handleFinish = async (values: PasswordLoginFormType) => {
    setLoading(true)
    messageLoadingApi?.loading('Đang đăng nhập...', 0)
    login(values)
      .then(() => {
        messageLoadingApi?.destroy()
        window.$message?.success('Đăng nhập thành công')
        const redirect = searchParams.get('redirect')
        if (redirect) {
          navigate(`/${redirect.slice(1)}`)
        } else {
          navigate(import.meta.env.VITE_BASE_HOME_PATH)
        }
      })
      .finally(() => {
        messageLoadingApi?.destroy()
        setTimeout(() => {
          window.$message?.destroy()
          setLoading(false)
        }, 1000)
      })
  }

  return (
    <Fragment>
      {contextLoadingHolder}
      <Space direction='vertical'>
        <h2 className='text-colorText mb-3 text-3xl font-bold leading-9 tracking-tight lg:text-4xl'>
          HỆ THỐNG MEGAKOREA
        </h2>
      </Space>

      <Form
        name='passwordLoginForm'
        form={passwordLoginForm}
        layout='vertical'
        initialValues={FORM_INITIAL_VALUES}
        onFinish={handleFinish}
      >
        <Form.Item label={'Tài khoản email'} name='email' rules={EMAIL_RULES()}>
          <Input placeholder={'Nhập email'} />
        </Form.Item>

        <Form.Item label={'Mật khẩu'} name='password' rules={PASSWORD_RULES()}>
          <Input.Password placeholder={'Nhập mật khẩu'} />
        </Form.Item>

        <Button block type='primary' htmlType='submit' loading={loading}>
          Đăng nhập
        </Button>
      </Form>
    </Fragment>
  )
}
