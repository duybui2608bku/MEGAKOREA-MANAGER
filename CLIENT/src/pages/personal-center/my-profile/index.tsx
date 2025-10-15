import { BasicContent, FormAvatarItem } from '#src/components'
import { useUserStore } from '#src/store'

import { ProForm, ProFormDigit, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { Form, Input } from 'antd'

export default function Profile() {
  const currentUser = useUserStore()

  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar
      }
      const url = 'https://avatar.vercel.sh/blur.svg?text=2'
      return url
    }
    return ''
  }

  const handleFinish = async () => {
    window.$message?.success('Cập nhật thông tin cá nhân thành công')
  }

  return (
    <BasicContent className='max-w-md ml-10'>
      <h3>Hồ sơ của tôi</h3>
      <ProForm
        layout='vertical'
        onFinish={handleFinish}
        initialValues={{
          ...currentUser,
          avatar: getAvatarURL()
        }}
        requiredMark
      >
        <Form.Item
          name='avatar'
          label='Ảnh đại diện'
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn ảnh đại diện!'
            }
          ]}
        >
          <FormAvatarItem />
        </Form.Item>

        <ProFormText
          name='username'
          label='Tên người dùng'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập tên người dùng!'
            }
          ]}
        />

        <ProFormText
          name='email'
          label='Email'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập địa chỉ email!'
            }
          ]}
        />

        <ProFormDigit
          name='phoneNumber'
          label='Số điện thoại'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập số điện thoại!'
            }
          ]}
        >
          <Input type='tel' allowClear />
        </ProFormDigit>

        <ProFormTextArea
          allowClear
          name='description'
          label='Giới thiệu bản thân'
          placeholder='Nhập vài dòng giới thiệu ngắn gọn...'
        />
      </ProForm>
    </BasicContent>
  )
}
