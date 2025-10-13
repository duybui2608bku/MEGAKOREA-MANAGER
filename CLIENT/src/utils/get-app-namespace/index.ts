/**
 * Lấy namespace (tên không gian ứng dụng) kèm hậu tố
 *
 * @param {string} name - Hậu tố cần nối thêm (ví dụ: tên module, store, v.v.)
 * @returns {string} Chuỗi định dạng: `{namespace}-{version}-{env}-{name}`
 *
 * @example
 * // Ví dụ sử dụng với Zustand store
 * const storeKey = getAppNamespace('userStore');
 * // Kết quả: "myapp-1.0.0-prod-userStore"
 *
 * @description
 * Hàm này tạo ra một định danh duy nhất cho ứng dụng dựa trên:
 * - `VITE_APP_NAMESPACE`: tên ứng dụng (lấy từ biến môi trường)
 * - `version`: phiên bản ứng dụng (lấy từ __APP_INFO__.pkg.version)
 * - `env`: môi trường hiện tại (`prod` hoặc `dev`)
 * - `name`: hậu tố truyền vào (tùy mục đích sử dụng)
 *
 * Nếu biến môi trường `VITE_APP_NAMESPACE` chưa được định nghĩa, hàm sẽ ném lỗi.
 */

export function getAppNamespace(name: string): string {
  const env = import.meta.env.PROD ? 'prod' : 'dev' // Xác định môi trường
  const appVersion = __APP_INFO__.pkg.version // Lấy version ứng dụng
  const appNamespace = import.meta.env.VITE_APP_NAMESPACE || 'mega-holding-manager' // Fallback value

  // Ghép chuỗi định danh
  const namespace = `${appNamespace}-${appVersion || 'unknown'}-${env}`
  return `${namespace}-${name}`
}
