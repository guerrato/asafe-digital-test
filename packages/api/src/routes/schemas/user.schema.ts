import { UserInput, UserUpdate } from '~/models/user.model'
import { RouterSchema } from './generic.schema'
import { FastifyRequest, FastifySchema } from 'fastify'

export const userCreateSchema: RouterSchema<UserInput> = {
  body: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
    },
  },
}

export const userUpdateSchema: RouterSchema<UserInput> = {
  body: {
    type: 'object',
    required: [],
    properties: {
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
    },
  },
}

export const userDeleteSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
}
