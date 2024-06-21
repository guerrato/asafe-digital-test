import { FastifyInstance, FastifyRequest } from 'fastify'

export { authRoutes } from '~/routes/auth.route'
export { userRoutes } from '~/routes/user.route'
export { postRoutes } from '~/routes/post.route'

export const indexRoutes = async (fastify: FastifyInstance, _: any) => {
  fastify.route({
    method: 'GET',
    url: '/health',
    handler: async (_, reply) => reply.send({ status: 'OK' }),
  })
}
