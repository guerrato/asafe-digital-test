import { FastifySchema } from 'fastify'

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
