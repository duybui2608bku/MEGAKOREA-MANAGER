import { Modal, Form, Input, message } from 'antd'
import { useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  fetchCreatePost,
  fetchUpdatePost,
  PostType,
  CreatePostRequestBody
} from '#src/api/workspace/facebookads/tools/page/index.js'

interface PostModalProps {
  title: string
  open: boolean
  onClose: () => void
  detailData: Partial<PostType>
  refreshTable: () => void
}

export const PostModal = ({ title, open, onClose, detailData, refreshTable }: PostModalProps) => {
  const [form] = Form.useForm()
  const isEdit = Boolean(detailData._id)

  const { mutate: createPostMutation, isPending: isCreating } = useMutation({
    mutationFn: fetchCreatePost,
    onSuccess: () => {
      message.success('Tạo bài viết thành công')
      onClose()
      refreshTable()
      form.resetFields()
    },
    onError: (error: any) => {
      message.error(error?.message || 'Tạo bài viết thất bại')
    }
  })

  const { mutate: updatePostMutation, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => fetchUpdatePost(id, data),
    onSuccess: () => {
      message.success('Cập nhật bài viết thành công')
      onClose()
      refreshTable()
      form.resetFields()
    },
    onError: (error: any) => {
      message.error(error?.message || 'Cập nhật bài viết thất bại')
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
        updatePostMutation({ id: detailData._id, data: values })
      } else {
        createPostMutation(values as CreatePostRequestBody)
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
      width={600}
      destroyOnClose
      okText={isEdit ? 'Cập nhật' : 'Tạo mới'}
      cancelText='Hủy'
    >
      <Form form={form} layout='vertical' preserve={false}>
        <Form.Item
          label='URL bài viết'
          name='url'
          rules={[
            { required: true, message: 'Vui lòng nhập URL bài viết' },
            { type: 'url', message: 'URL không hợp lệ' }
          ]}
        >
          <Input placeholder='https://facebook.com/post/...' />
        </Form.Item>

        <Form.Item label='Tên Page' name='page_name' rules={[{ required: true, message: 'Vui lòng nhập tên page' }]}>
          <Input placeholder='Nhập tên page' />
        </Form.Item>

        <Form.Item label='Page ID' name='page_id' rules={[{ required: true, message: 'Vui lòng nhập Page ID' }]}>
          <Input placeholder='Nhập Page ID' />
        </Form.Item>

        <Form.Item label='Dịch vụ' name='services' rules={[{ required: true, message: 'Vui lòng nhập dịch vụ' }]}>
          <Input placeholder='Nhập dịch vụ (VD: SEO, Content Marketing)' />
        </Form.Item>
      </Form>
    </Modal>
  )
}
