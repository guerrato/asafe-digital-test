import 'reflect-metadata'
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { UserController } from '~/controllers/user.controller'
import {
  userCreateSchema,
  userGetDeleteSchema,
  userUpdateRoleSchema,
  userUpdateSchema,
} from '~/routes/schemas/user.schema'
import { UserInput, UserUpdate, UserUpdateRole } from '~/models/user.model'
import { authMiddleware } from '~/middleware/auth.middleware'
import { roleMiddleware } from '~/middleware/role.middleware'
import { AuthenticatedRequest } from '~/models/auth.model'
import { adminOnlyMiddleware } from '~/middleware/adminOnly.middleware'

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
    method: 'PATCH',
    url: '/',
    schema: userUpdateRoleSchema,
    preHandler: async (request: FastifyRequest<{ Body: UserUpdateRole }>, reply) => {
      await authMiddleware<FastifyRequest<{ Body: UserUpdateRole }>>(request, reply)
      await adminOnlyMiddleware(request as AuthenticatedRequest<{ Body: UserUpdateRole }>, reply)
    },
    handler: async (request: FastifyRequest<{ Body: UserUpdateRole }>, reply) =>
      await userController.updateRole(request as AuthenticatedRequest<{ Body: UserUpdateRole }>, reply),
  })

  fastify.route({
    method: 'DELETE',
    url: '/:id',
    schema: userGetDeleteSchema,
    preHandler: async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      await authMiddleware<FastifyRequest<{ Params: { id: string } }>>(request, reply)
      await roleMiddleware(request as AuthenticatedRequest<{ Params: { id: string } }>, reply)
    },
    handler: async (request: FastifyRequest<{ Params: { id: string } }>, reply) =>
      await userController.delete(request as AuthenticatedRequest<{ Params: { id: string } }>, reply),
  })

  fastify.route({
    method: 'GET',
    url: '/:id',
    schema: userGetDeleteSchema,
    preHandler: async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      await authMiddleware<FastifyRequest<{ Params: { id: string } }>>(request, reply)
      await roleMiddleware(request as AuthenticatedRequest<{ Params: { id: string } }>, reply)
    },
    handler: async (request: FastifyRequest<{ Params: { id: string } }>, reply) =>
      await userController.get(request as AuthenticatedRequest<{ Params: { id: string } }>, reply),
  })

  fastify.route({
    method: 'GET',
    url: '/',
    preHandler: async (request: FastifyRequest, reply) => {
      await authMiddleware(request, reply)
      await roleMiddleware(request as AuthenticatedRequest, reply)
    },
    handler: async (request: FastifyRequest, reply) =>
      await userController.list(request as AuthenticatedRequest, reply),
  })

  fastify.post(
    '/picture',
    {
      schema: {
        consumes: ['multipart/form-data'],
        body: {
          type: 'object',
          required: ['form_data'],
          properties: {
            form_data: { $ref: '#userPictureSchema' },
          },
        },
      },
      preHandler: async (request: FastifyRequest<{ Body: { form_data: any } }>, reply) =>
        await authMiddleware<FastifyRequest<{ Body: { form_data: any } }>>(request, reply),
    },
    async (request, reply) =>
      await userController.uploadPicture(request as AuthenticatedRequest<{ Body: { form_data: any } }>, reply)
  )
}
