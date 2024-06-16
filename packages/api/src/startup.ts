import 'reflect-metadata'
import { container } from 'tsyringe'
import { IUserController, UserController } from '~/controllers/user.controller'
import { IUserService, UserService } from '~/services/user.service'
import { IUserRepository, UserRepository } from '~/repositories/user.repository'
import { DbContext } from '~/repositories/dbContext'
import { start } from '~/server'
import { PrismaClient } from '@prisma/client'

// Resolve Singletons
container.registerSingleton('DbContext', DbContext)

// Repositories Injection registrations
container.register<IUserRepository>('IUserRepository', UserRepository)

// Services Injection registrations
container.register<IUserService>('IUserService', UserService)

// Controller Injection registrations
container.register<IUserController>('IUserController', UserController)

const userController = container.resolve(UserController)
userController.findMany().then(console.log)

// Start the server
// start()
