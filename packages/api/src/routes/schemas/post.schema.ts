import { FastifySchema } from 'fastify'
import { PostInput, PostUpdate } from '~/models/post.model'
import { RouterSchema, getReponseSchema } from './generic.schema'

export const postListSchema: FastifySchema = {
  tags: ['posts'],
  querystring: {
    type: 'object',
    required: ['limit', 'page'],
    properties: {
      page: { type: 'number' },
      limit: { type: 'number' },
    },
  },
  response: getReponseSchema('postList'),
}

export const postCreateSchema: RouterSchema<PostInput> = {
  tags: ['posts'],
  security: [{ bearerAuth: [] }],
  body: {
    type: 'object',
    required: ['title', 'content'],
    properties: {
      title: { type: 'string' },
      content: { type: 'string' },
      published: { type: 'boolean' },
    },
  },
  response: getReponseSchema('post'),
}

export const postUpdateSchema: RouterSchema<PostUpdate> = {
  tags: ['posts'],
  security: [{ bearerAuth: [] }],
  body: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      content: { type: 'string' },
      published: { type: 'boolean' },
    },
  },
  response: getReponseSchema('post'),
}

export const postGetDeleteSchema: FastifySchema = {
  tags: ['posts'],
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
  response: getReponseSchema('post'),
}
