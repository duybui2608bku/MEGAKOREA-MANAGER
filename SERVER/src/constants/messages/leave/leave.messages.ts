export const LEAVE_REQUEST_MESSAGES = {
  // Success messages
  CREATE_SUCCESS: 'Tạo đơn nghỉ phép thành công',
  GET_SUCCESS: 'Lấy thông tin đơn nghỉ phép thành công',
  GET_LIST_SUCCESS: 'Lấy danh sách đơn nghỉ phép thành công',
  GET_STATS_SUCCESS: 'Lấy thống kê đơn nghỉ phép thành công',
  APPROVE_SUCCESS: 'Duyệt đơn nghỉ phép thành công',
  REJECT_SUCCESS: 'Từ chối đơn nghỉ phép thành công',
  CANCEL_SUCCESS: 'Hủy đơn nghỉ phép thành công',
  UPDATE_SUCCESS: 'Cập nhật đơn nghỉ phép thành công',
  DELETE_SUCCESS: 'Xóa đơn nghỉ phép thành công',

  // Error messages - Validation
  LEAVE_TYPE_REQUIRED: 'Loại nghỉ là bắt buộc',
  LEAVE_TYPE_INVALID: 'Loại nghỉ không hợp lệ',
  DURATION_TYPE_REQUIRED: 'Loại thời gian nghỉ là bắt buộc',
  DURATION_TYPE_INVALID: 'Loại thời gian nghỉ không hợp lệ',
  START_DATE_REQUIRED: 'Ngày bắt đầu nghỉ là bắt buộc',
  START_DATE_INVALID: 'Ngày bắt đầu nghỉ không hợp lệ',
  START_DATE_IN_PAST: 'Ngày bắt đầu nghỉ không được là ngày quá khứ',
  END_DATE_INVALID: 'Ngày kết thúc nghỉ không hợp lệ',
  END_DATE_BEFORE_START: 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
  REASON_REQUIRED: 'Lý do nghỉ là bắt buộc',
  REASON_TOO_SHORT: 'Lý do nghỉ phải có ít nhất 10 ký tự',
  REJECTION_REASON_REQUIRED: 'Lý do từ chối là bắt buộc',
  REJECTION_REASON_TOO_SHORT: 'Lý do từ chối phải có ít nhất 10 ký tự',

  // Error messages - Business logic
  LEAVE_REQUEST_NOT_FOUND: 'Không tìm thấy đơn nghỉ phép',
  LEAVE_REQUEST_OVERLAP: 'Đã có đơn nghỉ phép được duyệt trong khoảng thời gian này',
  LEAVE_REQUEST_ALREADY_PROCESSED: 'Đơn nghỉ phép đã được xử lý',
  LEAVE_REQUEST_NOT_PENDING: 'Đơn nghỉ phép không ở trạng thái chờ duyệt',
  LEAVE_REQUEST_ALREADY_APPROVED: 'Đơn nghỉ phép đã được duyệt',
  LEAVE_REQUEST_ALREADY_REJECTED: 'Đơn nghỉ phép đã bị từ chối',
  LEAVE_REQUEST_ALREADY_CANCELLED: 'Đơn nghỉ phép đã bị hủy',

  // Error messages - Authorization
  NOT_LEAVE_REQUEST_OWNER: 'Bạn không phải chủ đơn nghỉ phép này',
  CANNOT_APPROVE_OWN_REQUEST: 'Bạn không thể tự duyệt đơn nghỉ phép của mình',
  CANNOT_APPROVE_DIFFERENT_DEPARTMENT:
    'Bạn chỉ có thể duyệt đơn nghỉ phép của nhân viên trong bộ phận của mình',
  CANNOT_CANCEL_PROCESSED_REQUEST: 'Không thể hủy đơn nghỉ phép đã được xử lý',
  NO_PERMISSION_TO_APPROVE: 'Bạn không có quyền duyệt đơn nghỉ phép',
  NO_PERMISSION_TO_REJECT: 'Bạn không có quyền từ chối đơn nghỉ phép',
  NO_PERMISSION_TO_VIEW: 'Bạn không có quyền xem đơn nghỉ phép này',

  // Error messages - System
  GENERATE_REQUEST_CODE_ERROR: 'Lỗi khi tạo mã đơn nghỉ phép',
  CALCULATE_TOTAL_DAYS_ERROR: 'Lỗi khi tính tổng số ngày nghỉ',
  CREATE_ERROR: 'Lỗi khi tạo đơn nghỉ phép',
  UPDATE_ERROR: 'Lỗi khi cập nhật đơn nghỉ phép',
  DELETE_ERROR: 'Lỗi khi xóa đơn nghỉ phép',
  GET_ERROR: 'Lỗi khi lấy thông tin đơn nghỉ phép',
  GET_LIST_ERROR: 'Lỗi khi lấy danh sách đơn nghỉ phép'
}
