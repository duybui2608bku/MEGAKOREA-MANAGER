import { Drawer, Form, Input, message, DatePicker, Select, Row, Col, Button, Space } from 'antd'
import { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { fetchUpdateEmployee } from '#src/api/workspace/hr'
import { UpdateEmployeeRequestBody } from '#src/api/workspace/hr/types'
import { UserInfoType } from '#src/api/user/types'
import dayjs from 'dayjs'
import { GenderOptions } from '#src/constants/option/index.js'
import OptionsRole from '#src/pages/system/role/hook/optionsRole.js'
import OptionsDerpartment from '#src/pages/system/dept/hook/OptionsDerpartment.js'

interface DetailProps {
  title: string
  open: boolean
  onCloseChange: () => void
  detailData: Partial<UserInfoType>
  refreshTable: () => void
}

export const Detail = ({ title, open, onCloseChange, detailData, refreshTable }: DetailProps) => {
  const [form] = Form.useForm()
  const isEdit = Boolean(detailData._id)

  const { mutate: updateEmployeeMutation, isPending: isUpdating } = useMutation({
    mutationFn: fetchUpdateEmployee,
    onSuccess: () => {
      message.success('Cập nhật nhân viên thành công')
      onCloseChange()
      refreshTable()
      form.resetFields()
    },
    onError: (error: any) => {
      message.error(error?.message || 'Cập nhật nhân viên thất bại')
    }
  })

  useEffect(() => {
    if (open && detailData && isEdit) {
      const formData = {
        ...detailData,
        roles: detailData.roles?.map((role) => role._id) || [],
        date_of_birth: detailData.date_of_birth ? dayjs(detailData.date_of_birth) : undefined,
        department: detailData.department?._id
      }
      form.setFieldsValue(formData)
    } else {
      form.resetFields()
    }
  }, [open, detailData, form, isEdit])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const payload: UpdateEmployeeRequestBody = {
        _id: detailData._id as string,
        name: values.name,
        phone: values.phone,
        address: values.address,
        gender: values.gender,
        date_of_birth: values.date_of_birth ? dayjs(values.date_of_birth).toDate() : undefined,
        roles: [values.roles],
        department: values.department
      }

      updateEmployeeMutation(payload)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onCloseChange()
  }

  return (
    <Drawer
      title={title}
      open={open}
      onClose={handleCancel}
      width={720}
      placement='right'
      extra={
        <Space>
          <Button onClick={handleCancel}>Hủy</Button>
          <Button type='primary' onClick={handleSubmit} loading={isUpdating}>
            Cập nhật
          </Button>
        </Space>
      }
    >
      <Form form={form} layout='vertical' preserve={false}>
        <Row gutter={16}>
          <Col xs={24} sm={24}>
            <Form.Item label='Email' name='email'>
              <Input placeholder='Email' disabled />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label='Tên nhân viên'
              name='name'
              rules={[{ required: true, message: 'Vui lòng nhập tên nhân viên' }]}
            >
              <Input placeholder='Nhập tên nhân viên' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label='Số điện thoại'
              name='phone'
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
              ]}
            >
              <Input placeholder='Nhập số điện thoại' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={12}>
            <Form.Item label='Ngày sinh' name='date_of_birth'>
              <DatePicker placeholder='Chọn ngày sinh' style={{ width: '100%' }} format='DD/MM/YYYY' />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label='Giới tính' name='gender' rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}>
              <Select placeholder='Chọn giới tính' options={GenderOptions} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label='Phòng ban' name='department'>
              <OptionsDerpartment />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label='Vai trò' name='roles'>
              <OptionsRole />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} sm={24}>
            <Form.Item label='Địa chỉ' name='address'>
              <Input.TextArea rows={4} placeholder='Nhập địa chỉ' />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  )
}
