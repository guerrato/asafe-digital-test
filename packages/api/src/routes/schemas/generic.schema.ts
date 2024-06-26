import { FastifySchema } from 'fastify'

export type RouterSchema<T> = FastifySchema & {
  body: {
    type: 'object'
    required?: Array<keyof T>
    properties: {
      [Property in keyof T]: {
        type: string
        format?: string
      }
    }
  }
  response?: FastifySchema['response']
}

type ResponseType = 'user' | 'userList' | 'auth' | 'post' | 'postList'

export const getReponseSchema = (type: ResponseType) => {
  const responseSchema: any = {
    '2xx': {
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: { type: 'object' },
        error: { type: 'string' },
      },
    },
    '4xx': {
      properties: {
        success: { type: 'boolean', default: false },
        message: { type: 'string' },
        data: { default: null },
        error: { type: 'string' },
      },
    },
    '5xx': {
      properties: {
        success: { type: 'boolean', default: false },
        message: { type: 'string' },
        data: { default: null },
        error: { type: 'string' },
      },
    },
  }

  switch (type) {
    case 'user':
      responseSchema['2xx'].properties.data = {
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          picture_path: { type: 'string' },
          picture_name: { type: 'string' },
          role: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      }
      break
    case 'userList':
      responseSchema['2xx'].properties.data = {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            picture_path: { type: 'string' },
            picture_name: { type: 'string' },
            role: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
      }
      break
    case 'auth':
      responseSchema['2xx'].properties.data = { type: 'string' }
      break
    case 'post':
      responseSchema['2xx'].properties.data = {
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          content: { type: 'string' },
          published: { type: 'boolean' },
          likes: { type: 'number' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      }
      break
    case 'postList':
      responseSchema['2xx'].properties.data = {
        total: { type: 'number' },
        currentPage: { type: 'number' },
        totalPages: { type: 'number' },
        limit: { type: 'number' },
        posts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              content: { type: 'string' },
              published: { type: 'boolean' },
              likes: { type: 'number' },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' },
            },
          },
        },
      }
      break
  }

  return responseSchema
}
