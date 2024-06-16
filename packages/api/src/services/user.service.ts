import { User } from '@prisma/client'
import { autoInjectable, inject } from 'tsyringe'
import { IUserRepository, UserRepository } from '~/repositories/user.repository'

export interface IUserService {
  findMany(): Promise<User[]>
}

@autoInjectable()
export class UserService implements IUserService {
  constructor(@inject('IUserRepository') private readonly userRepository: IUserRepository) {}

  async findMany() {
    return await this.userRepository.findMany()
  }
}
