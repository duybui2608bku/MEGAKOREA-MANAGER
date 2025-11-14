import leaveRequestRepository from '~/repository/request/leave'
import { User } from '~/models'
import {
  CreateLeaveRequestRequestBody,
  GetLeaveRequestsFilters,
  ApproveLeaveRequestRequestBody,
  RejectLeaveRequestRequestBody
} from '~/interfaces/leave/leave.interface'
import { ErrorWithStatusCode } from '~/middlewares/error/error-response.middleware'
import { HttpStatusCode } from '~/constants/enum/http/http-status-code.enum'
import { LEAVE_REQUEST_MESSAGES } from '~/constants/messages/leave/leave.messages'
import { DurationType, LeaveRequestStatus } from '~/constants/enum/leave/leave.enum'
import { PermissionRoles } from '~/constants/enum/permision/permission.enum'

class LeaveRequestService {
  /**
   * Generate mã ¡n nghÉ phép (LR-YYYYMMDD-XXXX)
   */
  private async generateRequestCode(): Promise<string> {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')

    const datePrefix = `LR-${year}${month}${day}`

    // L¥y sÑ l°ãng ¡n ã t¡o hôm nay
    const count = await leaveRequestRepository.countRequestsToday()
    const sequence = String(count + 1).padStart(4, '0')

    return `${datePrefix}-${sequence}`
  }

  /**
   * Tính tÕng sÑ ngày nghÉ
   */
  private calculateTotalDays(startDate: Date, endDate: Date, durationType: DurationType): number {
    // N¿u là nía ngày
    if (durationType === DurationType.HALF_DAY_MORNING || durationType === DurationType.HALF_DAY_AFTERNOON) {
      return 0.5
    }

    // Tính sÑ ngày giïa startDate và endDate
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Reset time to midnight
    start.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)

    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // +1 to include both start and end date

