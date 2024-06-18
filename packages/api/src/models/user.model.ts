import { Prisma, User } from '@prisma/client'

export type UserCreate = Omit<Prisma.UserCreateInput, 'id' | 'created_at' | 'updated_at' | 'Post'>
export type UserReply = Omit<User, 'id' | 'password' | 'picture' | 'Post'>
