import { useAuthStore } from '#src/store'
import { rememberRoute } from '#src/utils'

/**
 * Điều hướng (chuyển hướng) người dùng đến trang đăng nhập
 *
 * @returns Không trả về giá trị
 */

export function goLogin() {
  console.log('🚪 goLogin() called - Redirecting to login page')
  console.log('📍 Called from:', new Error().stack)

  // Đặt lại (reset) trạng thái đăng nhập
  useAuthStore.getState().reset()
  // Chuyển hướng đến trang đăng nhập, đồng thời ghi nhớ đường dẫn mà người dùng đang ở
  window.location.href = `${import.meta.env.BASE_URL}login${rememberRoute()}`
}
