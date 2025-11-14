import { Tag } from 'antd'
import {
  LeaveRequestStatus,
  LeaveRequestStatusLabels,
  LeaveRequestStatusColors
} from '#src/types/request/leave'

interface StatusBadgeProps {
  status: LeaveRequestStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = LeaveRequestStatusColors[status]
  const text = LeaveRequestStatusLabels[status]

  return <Tag color={color}>{text}</Tag>
}
