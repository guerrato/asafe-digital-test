import Fastify, { FastifyInstance } from 'fastify'
import 'dotenv/config'

import { fastifyMultipart } from '@fastify/multipart'
import fastifyWebsocket from '@fastify/websocket'
import { authRoutes, postRoutes, userRoutes } from '~/routes'
import { websocket } from '~/websocket'

// import { websocketRoutes } from '~/websocket'

const useLogger: boolean = ['local', 'development'].includes(process.env.NODE_ENV ?? '') ? true : false

const fastify: FastifyInstance = Fastify({ logger: useLogger })

const multipartOpts = {
  attachFieldsToBody: true,
  sharedSchemaId: '#userPictureSchema',
}

fastify.register(fastifyMultipart, multipartOpts)
fastify.register(fastifyWebsocket)
websocket(fastify)

// fastify.register(websocketRoutes)
fastify.register(userRoutes, { prefix: '/users' })
fastify.register(authRoutes, { prefix: '/auth' })
fastify.register(postRoutes, { prefix: '/posts' })

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
