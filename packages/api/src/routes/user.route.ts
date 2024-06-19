import 'reflect-metadata'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { UserController } from '~/controllers/user.controller'
import { userCreateSchema, userDeleteSchema, userUpdateSchema } from '~/routes/schemas/user.schema'
import { UserInput, UserUpdate } from '~/models/user.model'
import { authMiddleware } from '~/middleware/auth.middleware'
import { roleMiddleware } from '~/middleware/role.middleware'
import { AuthenticatedRequest } from '~/models/auth.model'

export const userRoutes = async (fastify: FastifyInstance, _: any, done: Function) => {
  const userController = container.resolve(UserController)

  fastify.route({
    method: 'POST',
    url: '/',
    schema: userCreateSchema,
    handler: async (request: FastifyRequest<{ Body: UserInput }>, reply) => await userController.create(request, reply),
  })

  fastify.route({
    method: 'PUT',
    url: '/',
    schema: userUpdateSchema,
    preHandler: authMiddleware<FastifyRequest<{ Body: UserUpdate }>>,
    handler: async (request: FastifyRequest<{ Body: UserUpdate }>, reply) =>
      await userController.update(request as AuthenticatedRequest<{ Body: UserUpdate }>, reply),
  })

  fastify.route({
    method: 'DELETE',
    url: '/:id',
    schema: userDeleteSchema,
    preHandler: async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      await authMiddleware<FastifyRequest<{ Params: { id: string } }>>(request, reply)
      await roleMiddleware(request as AuthenticatedRequest<{ Params: { id: string } }>, reply)
    },
    handler: async (request: FastifyRequest<{ Params: { id: string } }>, reply) =>
      await userController.delete(request as AuthenticatedRequest<{ Params: { id: string } }>, reply),
  })
}
