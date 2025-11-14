// Loại nghỉ phép
export enum LeaveType {
  ANNUAL = 'annual', // Nghỉ phép năm
  SICK = 'sick', // Nghỉ ốm
  PERSONAL = 'personal', // Nghỉ cá nhân
  OTHER = 'other' // Khác
}

// Loại thời gian nghỉ
export enum DurationType {
  FULL_DAY = 'full_day', // 1 ngày
  HALF_DAY_MORNING = 'half_day_morning', // Nửa ngày sáng
  HALF_DAY_AFTERNOON = 'half_day_afternoon' // Nửa ngày chiều
}

// Trạng thái đơn
export enum LeaveRequestStatus {
  PENDING = 1, // Chờ duyệt
  APPROVED = 2, // Đã duyệt
  REJECTED = 3, // Từ chối
  CANCELLED = 4 // Đã hủy
}

// Labels hiển thị cho loại nghỉ
export const LeaveTypeLabels: Record<LeaveType, string> = {
  [LeaveType.ANNUAL]: 'Nghỉ phép năm',
  [LeaveType.SICK]: 'Nghỉ ốm',
  [LeaveType.PERSONAL]: 'Nghỉ cá nhân',
  [LeaveType.OTHER]: 'Khác'
}

// Labels hiển thị cho loại thời gian
export const DurationTypeLabels: Record<DurationType, string> = {
  [DurationType.FULL_DAY]: '1 ngày',
  [DurationType.HALF_DAY_MORNING]: 'Nửa ngày sáng',
  [DurationType.HALF_DAY_AFTERNOON]: 'Nửa ngày chiều'
}

// Labels hiển thị cho trạng thái
export const LeaveRequestStatusLabels: Record<number, string> = {
  [LeaveRequestStatus.PENDING]: 'Chờ duyệt',
  [LeaveRequestStatus.APPROVED]: 'Đã duyệt',
  [LeaveRequestStatus.REJECTED]: 'Từ chối',
  [LeaveRequestStatus.CANCELLED]: 'Đã hủy'
}

// Permission codes
export enum LeavePermissionCodes {
  CREATE = 'leave:request:create',
  VIEW_OWN = 'leave:request:view_own',
  CANCEL = 'leave:request:cancel',
  VIEW_PENDING = 'leave:request:view_pending',
  APPROVE = 'leave:request:approve',
  REJECT = 'leave:request:reject',
  VIEW_ALL = 'leave:request:view_all',
  DELETE = 'leave:request:delete'
}
