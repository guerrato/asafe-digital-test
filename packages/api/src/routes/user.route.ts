import 'reflect-metadata'
import { FastifyInstance, FastifyPluginOptions, FastifyError, FastifySchema } from 'fastify'
import { container } from 'tsyringe'
import { UserController } from '~/controllers/user.controller'
import { userCreateSchema } from '~/routes/schemas/user.schema'
import { UserCreate } from '~/models/user.model'

export const userRoutes = async (fastify: FastifyInstance, _: any, done: Function) => {
  const userController = container.resolve(UserController)
  fastify.post<{ Body: UserCreate }>('/', { schema: userCreateSchema }, async (request, reply) => {
    await userController.create(request, reply)
  })
}
