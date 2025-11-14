import { Modal, Descriptions } from 'antd'
import dayjs from 'dayjs'
import type { LeaveRequestType } from '#src/types/request/leave'
import {
  LeaveTypeLabels,
  DurationTypeLabels,
  LeaveRequestStatusLabels
} from '#src/types/request/leave'
import { StatusBadge } from './status-badge'

interface DetailModalProps {
  open: boolean
  data: LeaveRequestType | null
  onClose: () => void
}

export function DetailModal({ open, data, onClose }: DetailModalProps) {
  if (!data) return null

  return (
    <Modal
      title="Chi tiết đơn nghỉ phép"
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Mã đơn">{data.request_code}</Descriptions.Item>
        
        <Descriptions.Item label="Nhân viên">
          {data.user.name} ({data.user.email})
          {data.user.department && <div>Bộ phận: {data.user.department.name}</div>}
        </Descriptions.Item>

        <Descriptions.Item label="Loại nghỉ">
          {LeaveTypeLabels[data.leave_type]}
        </Descriptions.Item>

        <Descriptions.Item label="Thời gian nghỉ">
          {DurationTypeLabels[data.duration_type]}
        </Descriptions.Item>

        <Descriptions.Item label="Ngày bắt đầu">
          {dayjs(data.start_date).format('DD/MM/YYYY')}
        </Descriptions.Item>

        <Descriptions.Item label="Ngày kết thúc">
          {dayjs(data.end_date).format('DD/MM/YYYY')}
        </Descriptions.Item>

        <Descriptions.Item label="Tổng số ngày">
          {data.total_days} ngày
        </Descriptions.Item>

        <Descriptions.Item label="Lý do">
          {data.reason}
        </Descriptions.Item>

        <Descriptions.Item label="Trạng thái">
          <StatusBadge status={data.status} />
        </Descriptions.Item>

        {data.approver && (
          <Descriptions.Item label="Người duyệt">
            {data.approver.name}
          </Descriptions.Item>
        )}

        {data.approved_at && (
          <Descriptions.Item label="Ngày duyệt">
            {dayjs(data.approved_at).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
        )}

        {data.approval_note && (
          <Descriptions.Item label="Ghi chú duyệt">
            {data.approval_note}
          </Descriptions.Item>
        )}

        {data.rejected_at && (
          <Descriptions.Item label="Ngày từ chối">
            {dayjs(data.rejected_at).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
        )}

        {data.rejection_reason && (
          <Descriptions.Item label="Lý do từ chối">
            {data.rejection_reason}
          </Descriptions.Item>
        )}

        {data.cancelled_at && (
          <Descriptions.Item label="Ngày hủy">
            {dayjs(data.cancelled_at).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
        )}

        <Descriptions.Item label="Ngày nộp đơn">
          {dayjs(data.created_at).format('DD/MM/YYYY HH:mm')}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  )
}
