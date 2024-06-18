import { UserInput, UserUpdate } from '~/models/user.model'
import { RouterSchema } from './generic.schema'

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
  }
}
