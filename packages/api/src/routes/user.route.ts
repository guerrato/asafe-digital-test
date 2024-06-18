import 'reflect-metadata'
import { FastifyInstance, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { UserController } from '~/controllers/user.controller'
import { userCreateSchema, userUpdateSchema } from '~/routes/schemas/user.schema'
import { UserInput, UserUpdate } from '~/models/user.model'
import { authMiddleware } from '~/middleware/auth.middleware'

export const userRoutes = async (fastify: FastifyInstance, _: any, done: Function) => {
  const userController = container.resolve(UserController)

  fastify.route({
    method: 'POST',
    url: '/',
    schema: userCreateSchema,
    handler: async (request: FastifyRequest<{ Body: UserInput }>, reply) =>
      await userController.create(request, reply),
  })
  
  fastify.route({
    method: 'PUT',
    url: '/',
    schema: userUpdateSchema,
    preHandler: authMiddleware,
    handler: async (request: FastifyRequest<{ Body: UserUpdate }>, reply) =>
      await userController.update(request, reply),
  })
}
