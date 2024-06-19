import { autoInjectable, inject } from 'tsyringe'
import { Post } from '@prisma/client'
import { IPostRepository } from '~/repositories/post.repository'
import { PaginatedPostReply, PostListInput } from '~/models/post.model'

export interface IPostService {
  // list(userId: string, page: number, limit: number, published?: boolean): Promise<Post[]>
  listPublished(opts: PostListInput): Promise<PaginatedPostReply>
  // listByUser(userId: string, page: number, limit: number): Promise<PostReply[]>
  // create(post: PostInput): Promise<PostReply>
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
  
  
}
