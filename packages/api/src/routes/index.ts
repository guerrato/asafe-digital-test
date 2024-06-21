import { FastifyInstance, FastifyRequest } from 'fastify'

export { authRoutes } from './auth.route'
export { userRoutes } from './user.route'
export { postRoutes } from './post.route'

export const indexRoutes = async (fastify: FastifyInstance, _: any) => {
  fastify.route({
    method: 'GET',
    url: '/health',
    handler: async (_, reply) => reply.send({ status: 'OK' }),
  })
}
