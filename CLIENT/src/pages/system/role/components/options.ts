import { PermissionIdCodeEnum, RoleCodeEnum } from '../enum'

export const getRoleCodeOptions = () => {
  return [
    {
      label: 'Quản trị viên',
      value: RoleCodeEnum.ADMIN
    },
    {
      label: 'Quản lý',
      value: RoleCodeEnum.LEADER
    },
    {
      label: 'Nhân viên',
      value: RoleCodeEnum.EMPLOYEE
    }
  ]
}

export const getPermissionOptions = () => {
  return [
    {
      label: 'Xem',
      value: PermissionIdCodeEnum.VIEW
    },
    {
      label: 'Thêm',
      value: PermissionIdCodeEnum.ADD
    },
    {
      label: 'Sửa',
      value: PermissionIdCodeEnum.UPDATE
    },
    {
      label: 'Xóa',
      value: PermissionIdCodeEnum.DELETE
    }
  ]
}
