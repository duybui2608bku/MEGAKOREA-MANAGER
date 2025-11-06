import { UserGender } from '#src/enum/user.js'
import { serviceMegaMain } from '../constants'

const STATUS_ACTIVE = 1
const STATUS_INACTIVE = 0

export const YesNoOptions = [
  {
    label: 'Có',
    value: 1
  },
  {
    label: 'Không',
    value: 0
  }
]

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

export const serviceMegaMainOptions = Object.values(serviceMegaMain).map((service) => ({
  label: service,
  value: service
}))

export const methodContentOptions = [
  {
    label: 'AIDA',
    value: 'AIDA'
  },
  {
    label: 'PAS',
    value: 'PAS'
  },
  {
    label: 'ACCA',
    value: 'ACCA'
  }
]
