import 'reflect-metadata'
import { FastifyInstance, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { PostController } from '~/controllers/post.controller'
import { postCreateSchema, postListSchema } from './schemas/post.schema'
import { PostInput, PostListInput } from '~/models/post.model'
import { authMiddleware } from '~/middleware/auth.middleware'
import { AuthenticatedRequest } from '~/models/auth.model'

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
}
