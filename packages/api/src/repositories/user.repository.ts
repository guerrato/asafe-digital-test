import { User } from '@prisma/client'
import 'reflect-metadata'
import { autoInjectable, inject } from 'tsyringe'
import { UserCreate, UserReply } from '~/models/user.model'
import { DbContext } from '~/repositories/dbContext'

export interface IUserRepository {
  create(data: UserCreate): Promise<UserReply>
}

@autoInjectable()
export class UserRepository implements IUserRepository {
  constructor(@inject('DbContext') private readonly dbContext: DbContext) {}

  async create(data: UserCreate): Promise<UserReply> {
    try {
      const { password, picture, ...rest }: User = await this.dbContext.prisma.user.create({ data })
      return rest
    } catch (error) {
      throw error
    }
  }
}
