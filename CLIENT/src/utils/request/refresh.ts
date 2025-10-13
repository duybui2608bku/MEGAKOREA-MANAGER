import type { KyResponse, Options } from 'ky'
import { fetchRefreshToken } from '#src/api/user'
import { useAuthStore } from '#src/store'
import ky from 'ky'
import { AUTH_HEADER } from './constants'
import { goLogin } from './go-login'

let isRefreshing = false

/**
 * Làm mới (refresh) token và gửi lại request bị lỗi 401
 *
 * @param request - Request ban đầu bị lỗi (401)
 * @param options - Tùy chọn request ban đầu
 * @param refreshToken - Refresh token hiện tại
 * @returns Response mới từ server
 * @throws Nếu làm mới token thất bại thì ném lỗi
 */
export async function refreshTokenAndRetry(request: Request, options: Options, refreshToken: string) {
  if (!isRefreshing) {
    isRefreshing = true
    try {
      // Gọi API làm mới token, gửi refreshToken lên server
      const freshResponse = await fetchRefreshToken({ refreshToken })
      // Lấy token mới từ phản hồi
      const newToken = freshResponse.result.token
      // Lấy refreshToken mới
      const newRefreshToken = freshResponse.result.refreshToken
      // Lưu token và refreshToken mới vào store
      useAuthStore.setState({ access_token: newToken, refresh_token: newRefreshToken })
      // Gọi hàm thông báo cho tất cả request đang chờ rằng token đã được làm mới
      onRefreshed(newToken)

      // Gắn token mới vào header
      request.headers.set(AUTH_HEADER, `Bearer ${newToken}`)
      // Gửi lại request ban đầu
      return ky(request, options)
    } catch (error) {
      // Nếu làm mới token thất bại, thông báo cho tất cả request đang chờ
      onRefreshFailed(error)
      // Chuyển người dùng về trang đăng nhập
      goLogin()
      // Ném lỗi để xử lý ở cấp cao hơn
      throw error
    } finally {
      // Dù thành công hay thất bại, cũng đánh dấu là quá trình refresh đã kết thúc
      isRefreshing = false
    }
  } else {
    // Nếu đang có request khác refresh token, request hiện tại sẽ chờ
    return new Promise<KyResponse>((resolve, reject) => {
      addRefreshSubscriber({
        resolve: async (newToken) => {
          // Khi token được làm mới xong, gắn token mới vào request và gửi lại
          request.headers.set(AUTH_HEADER, `Bearer ${newToken}`)
          resolve(ky(request, options))
        },
        reject // Nếu refresh token thất bại thì từ chối (reject) promise
      })
    })
  }
}

/* Danh sách lưu trữ tất cả các request đang chờ refresh token */
let refreshSubscribers: Array<{
  resolve: (token: string) => void
  reject: (error: any) => void
}> = []

/**
 * Khi token được làm mới thành công,
 * thông báo cho tất cả request đang chờ bằng cách gọi resolve(newToken)
 */

function onRefreshed(token: string) {
  refreshSubscribers.forEach((subscriber) => subscriber.resolve(token))
  refreshSubscribers = [] // Xóa danh sách chờ
}

/**
 * Khi refresh token thất bại,
 * thông báo lỗi cho tất cả request đang chờ
 */

function onRefreshFailed(error: any) {
  refreshSubscribers.forEach((subscriber) => subscriber.reject(error))
  refreshSubscribers = [] // Xóa danh sách chờ
}

/**
 * Thêm một request mới vào danh sách chờ refresh token
 */
function addRefreshSubscriber(subscriber: { resolve: (token: string) => void; reject: (error: any) => void }) {
  refreshSubscribers.push(subscriber)
}
