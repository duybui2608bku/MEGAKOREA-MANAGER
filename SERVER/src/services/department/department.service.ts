import { CreateDepartmentRequestBody, UpdateDepartmentRequestBody } from '~/interfaces/department/department.interface'
import departmentRepository from '~/repository/department/department.repository'
import { ErrorWithStatusCode } from '~/middlewares/error/error-response.middleware'
import { HttpStatusCode } from '~/constants/enum/http/http-status-code.enum'
import { DEPARTMENT_MESSAGES } from '~/constants/messages/derpartment/derpartment.message'

class DepartmentService {
  private async checkDepartmentExists(_id: string) {
    const existingDepartment = await departmentRepository.getDepartmentById(_id)
    if (!existingDepartment) {
      throw new ErrorWithStatusCode({
        message: DEPARTMENT_MESSAGES.DEPARTMENT_NOT_FOUND,
        statusCode: HttpStatusCode.NotFound
      })
    }
    return existingDepartment
  }

  async createDepartment(departmentData: CreateDepartmentRequestBody) {
    const existingDepartment = await departmentRepository.getDepartmentByName(departmentData.name)
    if (existingDepartment) {
      throw new ErrorWithStatusCode({
        message: DEPARTMENT_MESSAGES.DEPARTMENT_NAME_ALREADY_EXISTS,
        statusCode: HttpStatusCode.BadRequest
      })
    }

    const department = await departmentRepository.createDepartment(departmentData)
    return department
  }

  async getAllDepartments() {
    const departments = await departmentRepository.getAllDepartments()
    return departments
  }

  async getDepartmentById(departmentId: string) {
    const department = await this.checkDepartmentExists(departmentId)
    return department
  }

  async updateDepartment(departmentId: string, updateData: UpdateDepartmentRequestBody) {
    const existingDepartment = await this.checkDepartmentExists(departmentId)
    if (updateData.name && updateData.name !== existingDepartment.name) {
      const nameConflict = await departmentRepository.getDepartmentByName(updateData.name)
      if (nameConflict) {
        throw new ErrorWithStatusCode({
          message: DEPARTMENT_MESSAGES.DEPARTMENT_NAME_ALREADY_EXISTS,
          statusCode: HttpStatusCode.BadRequest
        })
      }
    }

    const updatedDepartment = await departmentRepository.updateDepartment(departmentId, updateData)
    return updatedDepartment
  }

  async deleteDepartment(departmentId: string) {
    await this.checkDepartmentExists(departmentId)
    const usersInDepartment = await departmentRepository.getUsersInDepartment(departmentId)
    if (usersInDepartment.length > 0) {
      throw new ErrorWithStatusCode({
        message: DEPARTMENT_MESSAGES.CANNOT_DELETE_DEPARTMENT_WITH_ASSIGNED_USERS,
        statusCode: HttpStatusCode.BadRequest
      })
    }

    await departmentRepository.deleteDepartment(departmentId)
    return { message: DEPARTMENT_MESSAGES.DELETE_SUCCESS }
  }
}

const departmentService = new DepartmentService()
export default departmentService
