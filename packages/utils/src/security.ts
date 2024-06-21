import { hash, verify } from 'argon2'

export const generatePasswordHash = async (password: string, secretKey: string): Promise<string> => {
  return await hash(password, { secret: Buffer.from(secretKey) })
}

export const verifyPassword = async (hash: string, password: string, secretKey: string): Promise<boolean> => {
  return await verify(hash, password, { secret: Buffer.from(secretKey) })
}
