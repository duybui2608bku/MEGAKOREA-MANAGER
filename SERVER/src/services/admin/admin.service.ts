import { UpdateProfileByAdminRequestBody } from '~/interfaces/admin/admin-actions-user.interface'
import { hashPassword } from '~/jwt/crypro'
import adminRepository from '~/repository/admin/admin.repository'

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
}

const adminServices = new AdminService()
export default adminServices
