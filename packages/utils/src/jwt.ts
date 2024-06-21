import jwt, { JwtPayload } from 'jsonwebtoken'

/**
 *    For the proposal of this project, we will use strings as the secret key.
 *    In a real project, you should use more secure keys
 */

export const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload
}

export const createToken = (payload: object, secret: string): string => {
  const now = Math.floor(Date.now() / 1000)
  const exp = now + 60 * 60

  return jwt.sign({ ...payload, iat: now, exp }, secret)
}
