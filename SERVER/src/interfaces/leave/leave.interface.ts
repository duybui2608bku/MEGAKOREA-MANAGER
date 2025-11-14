import { Types } from 'mongoose'
import { DurationType, LeaveRequestStatus, LeaveType } from '~/constants/enum/leave/leave.enum'

// Interface for leave request document
export interface ILeaveRequest {
  _id: Types.ObjectId
  request_code: string
  user: Types.ObjectId
  leave_type: LeaveType
  duration_type: DurationType
  start_date: Date
  end_date: Date
  total_days: number
  reason: string
  status: LeaveRequestStatus
  approver?: Types.ObjectId | null
  approved_at?: Date | null
  rejected_at?: Date | null
  cancelled_at?: Date | null
  approval_note?: string | null
  rejection_reason?: string | null
  created_at: Date
  updated_at: Date
}

// DTO for creating leave request
export interface CreateLeaveRequestDTO {
  leave_type: LeaveType
  duration_type: DurationType
  start_date: Date | string
  end_date?: Date | string
  reason: string
}

// Request body for creating leave request
export interface CreateLeaveRequestRequestBody extends CreateLeaveRequestDTO {
  user?: Types.ObjectId | string
}

// DTO for approving leave request
export interface ApproveLeaveRequestDTO {
  approval_note?: string
}

// Request body for approving leave request
export interface ApproveLeaveRequestRequestBody extends ApproveLeaveRequestDTO {
  approver?: Types.ObjectId | string
}

// DTO for rejecting leave request
export interface RejectLeaveRequestDTO {
  rejection_reason: string
}

// Request body for rejecting leave request
export interface RejectLeaveRequestRequestBody extends RejectLeaveRequestDTO {
  approver?: Types.ObjectId | string
}

// Query filters for getting leave requests
export interface GetLeaveRequestsFilters {
  user?: Types.ObjectId | string
  status?: LeaveRequestStatus
  leave_type?: LeaveType
  start_date?: Date | string
  end_date?: Date | string
  department?: Types.ObjectId | string
  current?: number
  pageSize?: number
}

// Response for leave request list
export interface LeaveRequestListResponse {
  list: ILeaveRequest[]
  total: number
  current: number
}

// Stats response
export interface LeaveRequestStatsResponse {
  total: number
  pending: number
  approved: number
  rejected: number
  cancelled: number
  totalDaysUsed: number
}
