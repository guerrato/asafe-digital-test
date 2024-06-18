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
}

export { userCreateSchema } from './user.schema'
