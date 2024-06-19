import 'reflect-metadata'
import { FastifyInstance, FastifyRequest } from 'fastify'
import { container } from 'tsyringe'
import { PostController } from '~/controllers/post.controller'
import { postListSchema } from './schemas/post.schema'
import { PostListInput } from '~/models/post.model'

export const postRoutes = async (fastify: FastifyInstance, _: any) => {
  const userController = container.resolve(PostController)

  fastify.route({
    method: 'GET',
    url: '/',
    schema: postListSchema,
    handler: async (request: FastifyRequest<{ Querystring: PostListInput }>, reply) =>
      await userController.listPublished(request, reply),
  })
}
