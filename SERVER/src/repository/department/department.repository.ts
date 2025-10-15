import { Derpartment, User } from '~/models'
import { CreateDepartmentRequestBody, UpdateDepartmentRequestBody } from '~/interfaces/department/department.interface'

class DepartmentRepository {
  async createDepartment(departmentData: CreateDepartmentRequestBody) {
    const department = new Derpartment({
      ...departmentData,
      created_at: new Date(),
      updated_at: new Date()
    })
    return await department.save()
  }

  async getTotalDepartments() {
    return await Derpartment.countDocuments()
  }

  async getAllDepartments() {
    return await Derpartment.find().sort({ created_at: -1 })
  }

  async getDepartmentById(departmentId: string) {
    return await Derpartment.findById(departmentId)
  }

  async getDepartmentByName(name: string) {
    return await Derpartment.findOne({ name })
  }

  async updateDepartment(departmentId: string, updateData: UpdateDepartmentRequestBody) {
    return await Derpartment.findByIdAndUpdate(departmentId, { ...updateData, updated_at: new Date() }, { new: true })
  }

  async deleteDepartment(departmentId: string) {
    return await Derpartment.findByIdAndDelete(departmentId)
  }

  async getUsersInDepartment(departmentId: string) {
    return await User.find({ derpartment: departmentId })
  }
}

const departmentRepository = new DepartmentRepository()
export default departmentRepository
