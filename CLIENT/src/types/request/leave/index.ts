export enum LeaveType {
  ANNUAL = 'annual',
  SICK = 'sick',
  PERSONAL = 'personal',
  OTHER = 'other'
}

export enum DurationType {
  FULL_DAY = 'full_day',
  HALF_DAY_MORNING = 'half_day_morning',
  HALF_DAY_AFTERNOON = 'half_day_afternoon'
}

export enum LeaveRequestStatus {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
  CANCELLED = 4
}

export interface LeaveRequestType {
  _id: string
  request_code: string
  user: {
    _id: string
    name: string
    email: string
    phone?: string
    department?: {
      _id: string
      name: string
      code?: string
    }
  }
  leave_type: LeaveType
  duration_type: DurationType
  start_date: string
  end_date: string
  total_days: number
  reason: string
  status: LeaveRequestStatus
  approver?: {
    _id: string
    name: string
    email?: string
  }
  approved_at?: string
  rejected_at?: string
  cancelled_at?: string
  approval_note?: string
  rejection_reason?: string
  created_at: string
  updated_at: string
}

export interface CreateLeaveRequestDTO {
  leave_type: LeaveType
  duration_type: DurationType
  start_date: string
  end_date?: string
  reason: string
}

export interface ApproveLeaveRequestDTO {
  approval_note?: string
}

export interface RejectLeaveRequestDTO {
  rejection_reason: string
}

export interface LeaveRequestStatsType {
  total: number
  pending: number
  approved: number
  rejected: number
  cancelled: number
  totalDaysUsed: number
}

// Labels
export const LeaveTypeLabels: Record<LeaveType, string> = {
  [LeaveType.ANNUAL]: 'Nghỉ phép năm',
  [LeaveType.SICK]: 'Nghỉ ốm',
  [LeaveType.PERSONAL]: 'Nghỉ cá nhân',
  [LeaveType.OTHER]: 'Khác'
}

export const DurationTypeLabels: Record<DurationType, string> = {
  [DurationType.FULL_DAY]: '1 ngày',
  [DurationType.HALF_DAY_MORNING]: 'Nửa ngày sáng',
  [DurationType.HALF_DAY_AFTERNOON]: 'Nửa ngày chiều'
}

export const LeaveRequestStatusLabels: Record<LeaveRequestStatus, string> = {
  [LeaveRequestStatus.PENDING]: 'Chờ duyệt',
  [LeaveRequestStatus.APPROVED]: 'Đã duyệt',
  [LeaveRequestStatus.REJECTED]: 'Từ chối',
  [LeaveRequestStatus.CANCELLED]: 'Đã hủy'
}

export const LeaveRequestStatusColors: Record<LeaveRequestStatus, string> = {
  [LeaveRequestStatus.PENDING]: 'blue',
  [LeaveRequestStatus.APPROVED]: 'green',
  [LeaveRequestStatus.REJECTED]: 'red',
  [LeaveRequestStatus.CANCELLED]: 'default'
}
