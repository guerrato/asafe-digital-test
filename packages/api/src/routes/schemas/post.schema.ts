import { FastifySchema } from 'fastify'
import { PostInput, PostUpdate } from '../../models/post.model'
import { RouterSchema, getReponseSchema } from './generic.schema'

export const postListSchema: FastifySchema = {
  description: 'List all posts. The list is paginated',
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
  description: 'Create a new post',
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
  description: 'Update a post',
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

export const postDeleteSchema: FastifySchema = {
  description: 'Delete a post',
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

export const postGetSchema: FastifySchema = {
  description: 'Get a single post',
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
