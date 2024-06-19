import { FastifyReply, FastifyRequest } from 'fastify'
import { autoInjectable, inject } from 'tsyringe'
import { AuthenticatedRequest } from '~/models/auth.model'
import { UserInput, UserUpdate } from '~/models/user.model'
import { IUserService } from '~/services/user.service'
import httpResponse from '~/utils/httpResponse'
import { isEmpty } from '~/utils/string'

export interface IUserController {
  create(request: FastifyRequest<{ Body: UserInput }>, reply: FastifyReply): Promise<void>
  update(request: FastifyRequest<{ Body: UserInput }>, reply: FastifyReply): Promise<void>
  delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void>
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

  async update(request: AuthenticatedRequest<{ Body: UserUpdate }>, reply: FastifyReply): Promise<void> {
    try {
      const { auth, ...userUpdateData } = request.body
      userUpdateData.id = request.body.auth.userId
      reply.code(200).send(httpResponse({ data: await this.userService.update(userUpdateData) }))
    } catch (error) {
      throw error
    }
  }

  async delete(request: AuthenticatedRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    try {
      await this.userService.delete(request.params.id)
    } catch (error) {
      throw error
    }
  }
}
