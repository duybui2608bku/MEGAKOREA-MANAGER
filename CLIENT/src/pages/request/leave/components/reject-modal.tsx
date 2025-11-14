import { Modal, Form, Input, message } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { rejectLeaveRequest } from '#src/api/request/leave'
import type { RejectLeaveRequestDTO } from '#src/types/request/leave'

interface RejectModalProps {
  open: boolean
  requestId: string
  requestCode: string
  onClose: () => void
  onSuccess: () => void
}

export function RejectModal({ open, requestId, requestCode, onClose, onSuccess }: RejectModalProps) {
  const [form] = Form.useForm()

  const { mutate, isPending } = useMutation({
    mutationFn: (data: RejectLeaveRequestDTO) => rejectLeaveRequest(requestId, data),
    onSuccess: () => {
      message.success('Từ chối đơn thành công')
      form.resetFields()
      onClose()
      onSuccess()
    },
    onError: (error: any) => {
      message.error(`Từ chối đơn thất bại: ${error.message}`)
    }
  })

  const handleOk = () => {
    form.validateFields().then((values) => {
      mutate(values)
    })
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      title="Từ chối đơn nghỉ phép"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isPending}
      okText="Xác nhận từ chối"
      cancelText="Hủy"
      okButtonProps={{ danger: true }}
      width={500}
    >
      <div style={{ marginBottom: 16 }}>
        <strong>Mã đơn:</strong> {requestCode}
      </div>
      <Form form={form} layout="vertical">
        <Form.Item
          name="rejection_reason"
          label="Lý do từ chối"
          rules={[
            { required: true, message: 'Vui lòng nhập lý do từ chối' },
            { min: 10, message: 'Lý do phải có ít nhất 10 ký tự' }
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Nhập lý do từ chối..."
            maxLength={500}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
