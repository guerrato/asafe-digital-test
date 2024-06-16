import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { UserController } from '~/controllers/user.controller'


async function userRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {


  fastify.get('/', async (request, reply) => {
    console.log('Hello World from routes')
  })
}

//ESM
export default userRoutes
