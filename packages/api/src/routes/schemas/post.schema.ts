import { FastifySchema } from 'fastify'
import { PostInput } from '~/models/post.model'
import { RouterSchema } from './generic.schema'

export const postListSchema: FastifySchema = {
  querystring: {
    type: 'object',
    required: ['limit', 'page'],
    properties: {
      page: { type: 'number' },
      limit: { type: 'number' },
    },
  },
}

export const postCreateSchema: RouterSchema<PostInput> = {
  body: {
    type: 'object',
    required: ['title', 'content'],
    properties: {
      title: { type: 'string' },
      content: { type: 'string' },
      published: { type: 'boolean' },
    },
  },
}
