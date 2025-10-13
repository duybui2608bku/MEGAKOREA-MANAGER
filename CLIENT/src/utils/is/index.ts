/**
 * Kiểm tra xem giá trị được truyền vào có phải là hàm (function) hay không
 *
 * @param value Giá trị cần kiểm tra
 * @returns Trả về true nếu giá trị là một hàm, ngược lại trả về false
 */
export function isFunction(value: unknown) {
  return typeof value === 'function'
}

/**
 * Kiểm tra xem giá trị được truyền vào có phải là một số hữu hạn (finite number) hay không
 *
 * @param value Giá trị cần kiểm tra
 * @returns Trả về true nếu giá trị là số hữu hạn, ngược lại trả về false
 */
export function isNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value)
}

/**
 * Kiểm tra xem giá trị được truyền vào có phải là chuỗi (string) hay không
 *
 * @param value Giá trị cần kiểm tra
 * @returns Trả về true nếu giá trị là chuỗi, ngược lại trả về false
 */
export function isString(value: unknown) {
  return typeof value === 'string'
}

/**
 * Kiểm tra xem giá trị được truyền vào có phải là kiểu boolean (true/false) hay không
 *
 * @param value Giá trị cần kiểm tra
 * @returns Trả về true nếu giá trị là boolean, ngược lại trả về false
 */
export function isBoolean(value: unknown) {
  return typeof value === 'boolean'
}

/**
 * Kiểm tra xem giá trị có phải là một đối tượng (object) hay không, loại trừ trường hợp null
 *
 * @param value Giá trị cần kiểm tra
 * @returns Trả về true nếu giá trị là đối tượng, ngược lại trả về false
 */
export function isObject(value: unknown) {
  return typeof value === 'object' && value !== null
}

/**
 * Kiểm tra xem giá trị có phải là null hay không
 *
 * @param value Giá trị cần kiểm tra
 * @returns Trả về true nếu giá trị là null, ngược lại trả về false
 */
export function isNull(value: unknown) {
  return value === null
}

/**
 * Kiểm tra xem giá trị có phải là undefined hay không
 *
 * @param value Giá trị cần kiểm tra
 * @returns Trả về true nếu giá trị là undefined, ngược lại trả về false
 */
export function isUndefined(value: unknown) {
  return value === undefined
}
