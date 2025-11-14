const generateRandomPassword = () => {
  const minLength = 6
  const length = 10
  const lower = 'abcdefghijklmnopqrstuvwxyz'
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const digits = '0123456789'
  const special = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  const allChars = lower + upper + digits + special

  let result = ''
  result += digits.charAt(Math.floor(Math.random() * digits.length))

  for (let i = result.length; i < length; i++) {
    result += allChars.charAt(Math.floor(Math.random() * allChars.length))
  }

  result = result
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')

  if (result.length < minLength) {
    const extraNeeded = minLength - result.length
    for (let i = 0; i < extraNeeded; i++) {
      result += allChars.charAt(Math.floor(Math.random() * allChars.length))
    }
  }

  return result
}

export default generateRandomPassword
