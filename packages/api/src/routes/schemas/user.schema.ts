import { UserCreate } from '~/models/user.model'
import { RouterSchema } from './generic.schema'

export const userCreateSchema: RouterSchema<UserCreate> = {
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
