import LeaveRequest from '~/models/request/leave'
import { User } from '~/models'
import {
  CreateLeaveRequestRequestBody,
  GetLeaveRequestsFilters,
  ILeaveRequest
} from '~/interfaces/leave/leave.interface'
import { LeaveRequestStatus } from '~/constants/enum/leave/leave.enum'
import { Types } from 'mongoose'

class LeaveRequestRepository {
  /**
   * Tạo đơn nghỉ phép mới
   */
  async createLeaveRequest(data: CreateLeaveRequestRequestBody): Promise<ILeaveRequest> {
    const leaveRequest = new LeaveRequest({
      ...data,
      created_at: new Date(),
      updated_at: new Date()
    })
    return await leaveRequest.save()
  }

  /**
   * Lấy đơn nghỉ phép theo ID
   */
  async getLeaveRequestById(id: string): Promise<ILeaveRequest | null> {
    return await LeaveRequest.findById(id)
      .populate('user', 'name email phone department')
      .populate({
        path: 'user',
        populate: {
          path: 'department',
          select: 'name code'
        }
      })
      .populate('approver', 'name email')
  }

  /**
   * Lấy danh sách đơn nghỉ phép với filters
   */
  async getLeaveRequests(filters: GetLeaveRequestsFilters): Promise<ILeaveRequest[]> {
    const { user, status, leave_type, start_date, end_date, department, current = 1, pageSize = 10 } = filters

    const query: any = {}

    if (user) query.user = user
    if (status) query.status = status
    if (leave_type) query.leave_type = leave_type

    // Filter by date range
    if (start_date || end_date) {
      query.$or = []
      if (start_date && end_date) {
        query.$or.push({
          start_date: { $lte: new Date(end_date) },
          end_date: { $gte: new Date(start_date) }
        })
      } else if (start_date) {
        query.$or.push({ end_date: { $gte: new Date(start_date) } })
      } else if (end_date) {
        query.$or.push({ start_date: { $lte: new Date(end_date) } })
      }
    }

    const skip = (current - 1) * pageSize

    return await LeaveRequest.find(query)
      .populate('user', 'name email phone department')
      .populate({
        path: 'user',
        populate: {
          path: 'department',
          select: 'name code'
        }
      })
      .populate('approver', 'name email')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(pageSize)
  }

  /**
   * Lấy danh sách đơn chờ duyệt theo department (cho Manager)
   */
  async getPendingLeaveRequestsByDepartment(departmentId: string, filters: GetLeaveRequestsFilters) {
    const { current = 1, pageSize = 20 } = filters

    // Get all users in the department
    const usersInDepartment = await User.find({ department: departmentId }).select('_id')
    const userIds = usersInDepartment.map((u) => u._id)

    const query: any = {
      user: { $in: userIds },
      status: LeaveRequestStatus.PENDING
    }

    const skip = (current - 1) * pageSize

    return await LeaveRequest.find(query)
      .populate('user', 'name email phone department')
      .populate({
        path: 'user',
        populate: {
          path: 'department',
          select: 'name code'
        }
      })
      .sort({ created_at: 1 }) // FIFO - Cũ nhất trước
      .skip(skip)
      .limit(pageSize)
  }

  /**
   * Lấy tất cả đơn chờ duyệt (cho Admin)
   */
  async getAllPendingLeaveRequests(filters: GetLeaveRequestsFilters) {
    const { current = 1, pageSize = 20, leave_type, department } = filters

    const query: any = {
      status: LeaveRequestStatus.PENDING
    }

    if (leave_type) query.leave_type = leave_type

    const skip = (current - 1) * pageSize

    let leaveRequests = await LeaveRequest.find(query)
      .populate('user', 'name email phone department')
      .populate({
        path: 'user',
        populate: {
          path: 'department',
          select: 'name code'
        }
      })
      .sort({ created_at: 1 }) // FIFO - Cũ nhất trước
      .skip(skip)
      .limit(pageSize)

    // Filter by department if provided
    if (department) {
      leaveRequests = leaveRequests.filter((lr: any) => lr.user.department?._id?.toString() === department.toString())
    }

    return leaveRequests
  }

