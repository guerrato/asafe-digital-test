import 'reflect-metadata'
import { container } from 'tsyringe'
import { IUserController, UserController } from './controllers/user.controller'
import { IUserService, UserService } from './services/user.service'
import { IUserRepository, UserRepository } from './repositories/user.repository'
import { DbContext } from './repositories/dbContext'
import { AuthService, IAuthService } from './services/auth.service'
import { AuthController, IAuthController } from './controllers/auth.controller'
import { IPostRepository, PostRepository } from './repositories/post.repository'
import { IPostService, PostService } from './services/post.service'
import { IPostController, PostController } from './controllers/post.controller'

export const bootstrap = () => {
  // Resolve Singletons
  container.registerSingleton('DbContext', DbContext)

  // Repositories Injection registrations
  container.register<IUserRepository>('IUserRepository', UserRepository)
  container.register<IPostRepository>('IPostRepository', PostRepository)

  // Services Injection registrations
  container.register<IUserService>('IUserService', UserService)
  container.register<IPostService>('IPostService', PostService)
  container.register<IAuthService>('IAuthService', AuthService)

  // Controller Injection registrations
  container.register<IUserController>('IUserController', UserController)
  container.register<IPostController>('IPostController', PostController)
  container.register<IAuthController>('IAuthController', AuthController)
}
