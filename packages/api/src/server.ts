import Fastify, { FastifyInstance } from 'fastify'
import 'dotenv/config'
import { userRoutes } from '~/routes'
import { authRoutes } from '~/routes/auth.route'

const useLogger: boolean = ['local', 'development'].includes(process.env.NODE_ENV ?? '') ? true : false

const fastify: FastifyInstance = Fastify({ logger: useLogger })
fastify.register(userRoutes, { prefix: '/users' })
fastify.register(authRoutes, {prefix: '/auth'})


export const start = async () => {
  try {
    await fastify.listen({ port: (process.env.PORT as number | undefined) || 3000, ipv6Only: false })
    const address = fastify.server.address()

    if (!address) {
      throw new Error('Server address is not available.')
    }

    if (process.env.NODE_ENV !== 'development') {
      const port = typeof address === 'string' ? address : address?.port
      console.log(`Server listening at ${port}`)
    } else {
      if (typeof address === 'string') {
        console.log(`Server listening at ${address}`)
      } else {
        let addressMessage = `\n\n\x1b[32mServer listening at\x1b[0m\n`
        for (const addr of fastify.addresses()) {
          addressMessage += `\t • http://${addr.address}:${addr.port}\n`
        }

        console.log(addressMessage)
      }
    }
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
