import { Prisma, User } from '@prisma/client'

// export type UserCreate = Omit<Prisma.UserCreateInput, 'id' | 'picture' | 'created_at' | 'updated_at' | 'Post'>
export type UserInput = Omit<Prisma.UserCreateInput, 'id' | 'picture' | 'created_at' | 'updated_at' | 'Post'>
export type UserUpdate = Partial<Omit<Prisma.UserCreateInput, 'picture' | 'created_at' | 'updated_at' | 'Post'>> & {
  id: string
}
export type UserUpdateRole = Pick<User, 'id' | 'role'>
export type UserReply = Omit<User, 'id' | 'password' | 'picture' | 'Post'>
