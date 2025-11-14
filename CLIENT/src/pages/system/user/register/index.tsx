import { Form, Input, Button, DatePicker, Radio, message, Card, Row, Col, Divider, Space } from 'antd'

import OptionsDerpartment from '../../dept/hook/OptionsDerpartment'
import OptionsRole from '../../role/hook/optionsRole'
import UploadComponent from '#src/pages/components/upload/index.js'
import { GenderOptions } from '#src/constants/option/index.js'
import { RegisterFormType } from '#src/api/system/auth/type.js'
import { fetchRegister } from '#src/api/system/auth/index.js'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '#src/components/index.js'

const placeholders = {
  email: 'Nhập email',
  name: 'Nhập họ và tên',
  phone: 'Nhập số điện thoại',
  password: 'Nhập mật khẩu',
  confirmPassword: 'Nhập lại mật khẩu',
  address: 'Nhập địa chỉ',
  department: 'Chọn phòng ban',
  roles: 'Chọn vai trò',
  date_of_birth: 'Chọn ngày sinh'
}

const UserRegister = () => {
  const [form] = Form.useForm()

  const { mutate: registerMutate, isPending: isCreating } = useMutation({
    mutationFn: (data: RegisterFormType) => fetchRegister(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      message.success('Đăng ký tài khoản thành công!')
      form.resetFields()
    },
    onError: (error: any) => {
      message.error(error.message)
    },
    retry: 0
  })

  const onFinish = async (values: RegisterFormType) => {
    const formData = {
      email: values.email,
      name: values.name,
      phone: values.phone,
      password: values.password,
      gender: values.gender,
      date_of_birth: values.date_of_birth,
      address: values.address || undefined,
      avatar: values.avatar || undefined,
      department: values.department,
      roles: values.roles
    }

    registerMutate(formData)
  }

  return (
    <div style={{ padding: '20px 20px', background: '#f5f5f5' }}>
      <Row justify='center'>
        <Col span={24}>
          <Card title='Đăng Ký Tài Khoản' style={{ boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}>
            <Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
              <Row gutter={[16, 0]}>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label='Email'
                    name='email'
                    rules={[
                      { required: true, message: 'Vui lòng nhập email' },
                      { type: 'email', message: 'Email không hợp lệ' }
                    ]}
                  >
                    <Input placeholder={placeholders.email} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label='Họ và Tên'
                    name='name'
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                  >
                    <Input placeholder={placeholders.name} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 0]}>
                <Col xs={24} sm={24} md={8}>
                  <Form.Item
                    label='Số Điện Thoại'
                    name='phone'
                    rules={[
                      { required: true, message: 'Vui lòng nhập số điện thoại' },
                      { pattern: /^(0|\+84)[3|5|7|8|9][0-9]{8}$/, message: 'Số điện thoại không hợp lệ' }
                    ]}
                  >
                    <Input placeholder={placeholders.phone} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8}>
                  <Form.Item label='Ngày Sinh (Tùy Chọn)' name='date_of_birth'>
                    <DatePicker
                      format='DD/MM/YYYY'
                      placeholder={placeholders.date_of_birth}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8}>
                  <Form.Item
                    label='Giới Tính'
                    name='gender'
                    rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                  >
                    <Radio.Group block optionType='button' options={GenderOptions} buttonStyle='solid' />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 0]}>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label='Mật Khẩu'
                    name='password'
                    rules={[
                      { required: true, message: 'Vui lòng nhập mật khẩu' },
                      { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                      {
                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                        message: 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt'
                      }
                    ]}
                  >
                    <Input.Password placeholder={placeholders.password} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item
                    label='Xác Nhận Mật Khẩu'
                    name='confirmPassword'
                    rules={[
                      { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve()
                          }
                          return Promise.reject(new Error('Mật khẩu không khớp'))
                        }
                      })
                    ]}
                  >
                    <Input.Password placeholder={placeholders.confirmPassword} />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Row gutter={[16, 0]}>
                <Col xs={24} sm={24} md={8}>
                  <Form.Item label='Địa Chỉ (Tùy Chọn)' name='address'>
                    <Input.TextArea rows={1} placeholder={placeholders.address} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8}>
                  <Form.Item
                    label='Phòng Ban'
                    name='department'
                    rules={[{ required: true, message: 'Vui lòng chọn phòng ban' }]}
                  >
                    <OptionsDerpartment placeholder={placeholders.department} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8}>
                  <Form.Item
                    label='Vai Trò'
                    name='roles'
                    rules={[{ required: true, message: 'Vui lòng chọn ít nhất một vai trò' }]}
                  >
                    <OptionsRole placeholder={placeholders.roles} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 0]}>
                <Col xs={24}>
                  <Form.Item label='Ảnh Đại Diện' name='avatar'>
                    <Space direction='vertical' style={{ width: '100%' }}>
                      <UploadComponent type='image' onUploadSuccess={(data) => form.setFieldValue('avatar', data)} />
                    </Space>
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Form.Item>
                <Space size='middle' style={{ width: '100%' }}>
                  <Button style={{ width: '100%' }} type='primary' htmlType='submit' loading={isCreating}>
                    Đăng Ký
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default UserRegister
