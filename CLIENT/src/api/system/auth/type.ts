export interface RegisterFormType {
  name: string
  email: string
  phone: string
  password: string
  gender: number
  date_of_birth: Date
  address?: string
  derpartment: string
  roles: string[]
  avatar?: string
}
