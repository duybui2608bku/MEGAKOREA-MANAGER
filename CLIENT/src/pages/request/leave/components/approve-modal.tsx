import { Modal, Form, Input, message } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { approveLeaveRequest } from '#src/api/request/leave'
import type { ApproveLeaveRequestDTO } from '#src/types/request/leave'

interface ApproveModalProps {
  open: boolean
  requestId: string
  requestCode: string
  onClose: () => void
  onSuccess: () => void
}

export function ApproveModal({ open, requestId, requestCode, onClose, onSuccess }: ApproveModalProps) {
  const [form] = Form.useForm()

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ApproveLeaveRequestDTO) => approveLeaveRequest(requestId, data),
    onSuccess: () => {
      message.success('Duyệt đơn thành công')
      form.resetFields()
      onClose()
      onSuccess()
    },
    onError: (error: any) => {
      message.error(`Duyệt đơn thất bại: ${error.message}`)
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
      title="Duyệt đơn nghỉ phép"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isPending}
      okText="Xác nhận duyệt"
      cancelText="Hủy"
      width={500}
    >
      <div style={{ marginBottom: 16 }}>
        <strong>Mã đơn:</strong> {requestCode}
      </div>
      <Form form={form} layout="vertical">
        <Form.Item name="approval_note" label="Ghi chú (tùy chọn)">
          <Input.TextArea
            rows={4}
            placeholder="Nhập ghi chú nếu cần..."
            maxLength={500}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
