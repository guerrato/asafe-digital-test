import { autoInjectable, inject } from 'tsyringe'
import { UserInput, UserReply, UserUpdate } from '~/models/user.model'
import { IUserRepository } from '~/repositories/user.repository'
import { formatEmail, formatPersonName, isCompleteName, isEmail, isEmpty } from '~/utils/string'
import { hash } from 'argon2'

export interface IUserService {
  create(user: UserInput): Promise<UserReply>
  update(user: UserUpdate): Promise<UserReply>
  delete(id: string): Promise<void>
}

@autoInjectable()
export class UserService implements IUserService {
  constructor(@inject('IUserRepository') private readonly userRepository: IUserRepository) {}
  async create(user: UserInput): Promise<UserReply> {
    try {
      if (isEmpty(process.env.SECRET_KEY)) throw new Error('SRV_VAR_MISSING: Internal Error: Variables missing')

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

  async update(user: UserUpdate): Promise<UserReply> {
    if (isEmpty(user.id)) {
      throw new Error('User not found')
    }

    const existingUser = await this.userRepository.findById(user.id)
    if (!existingUser) {
      throw new Error('User not found')
    }

    // Validate new user's name if informed
    if (!isEmpty(user.name)) {
      if (!isCompleteName(user.name)) {
        throw new Error('You must provide a complete name')
      }
      user.name = formatPersonName(user.name)
    }

    // Validate new user's email if informed
    if (!isEmpty(user.email)) {
      if (!isEmail(user.email)) {
        throw new Error('You must provide a valid email')
      }
      const email = formatEmail(user.email)
      const emailUser = await this.userRepository.findByEmail(email)

      if (emailUser && emailUser.id !== user.id) {
        throw new Error('Email already in use')
      }
    }

    // Validate new user's password if informed
    if (!isEmpty(user.password)) {
      if (isEmpty(process.env.SECRET_KEY)) {
        throw new Error('SRV_VAR_MISSING: Internal Error: Variables missing')
      }
      user.password = await hash(user.password, { secret: Buffer.from(process.env.SECRET_KEY) })
    }

    return await this.userRepository.update(user)
  }

  async delete(id: string): Promise<void> {
    try {
      if (isEmpty(id)) {
        throw new Error('User not found')
      }

      const existingUser = await this.userRepository.findById(id)
      if (!existingUser) {
        throw new Error('User not found')
      }

      await this.userRepository.delete(id)
    } catch (error) {
      throw error
    }
  }
}
