
import { AuthLogin } from '~/models/auth.model'
import { RouterSchema } from './generic.schema'

export const authLoginSchema: RouterSchema<AuthLogin> = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
    },
  },
}
