import { hash, verify } from 'argon2'
import 'dotenv/config'

export const generatePasswordHash = async (password: string): Promise<string> => {
  if (!process.env.SECRET_KEY) {
    throw new Error('HLP_VAR_NOT_SET: Environment variable not set')
  }
  return await hash(password, { secret: Buffer.from(process.env.SECRET_KEY) })
}

export const verifyPassword = async (hash: string, password: string): Promise<boolean> => {
  if (!process.env.SECRET_KEY) {
    throw new Error('HLP_VAR_NOT_SET: Environment variable not set')
  }
  return await verify(hash, password, { secret: Buffer.from(process.env.SECRET_KEY) })
}
