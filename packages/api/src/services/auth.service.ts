import { autoInjectable, inject } from 'tsyringe'
import { IUserRepository } from '../repositories/user.repository'
import { formatEmail, isEmail, isEmpty } from '../utils/string'
import { verify } from 'argon2'
import { createToken } from '../utils/jwt'
import { AuthLogin } from '../models/auth.model'
import { verifyPassword } from '../utils/security'

export interface IAuthService {
  login(user: AuthLogin): Promise<string>
}

@autoInjectable()
export class AuthService implements IAuthService {
  constructor(@inject('IUserRepository') private readonly userRepository: IUserRepository) {}

  async login(user: AuthLogin): Promise<string> {
    try {
      if (isEmpty(process.env.SECRET_KEY) || isEmpty(process.env.JWT_SECRET)) {
        throw new Error('SRV_VAR_MISSING: Internal Error: Variables missing')
      }

      let { email, password } = user
      if (!isEmail(email)) throw new Error('You must provide a valid email')
      if (isEmpty(password)) throw new Error('You must provide a password')

      email = formatEmail(email)

      const userDB = await this.userRepository.findByEmail(email)
      if (isEmpty(userDB)) throw new Error('Invalid credentials')

      const isValid = await verifyPassword(userDB.password, password)
      if (!isValid) throw new Error('Invalid credentials')

      const payload = {
        sub: userDB.id,
        iss: process.env.API_DOMAIN,
        aud: process.env.API_DOMAIN,
        role: userDB.role,
      }

      return createToken(payload, process.env.JWT_SECRET)
    } catch (error) {
      throw error
    }
  }
}
