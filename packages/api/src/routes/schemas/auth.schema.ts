import { AuthLogin } from '../../models/auth.model'
import { RouterSchema, getReponseSchema } from './generic.schema'

export const authLoginSchema: RouterSchema<AuthLogin> = {
  tags: ['auth'],
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
    },
  },
  response: getReponseSchema('auth'),
}
