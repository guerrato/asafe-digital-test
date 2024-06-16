import { User } from '@prisma/client'
import { autoInjectable, inject } from 'tsyringe'
import { IUserService, UserService } from '~/services/user.service'

export interface IUserController {
  findMany(): Promise<User[]>
}

@autoInjectable()
export class UserController {
  constructor(@inject("IUserService") private readonly userService: IUserService) {}

  async findMany() {
    return await this.userService.findMany()
  }
}
