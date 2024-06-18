import { FastifyReply, FastifyRequest } from 'fastify'
import { autoInjectable, inject } from 'tsyringe'
import { UserInput, UserUpdate } from '~/models/user.model'
import { IUserService } from '~/services/user.service'
import httpResponse from '~/utils/httpResponse'

export interface IUserController {
  create(request: FastifyRequest<{ Body: UserInput }>, reply: FastifyReply): Promise<void>
  update(request: FastifyRequest<{ Body: UserInput }>, reply: FastifyReply): Promise<void>
}

@autoInjectable()
export class UserController {
  constructor(@inject('IUserService') private readonly userService: IUserService) {}

  async create(request: FastifyRequest<{ Body: UserInput }>, reply: FastifyReply): Promise<void> {
    try {
      const result = await this.userService.create(request.body)
      reply.code(201).send(httpResponse({ data: result, message: 'User created' }))
    } catch (error) {
      throw error
    }
  }

  async update(request: FastifyRequest<{ Body: UserUpdate }>, reply: FastifyReply): Promise<void> {
    try {
      reply.code(200).send(httpResponse({ data: await this.userService.update(request.body) }))
    } catch (error) {
      throw error
    }
  }
}
