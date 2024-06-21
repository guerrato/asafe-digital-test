import { FastifyInstance } from 'fastify'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { PostService } from './services/post.service'

export const websocket = async (fastify: FastifyInstance) => {
  fastify.register(async fastify => {
    const postService = container.resolve(PostService)
    fastify.get('/', { websocket: true }, (socket, req) => {
      socket.on('open', () => {
        fastify.log.info('New client connected')
      })

      socket.on('message', async message => {
        try {
          const post = JSON.parse(message.toString())
          const likes = await postService.react(post.id, post.action)
          socket.send(JSON.stringify({ id: post.id, likes }))
        } catch (error) {
          fastify.log.error(error)
        }
      })

      socket.on('close', () => {
        fastify.log.info('Client collection closed')
      })
    })
  })
}
