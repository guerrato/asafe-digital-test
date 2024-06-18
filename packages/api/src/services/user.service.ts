import { User } from '@prisma/client'
import { autoInjectable, inject } from 'tsyringe'
import { UserCreate, UserReply } from '~/models/user.model'
import { IUserRepository } from '~/repositories/user.repository'
import { formatEmail, formatPersonName, isCompleteName, isEmail, isEmpty } from '~/utils/string'
import { argon2i, hash } from 'argon2'

export interface IUserService {
  create(user: UserCreate): Promise<UserReply>
}

@autoInjectable()
export class UserService implements IUserService {
  constructor(@inject('IUserRepository') private readonly userRepository: IUserRepository) {}

  async create(user: UserCreate): Promise<UserReply> {
    try {
      if (isEmpty(process.env.SECRET_KEY)) throw new Error('Internal Error: Variables missing')

      let { email, name, password } = user
      if (!isEmail(email)) throw new Error('You must provide a valid email')
      if (!isCompleteName(name)) throw new Error('You must provide a complete name')
      if (isEmpty(password)) throw new Error('You must provide a password')

      name = formatPersonName(name)
      email = formatEmail(email)
      password = await hash(password, { secret: Buffer.from(process.env.SECRET_KEY) })

      return await this.userRepository.create({ email, name, password })
    } catch (error) {
      throw error
    }
  }
}
