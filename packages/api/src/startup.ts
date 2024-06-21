import 'reflect-metadata'
import { container } from 'tsyringe'
import Fastify, { FastifyInstance } from 'fastify'
import 'dotenv/config'
import { fastifyMultipart } from '@fastify/multipart'
import fastifyWebsocket from '@fastify/websocket'
import cors from '@fastify/cors'
import { authRoutes, indexRoutes, postRoutes, userRoutes } from './routes'
import { websocket } from './websocket'
import { swaggerLoader } from './swagger'

import { IUserController, UserController } from './controllers/user.controller'
import { IUserService, UserService } from './services/user.service'
import { IUserRepository, UserRepository } from './repositories/user.repository'
import { DbContext } from './repositories/dbContext'
import { AuthService, IAuthService } from './services/auth.service'
import { AuthController, IAuthController } from './controllers/auth.controller'
import { IPostRepository, PostRepository } from './repositories/post.repository'
import { IPostService, PostService } from './services/post.service'
import { IPostController, PostController } from './controllers/post.controller'

export const bootstrap = () => {
  // Resolve Singletons
  container.registerSingleton('DbContext', DbContext)

  // Repositories Injection registrations
  container.register<IUserRepository>('IUserRepository', UserRepository)
  container.register<IPostRepository>('IPostRepository', PostRepository)

  // Services Injection registrations
  container.register<IUserService>('IUserService', UserService)
  container.register<IPostService>('IPostService', PostService)
  container.register<IAuthService>('IAuthService', AuthService)

  // Controller Injection registrations
  container.register<IUserController>('IUserController', UserController)
  container.register<IPostController>('IPostController', PostController)
  container.register<IAuthController>('IAuthController', AuthController)
}

export const buildServer = async (): Promise<FastifyInstance> => {
  bootstrap()

  const useLogger: boolean = ['local', 'development'].includes(process.env.NODE_ENV ?? '') ? true : false
  const fastify: FastifyInstance = Fastify({
    logger: useLogger,
    ajv: {
      plugins: [require('@fastify/multipart').ajvFilePlugin],
    },
  })
  try {
    const multipartOpts = {
      attachFieldsToBody: true,
      sharedSchemaId: '#userPictureSchema',
    }

    fastify.register(cors, { origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] }) // In real world, you should specify the origin
    fastify.register(fastifyMultipart, multipartOpts)
    fastify.register(fastifyWebsocket)

    swaggerLoader(fastify)
    websocket(fastify)
    fastify.register(indexRoutes)
    fastify.register(userRoutes, { prefix: '/users' })
    fastify.register(authRoutes, { prefix: '/auth' })
    fastify.register(postRoutes, { prefix: '/posts' })

    return fastify
  } catch (err) {
    throw err
  }
}

export const init = async () => {
  let fastify: FastifyInstance
  try {
    bootstrap()
    fastify = await buildServer()
    await fastify.listen({ port: (process.env.PORT as number | undefined) || 3000, ipv6Only: false })
    const address = fastify.server.address()

    if (!address) {
      throw new Error('Server address is not available.')
    }

    if (process.env.NODE_ENV !== 'test') {
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
    }
    return fastify
  } catch (err) {
    console.log((err as Error).message)
    process.exit(1)
  }
}
