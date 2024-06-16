import { PrismaClient, User } from '@prisma/client'
import 'reflect-metadata'
import { autoInjectable, container, inject } from 'tsyringe'
import { DbContext } from '~/repositories/dbContext'

export interface IUserRepository {
  findMany(): Promise<User[]>
}

@autoInjectable()
export class UserRepository implements IUserRepository {
  constructor(@inject('DbContext') private readonly dbContext: DbContext) {}

  async findMany() {
    return (await this.dbContext.prisma.user.findMany()) as User[]
    // return 'Hello World from UserRepository'
  }
}
