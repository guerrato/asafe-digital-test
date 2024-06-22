import 'reflect-metadata'
import { FastifyInstance, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { PostController } from '../controllers/post.controller'
import {
  postCreateSchema,
  postGetSchema,
  postDeleteSchema,
  postListSchema,
  postUpdateSchema,
} from './schemas/post.schema'
import { PostInput, PostListInput, PostUpdate } from '../models/post.model'
import { authMiddleware } from '../middleware/auth.middleware'
import { AuthenticatedRequest } from '../models/auth.model'

export const postRoutes = async (fastify: FastifyInstance, _: any) => {
  const postController = container.resolve(PostController)

  fastify.route({
    method: 'GET',
    url: '/',
    schema: postListSchema,
    handler: async (request: FastifyRequest<{ Querystring: PostListInput }>, reply) =>
      await postController.listPublished(request, reply),
  })

  fastify.route({
    method: 'POST',
    url: '/',
    schema: postCreateSchema,
    preHandler: authMiddleware<FastifyRequest<{ Body: PostInput }>>,
    handler: async (request: FastifyRequest<{ Body: PostInput }>, reply) =>
      await postController.create(request as AuthenticatedRequest<{ Body: PostInput }>, reply),
  })

  fastify.route({
    method: 'PUT',
    url: '/',
    schema: postUpdateSchema,
    preHandler: authMiddleware<FastifyRequest<{ Body: PostUpdate }>>,
    handler: async (request: FastifyRequest<{ Body: PostUpdate }>, reply) =>
      await postController.update(request as AuthenticatedRequest<{ Body: PostUpdate }>, reply),
  })

  fastify.route({
    method: 'DELETE',
    url: '/:id',
    schema: postDeleteSchema,
    preHandler: authMiddleware<FastifyRequest<{ Params: { id: string } }>>,
    handler: async (request: FastifyRequest<{ Params: { id: string } }>, reply) =>
      await postController.delete(request as AuthenticatedRequest<{ Params: { id: string } }>, reply),
  })

  fastify.route({
    method: 'GET',
    url: '/:id',
    schema: postGetSchema,
    preHandler: async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      if (request.headers.authorization) {
        return authMiddleware<FastifyRequest<{ Params: { id: string } }>>(request, reply)
      }
    },
    handler: async (request: FastifyRequest<{ Params: { id: string } }>, reply) =>
      await postController.get(request, reply),
  })
}
