import { ModalForm, ProFormText, ProFormDatePicker, ProFormRadio, ProFormTextArea } from '@ant-design/pro-components'
import { message, Row, Col, Divider, Space } from 'antd'
import UploadComponent from '#src/pages/components/upload/index.js'
import { GenderOptions } from '#src/constants/option/index.js'
import { RegisterFormType } from '#src/api/system/auth/type.js'
import { fetchRegister } from '#src/api/system/auth/index.js'
import { useMutation } from '@tanstack/react-query'
import { queryClient } from '#src/components/index.js'
import { Form } from 'antd'
import OptionsDerpartment from '#src/pages/system/dept/hook/OptionsDerpartment.js'
import OptionsRole from '#src/pages/system/role/hook/optionsRole.js'

interface AddEmployeeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const AddEmployeeModal = ({ open, onOpenChange }: AddEmployeeModalProps) => {
  const [form] = Form.useForm()

  const { mutate: registerMutate, isPending: isCreating } = useMutation({
    mutationFn: (data: RegisterFormType) => fetchRegister(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      message.success('Thêm nhân viên thành công!')
      form.resetFields()
      onOpenChange(false)
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
      date_of_birth: values.date_of_birth ? new Date(values.date_of_birth) : undefined,
      address: values.address || undefined,
      avatar: values.avatar || undefined,
      department: values.department,
      roles: values.roles
    }
    registerMutate(formData)
    return true
  }

  return (
    <ModalForm
      title={'Thêm nhân viên'}
      form={form}
      open={open}
      onOpenChange={onOpenChange}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        width: 900
      }}
      submitTimeout={2000}
      onFinish={onFinish}
      loading={isCreating}
    >
      <Row gutter={[16, 0]}>
        <Col xs={24} sm={24} md={12}>
          <ProFormText
            name='email'
            label='Email'
            placeholder='Nhập email'
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <ProFormText
            name='name'
            label='Họ và Tên'
            placeholder='Nhập họ và tên'
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
          />
        </Col>
      </Row>

      <Row gutter={[16, 0]}>
        <Col xs={24} sm={24} md={8}>
          <ProFormText
            name='phone'
            label='Số Điện Thoại'
            placeholder='Nhập số điện thoại'
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại' },
              { pattern: /^(0|\+84)[3|5|7|8|9][0-9]{8}$/, message: 'Số điện thoại không hợp lệ' }
            ]}
          />
        </Col>
        <Col xs={24} sm={24} md={8}>
          <ProFormDatePicker
            name='date_of_birth'
            label='Ngày Sinh (Tùy Chọn)'
            placeholder='Chọn ngày sinh'
            fieldProps={{
              format: 'DD/MM/YYYY',
              style: { width: '100%' }
            }}
          />
        </Col>
        <Col xs={24} sm={24} md={8}>
          <ProFormRadio.Group
            name='gender'
            label='Giới Tính'
            options={GenderOptions}
            rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
            radioType='button'
            fieldProps={{
              buttonStyle: 'solid'
            }}
          />
        </Col>
      </Row>

      <Row gutter={[16, 0]}>
        <Col xs={24} sm={24} md={12}>
          <ProFormText.Password
            name='password'
            label='Mật Khẩu'
            placeholder='Nhập mật khẩu'
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message: 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt'
              }
            ]}
          />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <ProFormText.Password
            name='confirmPassword'
            label='Xác Nhận Mật Khẩu'
            placeholder='Nhập lại mật khẩu'
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
          />
        </Col>
      </Row>

      <Divider />

      <Row gutter={[16, 0]}>
        <Col xs={24} sm={24} md={8}>
          <ProFormTextArea
            name='address'
            label='Địa Chỉ (Tùy Chọn)'
            placeholder='Nhập địa chỉ'
            fieldProps={{
              rows: 1
            }}
          />
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Form.Item
            name='department'
            label='Phòng Ban'
            rules={[{ required: true, message: 'Vui lòng chọn phòng ban' }]}
          >
            <OptionsDerpartment placeholder='Chọn phòng ban' />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={8}>
          <Form.Item
            name='roles'
            label='Vai Trò'
            rules={[{ required: true, message: 'Vui lòng chọn ít nhất một vai trò' }]}
          >
            <OptionsRole placeholder='Chọn vai trò' multiple />
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
    </ModalForm>
  )
}

export default AddEmployeeModal
