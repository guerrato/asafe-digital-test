import { FastifyReply, FastifyRequest } from 'fastify'
import { autoInjectable, inject } from 'tsyringe'
import { AuthLogin } from '../models/auth.model'
import { IAuthService } from '../services/auth.service'
import httpResponse from '../utils/httpResponse'

export interface IAuthController {
  login(request: FastifyRequest<{ Body: AuthLogin }>, reply: FastifyReply): Promise<void>
}

@autoInjectable()
export class AuthController {
  constructor(@inject('IAuthService') private readonly authService: IAuthService) {}

  async login(request: FastifyRequest<{ Body: AuthLogin }>, reply: FastifyReply): Promise<void> {
    try {
      const result = await this.authService.login(request.body)
      reply.code(200).send(httpResponse({ data: result }))
    } catch (error) {
      reply.code(401).send(httpResponse({ error: 'Unauthorized' }))
      throw error
    }
  }
}
