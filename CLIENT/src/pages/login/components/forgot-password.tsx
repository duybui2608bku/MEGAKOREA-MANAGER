import { BasicButton } from '#src/components'

import { LeftOutlined } from '@ant-design/icons'
import { useCountDown } from 'ahooks'
import { Button, Form, Input, Space, Typography, message } from 'antd'
import { Fragment, useContext, useState } from 'react'
import { FormModeContext } from '../form-mode-context'
import { fetchForgotPassword } from '#src/api/user'

const { Title } = Typography

const FORM_INITIAL_VALUES = {
  email: ''
}

export type ForgotPasswordFormType = typeof FORM_INITIAL_VALUES

export function ForgotPassword() {
  const [targetDate, setTargetDate] = useState<number>(0)

  const [countdown] = useCountDown({
    targetDate,
    onEnd: () => {
      setTargetDate(0)
    }
  })

  const [loading, setLoading] = useState(false)
  const [forgotForm] = Form.useForm()

  const { setFormMode } = useContext(FormModeContext)

  const handleFinish = async (values: ForgotPasswordFormType) => {
    try {
      setLoading(true)
      await fetchForgotPassword(values)
      message.success('Đã gửi email đặt lại mật khẩu')
      setTargetDate(new Date().getTime() + 1000 * 30)
    } catch (error) {
      // lỗi sẽ được request util xử lý thông báo chung nếu có; hiển thị fallback
      message.error('Không thể gửi yêu cầu. Vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Fragment>
      <Space direction='vertical'>
        <Title level={3}>Quên mật khẩu</Title>
        <p className='text-xs opacity-80'>Nhập email để nhận liên kết đặt lại mật khẩu</p>
      </Space>

      <Form
        name='forgotForm'
        form={forgotForm}
        layout='vertical'
        initialValues={FORM_INITIAL_VALUES}
        onFinish={handleFinish}
      >
        <Form.Item
          label='Email'
          name='email'
          rules={[
            {
              required: true
            },
            {
              type: 'email',
              message: 'Email không hợp lệ'
            }
          ]}
        >
          <Input placeholder='Email' />
        </Form.Item>

        <Form.Item>
          <Button block type='primary' htmlType='submit' loading={loading} disabled={countdown > 0}>
            {countdown > 0
              ? `Vui lòng chờ ${Math.floor(countdown / 1000)} giây để thử lại`
              : 'Gửi liên kết đặt lại mật khẩu'}
          </Button>
        </Form.Item>

        <div className='text-sm text-center'>
          <BasicButton
            type='link'
            icon={<LeftOutlined />}
            className='px-1'
            onPointerDown={() => {
              setFormMode('login')
            }}
          >
            Quay lại
          </BasicButton>
        </div>
      </Form>
    </Fragment>
  )
}
