import { BasicButton } from '#src/components'
import { PASSWORD_RULES, EMAIL_RULES } from '#src/constants'

import { Button, Checkbox, Form, Input, Space, Typography } from 'antd'
import { useContext, useState } from 'react'
import { Trans } from 'react-i18next'

import { Link } from 'react-router'
import { FormModeContext } from '../form-mode-context'

const { Title } = Typography

const FORM_INITIAL_VALUES = {
  email: '',
  password: '',
  confirmPassword: ''
}
export type RegisterPasswordFormType = typeof FORM_INITIAL_VALUES

export function RegisterPassword() {
  const [loading] = useState(false)
  const [registerForm] = Form.useForm()

  const { setFormMode } = useContext(FormModeContext)

  const handleFinish = async () => {
    window.$message?.success('Đăng ký thành công')
  }

  return (
    <>
      <Space direction='vertical'>
        <Title level={3}>Chào mừng bạn đến với</Title>
        <Title className='mt-0' level={5}>
          {import.meta.env.VITE_GLOB_APP_TITLE}
        </Title>
      </Space>

      <Form
        name='registerForm'
        form={registerForm}
        layout='vertical'
        initialValues={FORM_INITIAL_VALUES}
        onFinish={handleFinish}
      >
        <Form.Item label={'Tài khoản'} name='username' rules={EMAIL_RULES()}>
          <Input placeholder='Tài khoản email là bắt buộc' />
        </Form.Item>

        <Form.Item label={'Mật khẩu'} name='password' rules={PASSWORD_RULES()}>
          <Input.Password placeholder='Mật khẩu là bắt buộc' />
        </Form.Item>

        <Form.Item
          name='confirm'
          label={'Xác nhận mật khẩu'}
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Xác nhận mật khẩu là bắt buộc'
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Xác nhận mật khẩu không khớp'))
              }
            })
          ]}
        >
          <Input.Password placeholder='Xác nhận mật khẩu là bắt buộc' />
        </Form.Item>

        <Form.Item
          rules={[
            () => ({
              validator(_, value) {
                return value !== true
                  ? Promise.reject(new Error('Bạn phải đồng ý với điều khoản và điều kiện'))
                  : Promise.resolve()
              }
            })
          ]}
          name='termsAgreement'
          valuePropName='checked'
        >
          <Checkbox>
            <div className='flex flex-wrap text-xs'>
              <Trans
                i18nKey='Bạn phải đồng ý với điều khoản và điều kiện'
                components={[
                  <Link key={0} to='/terms-of-service' target='_blank' />,
                  <Link key={1} to='/privacy-policy' target='_blank' />
                ]}
              />
            </div>
          </Checkbox>
        </Form.Item>

        <Form.Item>
          <Button block type='primary' htmlType='submit' loading={loading}>
            Đăng ký
          </Button>
        </Form.Item>

        <div className='text-sm text-center'>
          Bạn đã có tài khoản?
          <BasicButton
            type='link'
            className='px-1'
            onPointerDown={() => {
              setFormMode('login')
            }}
          >
            Đăng nhập
          </BasicButton>
        </div>
      </Form>
    </>
  )
}
