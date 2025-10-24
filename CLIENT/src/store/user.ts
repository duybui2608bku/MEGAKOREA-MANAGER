import type { UserInfoType } from '#src/api/user/types'
import { fetchUserInfo } from '#src/api/user'

import { create } from 'zustand'

const initialState = {
  _id: '',
  email: '',
  name: '',
  phone: '',
  gender: 0,
  avatar: '',
  date_of_birth: new Date(),
  address: '',
  status: 0,
  roles: [],
  department: {},
  menus: []
}

type UserState = UserInfoType

interface UserAction {
  getUserInfo: () => Promise<UserInfoType>
  reset: () => void
}

export const useUserStore = create<UserState & UserAction>()((set) => ({
  ...initialState,

  getUserInfo: async () => {
    const response = await fetchUserInfo()
    set({
      ...response.result
    })
    return response.result
  },

  reset: () => {
    return set({
      ...initialState
    })
  }
}))
