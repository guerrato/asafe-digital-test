import { autoInjectable, inject } from 'tsyringe'
import { Post, Prisma } from '@prisma/client'
import { DbContext } from '../repositories/dbContext'
import { PaginatedPostReply, PostListInput, PostUpdate } from '../models/post.model'

export interface IPostRepository {
  listPublished(opts: PostListInput): Promise<PaginatedPostReply>
  create(post: Prisma.PostUncheckedCreateInput): Promise<Post>
  findById(id: string): Promise<Post | null>
  update(post: PostUpdate): Promise<Post>
  delete(id: string): Promise<void>
  react(id: string, reaction: 'like' | 'dislike'): Promise<number>
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

  async update(post: PostUpdate): Promise<Post> {
    try {
      const { id, ...data } = post

      return await this.dbContext.prisma.post.update({
        where: { id },
        data,
      })
    } catch (error) {
      throw error
    }
  }

  async findById(id: string): Promise<Post | null> {
    try {
      return await this.dbContext.prisma.post.findUnique({
        where: { id },
      })
    } catch (error) {
      throw error
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.dbContext.prisma.post.delete({
        where: { id },
      })
    } catch (error) {
      throw error
    }
  }

  async react(id: string, reaction: 'like' | 'dislike'): Promise<number> {
    const reactionType = reaction === 'like' ? { increment: 1 } : { decrement: 1 }
    try {
      const { likes } = await this.dbContext.prisma.post.update({
        where: { id },
        data: {
          likes: reactionType,
        },
      })

      return likes
    } catch (error) {
      throw error
    }
  }
}
