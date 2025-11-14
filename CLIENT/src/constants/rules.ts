import {
  ALPHA_NUMERIC_ONLY_REGEXP,
  EMAIL_REGEXP,
  MOBILE_PHONE_REGEXP,
  TELEPHONE_REGEXP,
  UNIFIED_SOCIAL_CREDIT_CODE_REGEXP
} from './regular-expressions'

export const FORM_REQUIRED = [{ required: true }]

export function EMAIL_RULES() {
  return [
    {
      required: true,
      message: 'Email là bắt buộc'
    },
    {
      pattern: EMAIL_REGEXP,
      message: 'Email không hợp lệ'
    }
  ]
}

export function PASSWORD_RULES() {
  return [
    {
      required: true,
      message: 'Mật khẩu là bắt buộc'
    },
    {
      pattern: /^(?=.*\d)[A-Za-z\d~!@#$%^&*()_+\-={}[\]|:;"'<>,.?/]{6,16}$/,
      message: 'Mật khẩu phải có ít nhất 6 ký tự và 1 chữ số'
    }
  ]
}

export function ALPHA_NUMERIC_ONLY_RULES() {
  return [
    {
      required: true,
      message: 'Mật khẩu phải có ít nhất 6 ký tự và 1 chữ số'
    },
    {
      pattern: ALPHA_NUMERIC_ONLY_REGEXP,
      message: 'Mật khẩu phải có ít nhất 6 ký tự và 1 chữ số'
    }
  ]
}

export function UNIFIED_SOCIAL_CREDIT_CODE_RULES() {
  return [
    {
      required: true,
      message: 'Mã số thuế là bắt buộc'
    },
    {
      pattern: UNIFIED_SOCIAL_CREDIT_CODE_REGEXP,
      message: 'Mã số thuế không hợp lệ'
    }
  ]
}

export function MOBILE_PHONE_RULES() {
  return [
    {
      required: true,
      message: 'Số điện thoại là bắt buộc'
    },
    {
      pattern: MOBILE_PHONE_REGEXP,
      message: 'Số điện thoại không hợp lệ'
    }
  ]
}

export function TELEPHONE_RULES() {
  return [
    {
      required: true,
      message: 'Số điện thoại là bắt buộc'
    },
    {
      pattern: TELEPHONE_REGEXP,
      message: 'Số điện thoại không hợp lệ'
    }
  ]
}

export function PHONE_RULE() {
  return {
    validator: (_: unknown, value: string) => {
      if (!value) {
        return Promise.resolve()
      }

      if (MOBILE_PHONE_REGEXP.test(value) || TELEPHONE_REGEXP.test(value)) {
        return Promise.resolve()
      } else {
        return Promise.reject('Số điện thoại không hợp lệ')
      }
    }
  }
}
