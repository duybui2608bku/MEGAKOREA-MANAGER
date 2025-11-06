import { COLLECTION_NAME } from '~/constants/collecttions/name.collecttions'
import { RegisterRequestBody, UpdateMyProfileRequestBody } from '~/interfaces/user/users.interface'
import { hashPassword } from '~/jwt/crypro'
import User from '~/models/user/user.model'
import { protectedRoles } from '~/utils/protected/permission.protected.util'
import { protectedDerpartment, protectedUser } from '~/utils/protected/user.protected.util'

const protectedPassword = protectedUser.password

class UserRepository {
  async createUser(payload: RegisterRequestBody) {
    const newUser = await User.create(payload)
    return newUser
  }

  async checkUserByPhone(phone: string) {
    const user = await User.findOne({ phone })
    return !!user
  }

  async checkUserByEmail(email: string) {
    const user = await User.findOne({ email })
    return !!user
  }

  async getUserById(user_id: string) {
    const user = await User.findById(user_id)
    return user
  }

  async getUserByIdWithoutPassword(user_id: string) {
    const user = await User.findById(user_id)
      .select(protectedPassword)
      .populate({
        path: COLLECTION_NAME.DERPARTMENT as string,
        select: protectedDerpartment
      })
      .populate({
        path: 'roles',
        select: protectedRoles
      })
    return user
  }

  async checkUserByEmailAndPassword(email: string, password: string) {
    const user = await User.findOne({ email, password: hashPassword(password) }).select(protectedPassword)
    return user
  }

  async updateUserPassword(user_id: string, new_password: string) {
    const hashedPassword = hashPassword(new_password)
    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      { password: hashedPassword, updated_at: new Date() },
      { new: true }
    ).select(protectedPassword)
    return updatedUser
  }

  async updateUserProfile(user_id: string, updateData: UpdateMyProfileRequestBody) {
    const dataUpdate = { ...updateData, updated_at: new Date() }
    const updatedUser = await User.findByIdAndUpdate(user_id, dataUpdate, { new: true })
      .select(protectedPassword)
      .populate({
        path: COLLECTION_NAME.DERPARTMENT as string,
        select: protectedDerpartment
      })
    return updatedUser
  }
}

const userRepository = new UserRepository()

export default userRepository
