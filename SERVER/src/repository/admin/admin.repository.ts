import { UpdateProfileByAdminRequestBody } from '~/interfaces/admin/admin-actions-user.interface'
import { User } from '~/models'

class AdminRepository {
  async updateProfileByAdmin(updateProfileByAdminData: UpdateProfileByAdminRequestBody) {
    const updatedUser = await User.findByIdAndUpdate(updateProfileByAdminData.user_id, updateProfileByAdminData, {
      new: true
    })
    return updatedUser
  }
}

const adminRepository = new AdminRepository()
export default adminRepository
