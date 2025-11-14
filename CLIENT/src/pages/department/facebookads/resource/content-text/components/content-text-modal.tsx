import { Modal, Form, Input, message, Select } from 'antd'
import { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  fetchCreateContentText,
  fetchUpdateContentText,
  ContentTextType,
  CreateContentTextRequestBody
} from '#src/api/workspace/facebookads/resource/content-text/index.js'
import { serviceMegaMainOptions } from '#src/constants/option/index.js'

const { TextArea } = Input

interface ContentTextModalProps {
  title: string
  open: boolean
  onClose: () => void
  detailData: Partial<ContentTextType>
  refreshTable: () => void
}

export const ContentTextModal = ({ title, open, onClose, detailData, refreshTable }: ContentTextModalProps) => {
  const [form] = Form.useForm()
  const isEdit = Boolean(detailData._id)

  const { mutate: createContentTextMutation, isPending: isCreating } = useMutation({
    mutationFn: fetchCreateContentText,
    onSuccess: () => {
      message.success('Tạo nội dung text thành công')
      onClose()
      refreshTable()
      form.resetFields()
    },
    onError: (error: any) => {
      message.error(error?.message || 'Tạo nội dung text thất bại')
    }
  })

  const { mutate: updateContentTextMutation, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => fetchUpdateContentText(id, data),
    onSuccess: () => {
      message.success('Cập nhật nội dung text thành công')
      onClose()
      refreshTable()
      form.resetFields()
    },
    onError: (error: any) => {
      message.error(error?.message || 'Cập nhật nội dung text thất bại')
    }
  })

  useEffect(() => {
    if (open && detailData) {
      form.setFieldsValue(detailData)
    } else {
      form.resetFields()
    }
  }, [open, detailData, form])

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      if (isEdit && detailData._id) {
        updateContentTextMutation({ id: detailData._id, data: values })
      } else {
        createContentTextMutation(values as CreateContentTextRequestBody)
      }
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title={title}
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={isCreating || isUpdating}
      width={700}
      destroyOnClose
      okText={isEdit ? 'Cập nhật' : 'Tạo mới'}
      cancelText='Hủy'
    >
      <Form form={form} layout='vertical' preserve={false}>
        <Form.Item label='Nội dung' name='content' rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
          <TextArea placeholder='Nhập nội dung văn bản quảng cáo...' rows={8} showCount maxLength={5000} />
        </Form.Item>

        <Form.Item label='Danh mục' name='category' rules={[{ required: true, message: 'Vui lòng nhập danh mục' }]}>
          <Input placeholder='Nhập danh mục (VD: Quảng cáo Facebook, Content Marketing)' />
        </Form.Item>

        <Form.Item label='Chi nhánh' name='branch' rules={[{ required: true, message: 'Vui lòng nhập chi nhánh' }]}>
          <Input placeholder='Nhập chi nhánh (VD: Hà Nội, TP.HCM, Đà Nẵng)' />
        </Form.Item>

        <Form.Item label='Dịch vụ' name='services' rules={[{ required: true, message: 'Vui lòng chọn dịch vụ' }]}>
          <Select
            placeholder='Chọn dịch vụ'
            options={serviceMegaMainOptions}
            showSearch
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
