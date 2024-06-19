import { UserInput, UserUpdateRole } from '~/models/user.model'
import { RouterSchema } from './generic.schema'
import { FastifySchema } from 'fastify'

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

export const userUpdateRoleSchema: RouterSchema<UserUpdateRole> = {
  body: {
    type: 'object',
    required: ['id', 'role'],
    properties: {
      id: { type: 'string' },
      role: { type: 'string' },
    },
  },
}

export const userGetDeleteSchema: FastifySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
}