    return diffDays
  }

  /**
   * Validate dates
   */
  private validateDates(startDate: Date, endDate: Date, isAdmin: boolean = false) {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Check if start_date is in the past (except for Admin)
    if (!isAdmin && start < today) {
      throw new ErrorWithStatusCode({
        message: LEAVE_REQUEST_MESSAGES.START_DATE_IN_PAST,
        statusCode: HttpStatusCode.BadRequest
      })
    }

    // Check if end_date >= start_date
    if (end < start) {
      throw new ErrorWithStatusCode({
        message: LEAVE_REQUEST_MESSAGES.END_DATE_BEFORE_START,
        statusCode: HttpStatusCode.BadRequest
      })
    }
  }

  /**
   * T¡o ¡n nghÉ phép mÛi
   */
  async createLeaveRequest(userId: string, data: CreateLeaveRequestRequestBody) {
    // Get user info to check if admin
    const user = await User.findById(userId).populate('roles')
    if (!user) {
      throw new ErrorWithStatusCode({
        message: 'Không tìm th¥y ng°Ýi dùng',
        statusCode: HttpStatusCode.NotFound
      })
    }

    const isAdmin = user.roles.some((role: any) => role.code === PermissionRoles.ADMIN)

    // Validate dates
    const startDate = new Date(data.start_date)
    const endDate = data.end_date ? new Date(data.end_date) : startDate

    this.validateDates(startDate, endDate, isAdmin)

    // Check overlap vÛi ¡n ã approved
    const hasOverlap = await leaveRequestRepository.checkOverlap(userId, startDate, endDate)
    if (hasOverlap) {
      throw new ErrorWithStatusCode({
        message: LEAVE_REQUEST_MESSAGES.LEAVE_REQUEST_OVERLAP,
        statusCode: HttpStatusCode.BadRequest
      })
    }

    // Generate request code
    const requestCode = await this.generateRequestCode()

    // Calculate total days
    const totalDays = this.calculateTotalDays(startDate, endDate, data.duration_type)

    // Create leave request
    const leaveRequest = await leaveRequestRepository.createLeaveRequest({
      ...data,
      user: userId,
      request_code: requestCode,
      start_date: startDate,
      end_date: endDate,
      total_days: totalDays,
      status: LeaveRequestStatus.PENDING
    })

    // Populate và return
    return await leaveRequestRepository.getLeaveRequestById(leaveRequest._id.toString())
  }

  /**
   * L¥y danh sách ¡n cça user hiÇn t¡i
   */
  async getMyLeaveRequests(userId: string, filters: GetLeaveRequestsFilters) {
    const leaveRequests = await leaveRequestRepository.getLeaveRequests({
      ...filters,
      user: userId
    })

    const total = await leaveRequestRepository.countLeaveRequests({
      ...filters,
      user: userId
    })

    return {
      list: leaveRequests,
      total,
      current: filters.current || 1
    }
  }

  /**
   * L¥y thÑng kê ¡n nghÉ phép cça user
   */
  async getMyLeaveRequestStats(userId: string) {
    return await leaveRequestRepository.getLeaveRequestStats(userId)
  }

  /**
   * L¥y danh sách ¡n chÝ duyÇt (cho Manager/Admin)
   */
  async getPendingLeaveRequests(approverId: string, filters: GetLeaveRequestsFilters) {
    // Get approver info
    const approver = await User.findById(approverId).populate('roles')
    if (!approver) {
      throw new ErrorWithStatusCode({
        message: 'Không tìm th¥y ng°Ýi dùng',
        statusCode: HttpStatusCode.NotFound
      })
    }

    // Check if admin
    const isAdmin = approver.roles.some((role: any) => role.code === PermissionRoles.ADMIN)

    let leaveRequests
    let total

    if (isAdmin) {
      // Admin xem t¥t c£ ¡n
      leaveRequests = await leaveRequestRepository.getAllPendingLeaveRequests(filters)
      total = await leaveRequestRepository.countAllPending()
    } else {
      // Manager chÉ xem ¡n cça bÙ ph­n mình
      if (!approver.department) {
        throw new ErrorWithStatusCode({
          message: 'B¡n ch°a °ãc phân vào bÙ ph­n nào',
          statusCode: HttpStatusCode.BadRequest
        })
      }

      leaveRequests = await leaveRequestRepository.getPendingLeaveRequestsByDepartment(
        approver.department.toString(),
        filters
      )
      total = await leaveRequestRepository.countPendingByDepartment(approver.department.toString())
    }

    return {
      list: leaveRequests,
      total,
      current: filters.current || 1
    }
  }

  /**
   * L¥y chi ti¿t ¡n nghÉ phép
   */
  async getLeaveRequestById(requestId: string, userId: string) {
    const leaveRequest = await leaveRequestRepository.getLeaveRequestById(requestId)

    if (!leaveRequest) {
      throw new ErrorWithStatusCode({
        message: LEAVE_REQUEST_MESSAGES.LEAVE_REQUEST_NOT_FOUND,
        statusCode: HttpStatusCode.NotFound
      })
    }

    // Get user info
    const user = await User.findById(userId).populate('roles')
    if (!user) {
      throw new ErrorWithStatusCode({
        message: 'Không tìm th¥y ng°Ýi dùng',
        statusCode: HttpStatusCode.NotFound
      })
    }

    const isAdmin = user.roles.some((role: any) => role.code === PermissionRoles.ADMIN)
    const isManager = user.roles.some((role: any) => role.code === PermissionRoles.MANAGER)
    const isOwner = (leaveRequest.user as any)._id.toString() === userId

    // Check permission: ChÉ chç ¡n, manager cùng dept, ho·c admin mÛi xem °ãc
    if (!isOwner && !isAdmin) {
      if (isManager) {
        // Manager ph£i cùng department
        const requestUser = await User.findById((leaveRequest.user as any)._id)
        if (requestUser?.department?.toString() !== user.department?.toString()) {
          throw new ErrorWithStatusCode({
            message: LEAVE_REQUEST_MESSAGES.NO_PERMISSION_TO_VIEW,
            statusCode: HttpStatusCode.Forbidden
          })
        }
      } else {
        throw new ErrorWithStatusCode({
          message: LEAVE_REQUEST_MESSAGES.NO_PERMISSION_TO_VIEW,
          statusCode: HttpStatusCode.Forbidden
        })
      }
    }

    return leaveRequest
  }

  /**
   * DuyÇt ¡n nghÉ phép
   */
  async approveLeaveRequest(requestId: string, approverId: string, data: ApproveLeaveRequestRequestBody) {
    // Get leave request
    const leaveRequest = await leaveRequestRepository.getLeaveRequestById(requestId)

    if (!leaveRequest) {
      throw new ErrorWithStatusCode({
        message: LEAVE_REQUEST_MESSAGES.LEAVE_REQUEST_NOT_FOUND,
        statusCode: HttpStatusCode.NotFound
      })
    }

    // Check status
    if (leaveRequest.status !== LeaveRequestStatus.PENDING) {
      throw new ErrorWithStatusCode({
        message: LEAVE_REQUEST_MESSAGES.LEAVE_REQUEST_NOT_PENDING,
        statusCode: HttpStatusCode.BadRequest
      })
    }

    // Get approver info
    const approver = await User.findById(approverId).populate('roles')
    if (!approver) {
      throw new ErrorWithStatusCode({
        message: 'Không tìm th¥y ng°Ýi dùng',
        statusCode: HttpStatusCode.NotFound
      })
    }

    const isAdmin = approver.roles.some((role: any) => role.code === PermissionRoles.ADMIN)

    // If not admin
    if (!isAdmin) {
      // Check same department
      const requestUser = await User.findById((leaveRequest.user as any)._id)

      if (!requestUser?.department || !approver.department) {
        throw new ErrorWithStatusCode({
          message: 'Ng°Ýi dùng ch°a °ãc phân vào bÙ ph­n',
          statusCode: HttpStatusCode.BadRequest
        })
      }

      if (requestUser.department.toString() !== approver.department.toString()) {
        throw new ErrorWithStatusCode({
          message: LEAVE_REQUEST_MESSAGES.CANNOT_APPROVE_DIFFERENT_DEPARTMENT,
          statusCode: HttpStatusCode.Forbidden
        })
      }

      // Cannot approve own request
      if ((leaveRequest.user as any)._id.toString() === approverId) {
        throw new ErrorWithStatusCode({
          message: LEAVE_REQUEST_MESSAGES.CANNOT_APPROVE_OWN_REQUEST,
          statusCode: HttpStatusCode.Forbidden
        })
      }
    }

    // Update leave request
    const updatedRequest = await leaveRequestRepository.updateLeaveRequest(requestId, {
      status: LeaveRequestStatus.APPROVED,
      approver: approverId,
      approved_at: new Date(),
      approval_note: data.approval_note || null
    } as any)

    return updatedRequest
  }

  /**
   * Të chÑi ¡n nghÉ phép
   */
  async rejectLeaveRequest(requestId: string, approverId: string, data: RejectLeaveRequestRequestBody) {
    // Get leave request
    const leaveRequest = await leaveRequestRepository.getLeaveRequestById(requestId)

    if (!leaveRequest) {
      throw new ErrorWithStatusCode({
        message: LEAVE_REQUEST_MESSAGES.LEAVE_REQUEST_NOT_FOUND,
        statusCode: HttpStatusCode.NotFound
      })
    }

    // Check status
    if (leaveRequest.status !== LeaveRequestStatus.PENDING) {
      throw new ErrorWithStatusCode({
        message: LEAVE_REQUEST_MESSAGES.LEAVE_REQUEST_NOT_PENDING,
        statusCode: HttpStatusCode.BadRequest
      })
    }

    // Get approver info
    const approver = await User.findById(approverId).populate('roles')
    if (!approver) {
      throw new ErrorWithStatusCode({
        message: 'Không tìm th¥y ng°Ýi dùng',
        statusCode: HttpStatusCode.NotFound
      })
    }

    const isAdmin = approver.roles.some((role: any) => role.code === PermissionRoles.ADMIN)

    // If not admin, check same department
    if (!isAdmin) {
      const requestUser = await User.findById((leaveRequest.user as any)._id)

      if (!requestUser?.department || !approver.department) {
        throw new ErrorWithStatusCode({
          message: 'Ng°Ýi dùng ch°a °ãc phân vào bÙ ph­n',
          statusCode: HttpStatusCode.BadRequest
        })
      }

      if (requestUser.department.toString() !== approver.department.toString()) {
        throw new ErrorWithStatusCode({
          message: LEAVE_REQUEST_MESSAGES.CANNOT_APPROVE_DIFFERENT_DEPARTMENT,
          statusCode: HttpStatusCode.Forbidden
        })
      }
    }

    // Update leave request
    const updatedRequest = await leaveRequestRepository.updateLeaveRequest(requestId, {
      status: LeaveRequestStatus.REJECTED,
      approver: approverId,
      rejected_at: new Date(),
      rejection_reason: data.rejection_reason
    } as any)

    return updatedRequest
  }

  /**
   * Hçy ¡n nghÉ phép
   */
  async cancelLeaveRequest(requestId: string, userId: string) {
    // Get leave request
    const leaveRequest = await leaveRequestRepository.getLeaveRequestById(requestId)

    if (!leaveRequest) {
      throw new ErrorWithStatusCode({
        message: LEAVE_REQUEST_MESSAGES.LEAVE_REQUEST_NOT_FOUND,
        statusCode: HttpStatusCode.NotFound
      })
    }

    // Check ownership
    if ((leaveRequest.user as any)._id.toString() !== userId) {
      throw new ErrorWithStatusCode({
        message: LEAVE_REQUEST_MESSAGES.NOT_LEAVE_REQUEST_OWNER,
        statusCode: HttpStatusCode.Forbidden
      })
    }

    // Check status - chÉ hçy °ãc ¡n PENDING
    if (leaveRequest.status !== LeaveRequestStatus.PENDING) {
      throw new ErrorWithStatusCode({
        message: LEAVE_REQUEST_MESSAGES.CANNOT_CANCEL_PROCESSED_REQUEST,
        statusCode: HttpStatusCode.BadRequest
      })
    }

    // Update leave request
    const updatedRequest = await leaveRequestRepository.updateLeaveRequest(requestId, {
      status: LeaveRequestStatus.CANCELLED,
      cancelled_at: new Date()
    } as any)

    return updatedRequest
  }
}

const leaveRequestService = new LeaveRequestService()
export default leaveRequestService
