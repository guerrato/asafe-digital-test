import { autoInjectable, inject } from 'tsyringe'
import { Post, Prisma } from '@prisma/client'
import { IPostRepository } from '~/repositories/post.repository'
import { PaginatedPostReply, PostInput, PostListInput } from '~/models/post.model'

type PostCreateService = PostInput & { author_id: string }

export interface IPostService {
  // list(userId: string, page: number, limit: number, published?: boolean): Promise<Post[]>
  listPublished(opts: PostListInput): Promise<PaginatedPostReply>
  // listByUser(userId: string, page: number, limit: number): Promise<PostReply[]>
  create(post: PostCreateService): Promise<Post>
  // get(id: string): Promise<PostReply>
  // update(post: PostUpdate): Promise<PostReply>
  // delete(id: string): Promise<void>
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
      return await this.postRepository.create({...post, title_slug})
    } catch (error) {
      throw error
    }
  }
}
