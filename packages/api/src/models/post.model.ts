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

export type PostInput = Omit<Prisma.PostUncheckedCreateInput, 'id' | 'title_slug' | 'author_id' | 'created_at' | 'updated_at'>
