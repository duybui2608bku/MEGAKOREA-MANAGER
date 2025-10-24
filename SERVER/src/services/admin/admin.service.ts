import {
  UpdateProfileByAdminRequestBody,
  GetAllUsersQuery,
  UpdateUserStatusRequestBody,
  AssignUserRoleRequestBody,
  AssignUserDepartmentRequestBody
} from '~/interfaces/admin/admin-actions-user.interface'
import { hashPassword } from '~/jwt/crypro'
import adminRepository from '~/repository/admin/admin.repository'
import { ErrorWithStatusCode } from '~/middlewares/error/error-response.middleware'
import { HttpStatusCode } from '~/constants/enum/http/http-status-code.enum'
import { userMessages } from '~/constants/messages/user/user.messages'

class AdminService {
  async updateProfileByAdmin(updateProfileByAdminData: UpdateProfileByAdminRequestBody) {
    const isUpdatePassword = updateProfileByAdminData.password && updateProfileByAdminData.password.trim() !== ''
    if (isUpdatePassword) {
      const hashedPassword = hashPassword(updateProfileByAdminData.password as string)
      updateProfileByAdminData.password = hashedPassword
    }

    const updatedUser = await adminRepository.updateProfileByAdmin(updateProfileByAdminData)
    return updatedUser
  }

  async getAllUsers(query: GetAllUsersQuery) {
    const users = await adminRepository.getAllUsers(query)
    const totalUsers = await adminRepository.getTotalUsersCount(query)

    return {
      users,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: totalUsers,
        totalPages: Math.ceil(totalUsers / query.limit)
      }
    }
  }

  async getUserById(userId: string) {
    const user = await adminRepository.getUserById(userId)
    if (!user) {
      throw new ErrorWithStatusCode({
        message: userMessages.USER_NOT_FOUND,
        statusCode: HttpStatusCode.NotFound
      })
    }
    return user
  }

  async updateUserStatus(userId: string, statusData: UpdateUserStatusRequestBody) {
    const user = await adminRepository.getUserById(userId)
    if (!user) {
      throw new ErrorWithStatusCode({
        message: userMessages.USER_NOT_FOUND,
        statusCode: HttpStatusCode.NotFound
      })
    }

    const updatedUser = await adminRepository.updateUserStatus(userId, statusData.status)
    return updatedUser
  }

  async assignUserRole(userId: string, roleData: AssignUserRoleRequestBody) {
    const user = await adminRepository.getUserById(userId)
    if (!user) {
      throw new ErrorWithStatusCode({
        message: userMessages.USER_NOT_FOUND,
        statusCode: HttpStatusCode.NotFound
      })
    }

    const updatedUser = await adminRepository.assignUserRole(userId, roleData.roleIds)
    return updatedUser
  }

  async assignUserDepartment(userId: string, departmentData: AssignUserDepartmentRequestBody) {
    const user = await adminRepository.getUserById(userId)
    if (!user) {
      throw new ErrorWithStatusCode({
        message: userMessages.USER_NOT_FOUND,
        statusCode: HttpStatusCode.NotFound
      })
    }

    const updatedUser = await adminRepository.assignUserDepartment(userId, departmentData.departmentId)
    return updatedUser
  }

  async deleteUser(userId: string) {
    const user = await adminRepository.getUserById(userId)
    if (!user) {
      throw new ErrorWithStatusCode({
        message: userMessages.USER_NOT_FOUND,
        statusCode: HttpStatusCode.NotFound
      })
    }

    await adminRepository.deleteUser(userId)
    return { message: 'User deleted successfully' }
  }
}

const adminServices = new AdminService()
export default adminServices
