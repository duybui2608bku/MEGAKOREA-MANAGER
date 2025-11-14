import { BasicContent, FormAvatarItem } from '#src/components'
import { useUserStore } from '#src/store'
import { fetchUpdateMyProfile } from '#src/api/user'
import type { UpdateMyProfileRequestBody } from '#src/api/user'

import { ProForm, ProFormText, ProFormTextArea, ProFormRadio, ProFormDatePicker } from '@ant-design/pro-components'
import { Form, Spin, Card, Avatar, Tag, Divider, Row, Col, Space } from 'antd'
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  EditOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

export default function Profile() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const currentUser = useUserStore((state) => state)
  const getUserInfo = useUserStore((state) => state.getUserInfo)

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true)
        await getUserInfo()
      } catch (error) {
        window.$message?.error('Không thể tải thông tin người dùng')
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [getUserInfo])

  const getAvatarURL = () => {
    if (currentUser?.avatar) {
      return currentUser.avatar
    }
    return 'https://avatar.vercel.sh/blur.svg?text=User'
  }

  const handleFinish = async (values: any) => {
    try {
      setSubmitting(true)

      const updateData: UpdateMyProfileRequestBody = {
        name: values.name,
        phone: values.phone,
        gender: values.gender,
        address: values.address,
        avatar: values.avatar,
        date_of_birth: values.date_of_birth ? new Date(values.date_of_birth) : undefined
      }

      const response = await fetchUpdateMyProfile(updateData)

      if (response.success) {
        await getUserInfo()
        window.$message?.success('Cập nhật thông tin cá nhân thành công')
        setIsEditing(false)
      }
    } catch (error: any) {
      window.$message?.error(error?.message || 'Cập nhật thông tin thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  const getGenderLabel = (gender: number) => {
    const genderMap: { [key: number]: string } = {
      1: 'Nam',
      2: 'Nữ',
      3: 'Khác'
    }
    return genderMap[gender] || 'Chưa cập nhật'
  }

  const getGenderColor = (gender: number) => {
    const colorMap: { [key: number]: string } = {
      1: 'blue',
      2: 'pink',
      3: 'purple'
    }
    return colorMap[gender] || 'default'
  }

  if (loading) {
    return (
      <BasicContent className='max-w-6xl mx-auto px-6'>
        <div className='flex justify-center items-center min-h-[600px]'>
          <Spin size='large' tip='Đang tải thông tin...' />
        </div>
      </BasicContent>
    )
  }

  return (
    <BasicContent className='max-w-6xl mx-auto px-6 py-8'>
      {/* Header Section */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Hồ sơ cá nhân</h1>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column - Profile Overview */}
        <Col xs={24} lg={8}>
          <Card
            className='shadow-lg rounded-2xl border-0'
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            <div className='text-center'>
              <div className='relative inline-block mb-4'>
                <Avatar
                  size={140}
                  src={getAvatarURL()}
                  icon={<UserOutlined />}
                  className='border-4 border-white shadow-xl'
                />
                <div className='absolute bottom-0 right-0 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center'>
                  <CheckCircleOutlined className='text-white text-sm' />
                </div>
              </div>

              <h2 className='text-2xl font-bold text-white mb-1'>{currentUser.name}</h2>
              <p className='text-white/80 mb-4 flex items-center justify-center gap-2'>
                <MailOutlined /> {currentUser.email}
              </p>

              <Tag color={getGenderColor(currentUser.gender)} className='px-4 py-1 text-sm font-medium'>
                {getGenderLabel(currentUser.gender)}
              </Tag>

              <Divider className='bg-white/20 my-6' />

              <Space direction='vertical' size='middle' className='w-full text-left'>
                {currentUser.phone && (
                  <div className='flex items-start gap-3 text-white/90'>
                    <PhoneOutlined className='text-lg mt-1' />
                    <div>
                      <div className='text-xs text-white/60'>Số điện thoại</div>
                      <div className='font-medium'>{currentUser.phone}</div>
                    </div>
                  </div>
                )}

                {currentUser.date_of_birth && (
                  <div className='flex items-start gap-3 text-white/90'>
                    <CalendarOutlined className='text-lg mt-1' />
                    <div>
                      <div className='text-xs text-white/60'>Ngày sinh</div>
                      <div className='font-medium'>{dayjs(currentUser.date_of_birth).format('DD/MM/YYYY')}</div>
                    </div>
                  </div>
                )}

                {currentUser.address && (
                  <div className='flex items-start gap-3 text-white/90'>
                    <EnvironmentOutlined className='text-lg mt-1' />
                    <div>
                      <div className='text-xs text-white/60'>Địa chỉ</div>
                      <div className='font-medium'>{currentUser.address}</div>
                    </div>
                  </div>
                )}
              </Space>
            </div>
          </Card>
        </Col>

        {/* Right Column - Edit Form */}
        <Col xs={24} lg={16}>
          <Card
            className='shadow-lg rounded-2xl border-0'
            title={
              <div className='flex items-center justify-between'>
                <span className='text-xl font-semibold'>
                  <EditOutlined className='mr-2' />
                  Chỉnh sửa thông tin
                </span>
              </div>
            }
          >
            <ProForm
              layout='vertical'
              onFinish={handleFinish}
              submitter={{
                searchConfig: {
                  submitText: 'Lưu thay đổi'
                },
                resetButtonProps: {
                  style: { display: 'none' }
                },
                submitButtonProps: {
                  loading: submitting,
                  size: 'large',
                  className: 'px-8'
                }
              }}
              initialValues={{
                name: currentUser.name,
                email: currentUser.email,
                phone: currentUser.phone,
                gender: currentUser.gender,
                date_of_birth: currentUser.date_of_birth ? dayjs(currentUser.date_of_birth) : undefined,
                address: currentUser.address,
                avatar: getAvatarURL()
              }}
              requiredMark='optional'
            >
              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    name='avatar'
                    label={<span className='font-semibold'>Ảnh đại diện</span>}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng chọn ảnh đại diện!'
                      }
                    ]}
                  >
                    <FormAvatarItem />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <ProFormText
                    name='name'
                    label={<span className='font-semibold'>Tên người dùng</span>}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập tên người dùng!'
                      }
                    ]}
                    placeholder='Nhập tên người dùng'
                    fieldProps={{
                      size: 'large',
                      prefix: <UserOutlined className='text-gray-400' />
                    }}
                  />
                </Col>

                <Col xs={24} md={12}>
                  <ProFormText
                    name='email'
                    label={<span className='font-semibold'>Email</span>}
                    disabled
                    fieldProps={{
                      value: currentUser.email,
                      size: 'large',
                      prefix: <MailOutlined className='text-gray-400' />
                    }}
                    tooltip='Email không thể thay đổi'
                  />
                </Col>

                <Col xs={24} md={12}>
                  <ProFormText
                    name='phone'
                    label={<span className='font-semibold'>Số điện thoại</span>}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng nhập số điện thoại!'
                      },
                      {
                        pattern: /^[0-9]{10}$/,
                        message: 'Số điện thoại phải có 10 chữ số!'
                      }
                    ]}
                    placeholder='Nhập số điện thoại'
                    fieldProps={{
                      size: 'large',
                      prefix: <PhoneOutlined className='text-gray-400' />
                    }}
                  />
                </Col>

                <Col xs={24} md={12}>
                  <ProFormDatePicker
                    name='date_of_birth'
                    label={<span className='font-semibold'>Ngày sinh</span>}
                    fieldProps={{
                      format: 'DD/MM/YYYY',
                      style: { width: '100%' },
                      size: 'large',
                      prefix: <CalendarOutlined className='text-gray-400' />
                    }}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng chọn ngày sinh!'
                      }
                    ]}
                    placeholder='Chọn ngày sinh'
                  />
                </Col>

                <Col span={24}>
                  <ProFormRadio.Group
                    name='gender'
                    label={<span className='font-semibold'>Giới tính</span>}
                    options={[
                      { label: 'Nam', value: 1 },
                      { label: 'Nữ', value: 2 },
                      { label: 'Khác', value: 3 }
                    ]}
                    rules={[
                      {
                        required: true,
                        message: 'Vui lòng chọn giới tính!'
                      }
                    ]}
                    radioType='button'
                    fieldProps={{
                      size: 'large',
                      buttonStyle: 'solid'
                    }}
                  />
                </Col>

                <Col span={24}>
                  <ProFormTextArea
                    allowClear
                    name='address'
                    label={<span className='font-semibold'>Địa chỉ</span>}
                    placeholder='Nhập địa chỉ của bạn...'
                    fieldProps={{
                      rows: 4,
                      size: 'large',
                      showCount: true,
                      maxLength: 200
                    }}
                  />
                </Col>
              </Row>
            </ProForm>
          </Card>
        </Col>
      </Row>
    </BasicContent>
  )
}
