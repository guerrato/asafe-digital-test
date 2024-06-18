import 'reflect-metadata'
import { FastifyInstance, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { AuthController } from '~/controllers/auth.controller'
import { AuthLogin } from '~/models/auth.model'
import { authLoginSchema } from './schemas/auth.schema'

export const authRoutes = async (fastify: FastifyInstance, _: any, done: Function) => {
  const authController = container.resolve(AuthController)

  fastify.route({
    method: 'POST',
    url: '/login',
    schema: authLoginSchema,
    handler: async (request: FastifyRequest<{ Body: AuthLogin }>, reply) => await authController.login(request, reply),
  })
}
