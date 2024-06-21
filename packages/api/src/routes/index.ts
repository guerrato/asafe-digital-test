import { FastifyInstance, FastifyRequest } from 'fastify'
import { getReponseSchema } from './schemas/generic.schema'

export { authRoutes } from './auth.route'
export { userRoutes } from './user.route'
export { postRoutes } from './post.route'

export const indexRoutes = async (fastify: FastifyInstance, _: any) => {
  fastify.route({
    method: 'GET',
    url: '/health',
    schema: {
      response: {
        '2xx': {
          properties: {
            status: { type: 'string' },
          },
        },
      },
    },
    handler: async (_, reply) => reply.send({ status: 'OK' }),
  })
}
