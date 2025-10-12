export interface UpdateProfileByAdminRequestBody {
  user_id: string
  name?: string
  password?: string
  phone?: string
  date_of_birth?: Date
  derpartment?: string
  status?: number
  address?: string
  avatar?: string
  gender?: number
  titles?: number
}
