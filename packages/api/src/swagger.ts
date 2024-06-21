import { FastifyInstance } from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

export const swaggerLoader = (fastify: FastifyInstance) => {
  fastify.register(fastifySwagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'A-Safe Digital Test',
        description: 'Swagger API documentation for A-Safe Digital Test',
        version: '0.1.0',
      },
      servers: [
        {
          url: 'http://127.0.0.1:3000',
          description: 'Development server',
        },
      ],
      tags: [
        { name: 'users', description: 'Users related end-points' },
        { name: 'posts', description: 'Posts related end-points' },
        { name: 'auth', description: 'Auth related end-points' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here',
      },
    },
  })

  fastify.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next()
      },
      preHandler: function (request, reply, next) {
        next()
      },
    },
    staticCSP: true,
    transformStaticCSP: (header: any) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject
    },
    transformSpecificationClone: true,
  })
}
