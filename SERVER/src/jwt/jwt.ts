import jwt, { SignOptions } from 'jsonwebtoken'
import { config } from 'dotenv'
import { ErrorWithStatusCode } from '~/middlewares/error/error-response.middleware'
import { HttpStatusCode } from '~/constants/enum/http/http-status-code.enum'
import { TokenPayload } from '~/interfaces/user/users.interface'

const algorithm = 'HS256'

config()
export const signToken = ({
  payload,
  priveKey,
  options = {
    algorithm
  }
}: {
  payload: string | Buffer | object
  priveKey: string
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, priveKey, options, (error, token) => {
      if (error) {
        throw reject(error)
      }
      resolve(token as string)
    })
  })
}

export const verifyToken = ({ token, secretOrPublicKey }: { token: string; secretOrPublicKey: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) {
        throw new ErrorWithStatusCode({ message: error.message, statusCode: HttpStatusCode.Unauthorized })
      }
      resolve(decoded as TokenPayload)
    })
  })
}
