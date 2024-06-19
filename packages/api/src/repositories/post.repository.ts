import { autoInjectable, inject } from 'tsyringe'
import { Post, Prisma } from '@prisma/client'
import { DbContext } from '~/repositories/dbContext'
import { PaginatedPostReply, PostInput, PostListInput } from '~/models/post.model'

export interface IPostRepository {
  listPublished(opts: PostListInput): Promise<PaginatedPostReply>
  create(post: Prisma.PostUncheckedCreateInput): Promise<Post>
  // update(post): Promise<Post>
  // delete(id: string): Promise<void>
}

@autoInjectable()
export class PostRepository implements IPostRepository {
  constructor(@inject('DbContext') private readonly dbContext: DbContext) {}

  async listPublished(opts: PostListInput): Promise<PaginatedPostReply> {
    try {
      const searchParams = {
        where: {
          published: true,
        },
      }

      const total = await this.dbContext.post.count(searchParams)
      const posts = await this.dbContext.post.findMany({
        ...searchParams,
        skip: (opts.page - 1) * opts.limit,
        take: opts.limit,
        orderBy: {
          created_at: 'desc',
        },
      })

      return {
        posts,
        total,
        currentPage: opts.page,
        totalPages: Math.ceil(total / opts.limit),
        limit: opts.limit,
      } as PaginatedPostReply
    } catch (error) {
      throw error
    }
  }

  async create(post: Prisma.PostUncheckedCreateInput): Promise<Post> {
    try {
      return await this.dbContext.post.create({
        data: post,
      })
    } catch (error) {
      throw error
    }
  }
}
