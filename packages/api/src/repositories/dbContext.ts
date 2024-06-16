import { PrismaClient } from '@prisma/client'
import { singleton } from 'tsyringe'

@singleton()
export class DbContext extends PrismaClient{
  public readonly prisma: PrismaClient
  constructor() {
    super()
    this.prisma = new PrismaClient()
  }
}
