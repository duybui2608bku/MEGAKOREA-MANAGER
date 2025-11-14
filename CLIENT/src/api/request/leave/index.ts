import { request } from '#src/utils'
import { LEAVE_REQUEST_PATH } from '#src/constants/api/leave'
import type {
  LeaveRequestType,
  CreateLeaveRequestDTO,
  ApproveLeaveRequestDTO,
  RejectLeaveRequestDTO,
  LeaveRequestStatsType
} from '#src/types/request/leave'

// Tạo đơn nghỉ phép
export function createLeaveRequest(data: CreateLeaveRequestDTO) {
  return request
    .post<ApiResponse<LeaveRequestType>>(LEAVE_REQUEST_PATH.CREATE, {
      json: data,
      ignoreLoading: false
    })
    .json()
}

// Lấy danh sách đơn của tôi
export function fetchMyLeaveRequests(params: any) {
  return request
    .get<ApiListResponse<LeaveRequestType>>(LEAVE_REQUEST_PATH.MY_REQUESTS, {
      searchParams: params,
      ignoreLoading: true
    })
    .json()
}

// Lấy thống kê đơn của tôi
export function fetchMyLeaveStats() {
  return request
    .get<ApiResponse<LeaveRequestStatsType>>(LEAVE_REQUEST_PATH.MY_STATS, {
      ignoreLoading: true
    })
    .json()
}

// Lấy chi tiết đơn
export function fetchLeaveRequestById(id: string) {
  return request
    .get<ApiResponse<LeaveRequestType>>(`${LEAVE_REQUEST_PATH.GET_BY_ID}/${id}`, {
      ignoreLoading: true
    })
    .json()
}

// Hủy đơn
export function cancelLeaveRequest(id: string) {
  return request
    .patch<ApiResponse<LeaveRequestType>>(`${LEAVE_REQUEST_PATH.CANCEL}/${id}`, {
      ignoreLoading: false
    })
    .json()
}

// Lấy danh sách đơn chờ duyệt (Manager/Admin)
export function fetchPendingLeaveRequests(params: any) {
  return request
    .get<ApiListResponse<LeaveRequestType>>(LEAVE_REQUEST_PATH.PENDING_LIST, {
      searchParams: params,
      ignoreLoading: true
    })
    .json()
}

// Duyệt đơn
export function approveLeaveRequest(id: string, data: ApproveLeaveRequestDTO) {
  return request
    .patch<ApiResponse<LeaveRequestType>>(`${LEAVE_REQUEST_PATH.APPROVE}/${id}`, {
      json: data,
      ignoreLoading: false
    })
    .json()
}

// Từ chối đơn
export function rejectLeaveRequest(id: string, data: RejectLeaveRequestDTO) {
  return request
    .patch<ApiResponse<LeaveRequestType>>(`${LEAVE_REQUEST_PATH.REJECT}/${id}`, {
      json: data,
      ignoreLoading: false
    })
    .json()
}
