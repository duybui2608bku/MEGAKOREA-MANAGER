import { UpdateProfileByAdminRequestBody, GetAllUsersQuery } from '~/interfaces/admin/admin-actions-user.interface'
import { User } from '~/models'

class AdminRepository {
  async updateProfileByAdmin(updateProfileByAdminData: UpdateProfileByAdminRequestBody) {
    const updatedUser = await User.findByIdAndUpdate(updateProfileByAdminData.user_id, updateProfileByAdminData, {
      new: true
    })
    return updatedUser
  }

  async getAllUsers(query: GetAllUsersQuery) {
    const { page, limit, search, department, status } = query
    const skip = (page - 1) * limit
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

    const users = await User.find(filter)
      .populate('roles', 'name code')
      .populate('derpartment', 'name')
      .select('-password')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)

    return users
  }

  async getTotalUsersCount(query: GetAllUsersQuery) {
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
      .populate('roles', 'name code')
      .populate('derpartment', 'name')
      .select('-password')
  }

  async updateUserStatus(userId: string, status: number) {
    return await User.findByIdAndUpdate(userId, { status, updated_at: new Date() }, { new: true })
      .populate('roles', 'name code')
      .populate('derpartment', 'name')
      .select('-password')
  }

  async assignUserRole(userId: string, roleIds: string[]) {
    return await User.findByIdAndUpdate(userId, { roles: roleIds, updated_at: new Date() }, { new: true })
      .populate('roles', 'name code')
      .populate('derpartment', 'name')
      .select('-password')
  }

  async assignUserDepartment(userId: string, departmentId: string) {
    return await User.findByIdAndUpdate(userId, { derpartment: departmentId, updated_at: new Date() }, { new: true })
      .populate('roles', 'name code')
      .populate('derpartment', 'name')
      .select('-password')
  }

  async deleteUser(userId: string) {
    return await User.findByIdAndDelete(userId)
  }
}

const adminRepository = new AdminRepository()
export default adminRepository
