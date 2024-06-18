import { User } from '@prisma/client'

export type AuthLogin = Pick<User, 'email' | 'password'>
