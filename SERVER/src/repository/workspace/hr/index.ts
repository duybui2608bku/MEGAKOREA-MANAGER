import { GetAllEmployeesQuery, UpdateEmployeeProfileRequestBody } from '~/interfaces/workspace/hr'
import { User } from '~/models'
import { POPULATE_USER, PROTECTED_USER } from './config'
import { generatePagination } from '~/utils/pagination/pagination.util'

class HrRepository {
  private async getTotalEmployeesCount(filter: any) {
    return await User.countDocuments(filter)
  }

  async updateEmployeeProfile(updateEmployeeProfileData: UpdateEmployeeProfileRequestBody) {
    return await User.findByIdAndUpdate(updateEmployeeProfileData._id, updateEmployeeProfileData, {
      new: true
    })
  }

  async getAllEmployees(query: GetAllEmployeesQuery) {
    const { current, pageSize, search, department, roles, status } = query

    const { skip, limit, page } = generatePagination(current, pageSize)

    const filter: any = {}
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ]
    }

    if (department) {
      filter.department = department
    }

    if (roles) {
      filter.roles = roles
    }

    if (status) {
      filter.status = parseInt(status)
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .populate(POPULATE_USER.role.key, POPULATE_USER.role.value)
        .populate(POPULATE_USER.department.key, POPULATE_USER.department.value)
        .select(PROTECTED_USER)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit),
      this.getTotalEmployeesCount(filter)
    ])

    return {
      list: users,
      total,
      current: page
    }
  }

  async getTotalUsersCount(query: any) {
    const { search, department, status } = query
    const filter: any = {}
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ]
    }

    if (department) {
      filter.derpartment = department
    }

    if (status) {
      filter.status = parseInt(status)
    }
    return await User.countDocuments(filter)
  }

  async getUserById(userId: string) {
    return await User.findById(userId)
      .populate(POPULATE_USER.role.key, POPULATE_USER.role.value)
      .populate(POPULATE_USER.department.key, POPULATE_USER.department.value)
      .select(PROTECTED_USER)
  }

  async updateUserStatus(userId: string, status: number) {
    return await User.findByIdAndUpdate(userId, { status, updated_at: new Date() }, { new: true })
      .populate(POPULATE_USER.role.key, POPULATE_USER.role.value)
      .populate(POPULATE_USER.department.key, POPULATE_USER.department.value)
      .select(PROTECTED_USER)
  }

  async assignUserRole(userId: string, roleIds: string[]) {
    return await User.findByIdAndUpdate(userId, { roles: roleIds, updated_at: new Date() }, { new: true })
      .populate(POPULATE_USER.role.key, POPULATE_USER.role.value)
      .populate(POPULATE_USER.department.key, POPULATE_USER.department.value)
      .select(PROTECTED_USER)
  }

  async assignUserDepartment(userId: string, departmentId: string) {
    return await User.findByIdAndUpdate(userId, { derpartment: departmentId, updated_at: new Date() }, { new: true })
      .populate(POPULATE_USER.role.key, POPULATE_USER.role.value)
      .populate(POPULATE_USER.department.key, POPULATE_USER.department.value)
      .select(PROTECTED_USER)
  }

  async deleteUser(userId: string) {
    return await User.findByIdAndDelete(userId)
  }
}

const hrRepository = new HrRepository()
export default hrRepository
