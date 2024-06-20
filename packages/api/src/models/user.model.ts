import { Prisma, User } from '@prisma/client'

export type UserInput = Omit<
  Prisma.UserCreateInput,
  'id' | 'picture_path' | 'picture_name' | 'created_at' | 'updated_at' | 'Post'
>
export type UserUpdate = Partial<
  Omit<Prisma.UserCreateInput, 'picture_path' | 'picture_name' | 'created_at' | 'updated_at' | 'Post'>
>

export type UserPictureUpdate = Pick<Prisma.UserCreateInput, 'id' | 'picture_path' | 'picture_name'>

export type UserUpdateRole = Pick<User, 'id' | 'role'>
export type UserReply = Omit<User, 'id' | 'password' | 'picture' | 'Post'>
