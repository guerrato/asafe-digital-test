import { FastifyReply, FastifyRequest } from 'fastify'
import { autoInjectable, inject } from 'tsyringe'
import { AuthenticatedRequest } from '../models/auth.model'
import { PostInput, PostListInput, PostUpdate } from '../models/post.model'
import { IPostService } from '../services/post.service'
import { httpResponse } from '@asafe-digital-test/utils'

export interface IPostController {
  listPublished(request: FastifyRequest<{ Querystring: PostListInput }>, reply: FastifyReply): Promise<void>
  create(request: AuthenticatedRequest<{ Body: PostInput }>, reply: FastifyReply): Promise<void>
  update(request: AuthenticatedRequest<{ Body: PostUpdate }>, reply: FastifyReply): Promise<void>
  delete(request: AuthenticatedRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void>
  get(request: AuthenticatedRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void>
}

@autoInjectable()
export class PostController implements IPostController {
  constructor(@inject('IPostService') private readonly postService: IPostService) {}

  async listPublished(request: FastifyRequest<{ Querystring: PostListInput }>, reply: FastifyReply): Promise<void> {
    try {
      const posts = await this.postService.listPublished(request.query)
      reply.code(200).send(httpResponse({ data: posts }))
    } catch (error) {
      reply.send({ error: (error as Error).message })
    }
  }

  async create(request: AuthenticatedRequest<{ Body: PostInput }>, reply: FastifyReply): Promise<void> {
    try {
      const { auth, ...post } = request.body
      const posts = await this.postService.create({ ...post, author_id: auth.id })
      reply.code(200).send(httpResponse({ data: posts }))
    } catch (error) {
      reply.send({ error: (error as Error).message })
    }
  }

  async update(request: AuthenticatedRequest<{ Body: PostUpdate }>, reply: FastifyReply): Promise<void> {
    try {
      const { auth, ...data } = request.body
      const posts = await this.postService.update(data, auth.id)
      reply.code(200).send(httpResponse({ data: posts }))
    } catch (error) {
      reply.send({ error: (error as Error).message })
    }
  }

  async delete(request: AuthenticatedRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
    try {
      await this.postService.delete(request.params.id, request.body.auth)
      reply.code(200).send(httpResponse({ message: 'Post deleted' }))
    } catch (error) {
      reply.send({ error: (error as Error).message })
    }
  }

  async get(
    request: AuthenticatedRequest<{ Params: { id: string } }> | FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { auth } = (request.body as any) || {}
      const post = await this.postService.get(request.params.id, auth)
      reply.code(200).send(httpResponse({ data: post }))
    } catch (error) {
      reply.send({ error: (error as Error).message })
    }
  }
}
