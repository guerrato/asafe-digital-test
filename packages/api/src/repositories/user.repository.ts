import { User } from '@prisma/client'
import 'reflect-metadata'
import { autoInjectable, inject } from 'tsyringe'
import { UserInput, UserReply, UserUpdate } from '~/models/user.model'
import { DbContext } from '~/repositories/dbContext'

export interface IUserRepository {
  findById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(data: UserInput): Promise<UserReply>
  update(user: UserUpdate): Promise<UserReply>
}

@autoInjectable()
export class UserRepository implements IUserRepository {
  constructor(@inject('DbContext') private readonly dbContext: DbContext) {}

  async findById(id: string): Promise<User | null> {
    try {
      return await this.dbContext.prisma.user.findUnique({ where: { id } })
    } catch (error) {
      throw error
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.dbContext.prisma.user.findUnique({ where: { email } })
    } catch (error) {
      throw error
    }
  }

  
  async create(data: UserInput): Promise<UserReply> {
    try {
      const { password, picture, ...rest }: User = await this.dbContext.prisma.user.create({ data })
      return rest
    } catch (error) {
      throw error
    }
  }

  async update(user: UserUpdate): Promise<UserReply> {
    try {
      const { id, ...data } = user
      const { password, picture, ...rest }: User = await this.dbContext.prisma.user.update({ where: { id }, data })
      return rest
    } catch (error) {
      throw error
    }
  }
}
