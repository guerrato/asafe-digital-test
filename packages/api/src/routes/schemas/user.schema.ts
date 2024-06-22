import { FastifySchema } from 'fastify'
import { UserInput, UserUpdateRole } from '../../models/user.model'
import { RouterSchema, getReponseSchema } from './generic.schema'

export const userCreateSchema: RouterSchema<UserInput> = {
  description: 'Creates a new user.',
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
  description: 'Updates user data.',
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
  description: 'For user ADMIN role only: Updates user role.',
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

export const userDeleteSchema: FastifySchema = {
  description: 'Delete a user.',
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

export const userGetSchema: FastifySchema = {
  description: 'Get a single user.',
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
