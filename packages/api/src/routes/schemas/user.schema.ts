import { FastifySchema } from 'fastify'
import { UserInput, UserUpdateRole } from '../../models/user.model'
import { RouterSchema, getReponseSchema } from './generic.schema'

export const userCreateSchema: RouterSchema<UserInput> = {
  tags: ['users'],
  body: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
    },
  },
  response: getReponseSchema('user'),
}

export const userUpdateSchema: RouterSchema<UserInput> = {
  tags: ['users'],
  security: [{ bearerAuth: [] }],
  body: {
    type: 'object',
    required: [],
    properties: {
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
    },
  },
  response: getReponseSchema('user'),
}

export const userUpdateRoleSchema: RouterSchema<UserUpdateRole> = {
  tags: ['users'],
  security: [{ bearerAuth: [] }],
  body: {
    type: 'object',
    required: ['id', 'role'],
    properties: {
      id: { type: 'string' },
      role: { type: 'string' },
    },
  },
  response: getReponseSchema('user'),
}

export const userGetDeleteSchema: FastifySchema = {
  tags: ['users'],
  security: [{ bearerAuth: [] }],
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
  response: getReponseSchema('user'),
}
