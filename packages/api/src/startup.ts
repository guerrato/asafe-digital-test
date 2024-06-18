import 'reflect-metadata'
import { container } from 'tsyringe'
import { IUserController, UserController } from '~/controllers/user.controller'
import { IUserService, UserService } from '~/services/user.service'
import { IUserRepository, UserRepository } from '~/repositories/user.repository'
import { DbContext } from '~/repositories/dbContext'
import { start } from '~/server'
import { AuthService, IAuthService } from './services/auth.service'
import { AuthController, IAuthController } from './controllers/auth.controller'

// Resolve Singletons
container.registerSingleton('DbContext', DbContext)

// Repositories Injection registrations
container.register<IUserRepository>('IUserRepository', UserRepository)

// Services Injection registrations
container.register<IUserService>('IUserService', UserService)
container.register<IAuthService>('IAuthService', AuthService)

// Controller Injection registrations
container.register<IUserController>('IUserController', UserController)
container.register<IAuthController>('IAuthController', AuthController)

// Start the server
start()
