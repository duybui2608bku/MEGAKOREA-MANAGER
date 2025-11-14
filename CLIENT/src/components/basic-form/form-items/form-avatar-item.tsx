import { UploadOutlined } from '@ant-design/icons'

import { Avatar, Button, Upload, message } from 'antd'
import type { RcFile } from 'antd/es/upload/interface'
import ImgCrop from 'antd-img-crop'
import { Fragment, useState } from 'react'
import { uploadImage } from '#src/api/media'
import { useAuthStore } from '#src/store'
import { UploadTypeEnum } from '#src/enum/global.js'

interface FormAvatarItemProps {
  value?: string
  onChange?: (value: any) => void
}

export function FormAvatarItem({ value, onChange }: FormAvatarItemProps) {
  const [loading, setLoading] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const accessToken = useAuthStore((state) => state.access_token)

  const handleCustomRequest = async (options: any) => {
    const { file, onSuccess, onError } = options

    try {
      setLoading(true)
      messageApi.loading({ content: 'Đang tải ảnh lên...', key: 'upload', duration: 0 })

      const formData = new FormData()
      formData.append(UploadTypeEnum.IMAGE, file)

      const response = await uploadImage(formData)

      if (response.success && response.result && response.result.length > 0) {
        const uploadedImage = response.result[0]
        onChange?.(uploadedImage.url)
        onSuccess?.(response, file)
        messageApi.success({ content: 'Tải ảnh lên thành công!', key: 'upload', duration: 2 })
      } else {
        throw new Error('Upload failed')
      }
    } catch (error: any) {
      onError?.(error)
      messageApi.error({
        content: error?.message || 'Tải ảnh lên thất bại!',
        key: 'upload',
        duration: 2
      })
    } finally {
      setLoading(false)
    }
  }

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/')
    if (!isImage) {
      messageApi.error('Chỉ có thể tải lên file ảnh!')
      return false
    }

    const isLt5M = file.size / 1024 / 1024 < 5
    if (!isLt5M) {
      messageApi.error('Kích thước ảnh phải nhỏ hơn 5MB!')
      return false
    }

    return true
  }

  return (
    <Fragment>
      {contextHolder}
      <div className='flex items-center gap-5'>
        <Avatar size={100} src={value} />
        <ImgCrop rotationSlider aspectSlider showReset showGrid cropShape='rect'>
          <Upload
            accept='image/*'
            showUploadList={false}
            customRequest={handleCustomRequest}
            beforeUpload={beforeUpload}
            disabled={loading || !accessToken}
          >
            <Button icon={<UploadOutlined />} loading={loading}>
              Tải ảnh lên
            </Button>
          </Upload>
        </ImgCrop>
      </div>
    </Fragment>
  )
}
