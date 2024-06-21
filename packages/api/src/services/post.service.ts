import { autoInjectable, inject } from 'tsyringe'
import { Post, Prisma, Role } from '@prisma/client'
import { IPostRepository } from '../repositories/post.repository'
import { PaginatedPostReply, PostInput, PostListInput, PostUpdate } from '../models/post.model'
import { isEmpty } from '@asafe-digital-test/utils'
import { AuthPayload } from '../models/auth.model'

type PostCreateService = PostInput & { author_id: string }

export interface IPostService {
  // list(userId: string, page: number, limit: number, published?: boolean): Promise<Post[]>
  listPublished(opts: PostListInput): Promise<PaginatedPostReply>
  create(post: PostCreateService): Promise<Post>
  update(post: PostUpdate, userId: string): Promise<Post>
  delete(id: string, auth: AuthPayload): Promise<void>
  get(id: string, auth?: AuthPayload): Promise<Post>
  react(id: string, reaction: 'like' | 'dislike'): Promise<number>
}

@autoInjectable()
export class PostService implements IPostService {
  constructor(@inject('IPostRepository') private readonly postRepository: IPostRepository) {}

  async listPublished(opts: PostListInput): Promise<PaginatedPostReply> {
    try {
      return await this.postRepository.listPublished(opts)
    } catch (error) {
      throw error
    }
  }

  async create(post: PostCreateService): Promise<Post> {
    try {
      const title_slug = post.title.replace(/ /g, '-').toLowerCase()
      return await this.postRepository.create({ ...post, title_slug })
    } catch (error) {
      throw error
    }
  }

  async update(post: PostUpdate, userId: string): Promise<Post> {
    if (isEmpty(post.id)) {
      throw new Error('Post not found')
    }

    const existingPost = await this.postRepository.findById(post.id)
    if (!existingPost) {
      throw new Error('Post not found')
    }

    if (existingPost.author_id !== userId) {
      throw new Error('SRV_UNAUTHORIZED: Unauthorized')
    }

    if (!isEmpty(post.title)) {
      existingPost.title = post.title
      existingPost.title_slug = post.title.replace(/ /g, '-').toLowerCase()
    }

    if (!isEmpty(post.content)) {
      existingPost.content = post.content
    }

    if (!isEmpty(post.published) && existingPost.published !== post.published) {
      existingPost.published = post.published
    }

    return await this.postRepository.update({ ...existingPost })
  }

  async delete(id: string, auth: AuthPayload): Promise<void> {
    try {
      const post = await this.postRepository.findById(id)
      if (!post) {
        throw new Error('Post not found')
      }

      if (auth.role !== Role.ADMIN && post.author_id !== auth.id) {
        throw new Error('SRV_UNAUTHORIZED: Unauthorized')
      }

      await this.postRepository.delete(id)
    } catch (error) {
      throw error
    }
  }

  async get(id: string, auth?: AuthPayload): Promise<Post> {
    try {
      const post = await this.postRepository.findById(id)
      if (!post) {
        throw new Error('Post not found')
      }

      if (post.published === false && auth?.role !== Role.ADMIN && post.author_id !== auth?.id) {
        throw new Error('SRV_UNAUTHORIZED: Unauthorized')
      }

      return post
    } catch (error) {
      throw error
    }
  }

  async react(id: string, reaction: 'like' | 'dislike'): Promise<number> {
    try {
      return await this.postRepository.react(id, reaction)
    } catch (error) {
      throw error
    }
  }
}
