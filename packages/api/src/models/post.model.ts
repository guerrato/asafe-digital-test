import { Post, Prisma } from '@prisma/client'

export type PaginatedPostReply = {
  posts: Post[]
  total: number
  currentPage: number
  totalPages: number
  limit: number
}
export type PostListInput = {
  page: number
  limit: number
}
export type PostInput = Omit<Prisma.PostCreateInput, 'id' | 'picture' | 'created_at' | 'updated_at' | 'Post'>
export type PostUpdate = Partial<Omit<Prisma.PostCreateInput, 'picture' | 'created_at' | 'updated_at' | 'Post'>>
