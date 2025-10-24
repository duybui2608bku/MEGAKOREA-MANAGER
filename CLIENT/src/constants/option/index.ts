import { UserGender } from '#src/enum/user.js'

const STATUS_ACTIVE = 1
const STATUS_INACTIVE = 0

export const StatusOptionsGlobal = [
  {
    label: 'Hoạt động',
    value: STATUS_ACTIVE
  },
  {
    label: 'Không hoạt động',
    value: STATUS_INACTIVE
  }
]

export const GenderOptions = [
  {
    label: 'Nữ',
    value: UserGender.FEMALE
  },
  {
    label: 'Nam',
    value: UserGender.MALE
  },
  {
    label: 'Khác',
    value: UserGender.OTHER
  }
]