  /**
   * Đếm tổng số đơn nghỉ phép với filters
   */
  async countLeaveRequests(filters: GetLeaveRequestsFilters): Promise<number> {
    const { user, status, leave_type, start_date, end_date } = filters

    const query: any = {}

    if (user) query.user = user
    if (status) query.status = status
    if (leave_type) query.leave_type = leave_type

    if (start_date || end_date) {
      query.$or = []
      if (start_date && end_date) {
        query.$or.push({
          start_date: { $lte: new Date(end_date) },
          end_date: { $gte: new Date(start_date) }
        })
      } else if (start_date) {
        query.$or.push({ end_date: { $gte: new Date(start_date) } })
      } else if (end_date) {
        query.$or.push({ start_date: { $lte: new Date(end_date) } })
      }
    }

    return await LeaveRequest.countDocuments(query)
  }

  /**
   * Đếm số đơn pending của department
   */
  async countPendingByDepartment(departmentId: string): Promise<number> {
    const usersInDepartment = await User.find({ department: departmentId }).select('_id')
    const userIds = usersInDepartment.map((u) => u._id)

    return await LeaveRequest.countDocuments({
      user: { $in: userIds },
      status: LeaveRequestStatus.PENDING
    })
  }

  /**
   * Đếm tất cả đơn pending (Admin)
   */
  async countAllPending(): Promise<number> {
    return await LeaveRequest.countDocuments({ status: LeaveRequestStatus.PENDING })
  }

  /**
   * Cập nhật đơn nghỉ phép
   */
  async updateLeaveRequest(id: string, updateData: Partial<ILeaveRequest>): Promise<ILeaveRequest | null> {
    return await LeaveRequest.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updated_at: new Date()
      },
      { new: true }
    )
      .populate('user', 'name email phone department')
      .populate({
        path: 'user',
        populate: {
          path: 'department',
          select: 'name code'
        }
      })
      .populate('approver', 'name email')
  }

  /**
   * Xóa đơn nghỉ phép
   */
  async deleteLeaveRequest(id: string): Promise<ILeaveRequest | null> {
    return await LeaveRequest.findByIdAndDelete(id)
  }

  /**
   * Kiểm tra overlap với đơn đã approved
   */
  async checkOverlap(userId: string, startDate: Date, endDate: Date, excludeId?: string): Promise<boolean> {
    const query: any = {
      user: userId,
      status: LeaveRequestStatus.APPROVED,
      $or: [
        {
          start_date: { $lte: endDate },
          end_date: { $gte: startDate }
        }
      ]
    }

    if (excludeId) {
      query._id = { $ne: new Types.ObjectId(excludeId) }
    }

    const count = await LeaveRequest.countDocuments(query)
    return count > 0
  }

  /**
   * Lấy thống kê đơn nghỉ phép của user
   */
  async getLeaveRequestStats(userId: string) {
    const stats = await LeaveRequest.aggregate([
      {
        $match: { user: new Types.ObjectId(userId) }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalDays: { $sum: '$total_days' }
        }
      }
    ])

    const result = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      cancelled: 0,
      totalDaysUsed: 0
    }

    stats.forEach((stat) => {
      result.total += stat.count

      switch (stat._id) {
        case LeaveRequestStatus.PENDING:
          result.pending = stat.count
          break
        case LeaveRequestStatus.APPROVED:
          result.approved = stat.count
          result.totalDaysUsed = stat.totalDays
          break
        case LeaveRequestStatus.REJECTED:
          result.rejected = stat.count
          break
        case LeaveRequestStatus.CANCELLED:
          result.cancelled = stat.count
          break
      }
    })

    return result
  }

  /**
   * Lấy số lượng đơn theo ngày (để generate request code)
   */
  async countRequestsToday(): Promise<number> {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    return await LeaveRequest.countDocuments({
      created_at: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    })
  }
}

const leaveRequestRepository = new LeaveRequestRepository()
export default leaveRequestRepository
