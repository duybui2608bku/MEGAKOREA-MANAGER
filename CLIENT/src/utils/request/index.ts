import type { Options } from 'ky'
import { USER_PATH } from '#src/api/user/path'
import { loginPath } from '#src/router/extra-info'
import { useAuthStore, usePreferencesStore } from '#src/store'
import ky from 'ky'

import { AUTH_HEADER, LANG_HEADER } from './constants'
import { handleErrorResponse } from './error-response'
import { globalProgress } from './global-progress'
import { goLogin } from './go-login'
import { refreshTokenAndRetry } from './refresh'
import HttpStatusCode from '#src/enum/httpStatusCode.js'

// ✅ Danh sách "trắng": các API KHÔNG cần token
const requestWhiteList = [loginPath]

// ⏱️ Thời gian timeout cho request (mặc định 15 giây)
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 15000

// Số lần thử lại tối đa khi request lỗi mạng
const RETRY_LIMIT = Number(import.meta.env.VITE_RETRY_LIMIT) || 3

// ⚙️ Cấu hình mặc định cho mọi request

const defaultConfig: Options = {
  prefixUrl: import.meta.env.VITE_API_BASE_LOCAL, // Đường dẫn gốc API (VD: https://api.megakorea.vn/)
  timeout: API_TIMEOUT, // Thời gian chờ tối đa
  retry: {
    limit: RETRY_LIMIT // Số lần thử lại tối đa khi request lỗi mạng
  },
  hooks: {
    beforeRequest: [
      (request, options) => {
        const ignoreLoading = options.ignoreLoading
        if (!ignoreLoading) {
          globalProgress.start() // Hiển thị loading toàn cục
        }

        // ✅ Nếu request thuộc danh sách trắng, không cần token
        const isWhiteRequest = requestWhiteList.some((url) => request.url.endsWith(url))
        if (!isWhiteRequest) {
          const { access_token } = useAuthStore.getState()
          request.headers.set(AUTH_HEADER, `Bearer ${access_token}`) // Gắn token vào header
        }

        // 🌐 Gắn ngôn ngữ người dùng cho mọi request
        request.headers.set(LANG_HEADER, usePreferencesStore.getState().language)
      }
    ],
    afterResponse: [
      async (request, options, response) => {
        const ignoreLoading = options.ignoreLoading
        if (!ignoreLoading) {
          globalProgress.done() // Ẩn loading sau khi xong
        }

        // ❌ Nếu request thất bại
        if (!response.ok) {
          console.log('❌ Request failed with status:', response.status, 'URL:', request.url)
          // 401 = Unauthorized (token hết hạn / không hợp lệ)
          if (response.status === HttpStatusCode.Unauthorized) {
            // Tránh vòng lặp vô hạn khi refresh token cũng bị 401
            if ([`/${USER_PATH.REFRESH_TOKEN}`].some((url) => request.url.endsWith(url))) {
              goLogin() // Buộc đăng nhập lại
              return response
            }

            const { refresh_token } = useAuthStore.getState()
            if (!refresh_token) {
              // Nếu người dùng đã ở trang login → không cần redirect thêm
              if (location.pathname === loginPath) {
                return response
              } else {
                goLogin()
                return response
              }
            }

            // Nếu có refreshToken → gọi hàm làm mới token và gửi lại request
            return refreshTokenAndRetry(request, options, refresh_token)
          } else {
            // Các lỗi khác → xử lý qua hàm chung
            return handleErrorResponse(response)
          }
        }

        // ✅ Nếu request thành công → trả về bình thường
        return response
      }
    ]
  }
}

// 🚀 Tạo một instance ky với cấu hình mặc định
export const request = ky.create(defaultConfig)
