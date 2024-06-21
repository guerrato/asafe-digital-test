import { PrismaClient, Role } from '@prisma/client'
import 'dotenv/config'
import { generatePasswordHash } from '../src/utils/security'
import Chance from 'chancets2'
const prisma = new PrismaClient()
async function main() {
  await prisma.user.upsert({
    where: { email: 'cto@mailinator.com' },
    update: {},
    create: {
      email: 'cto@mailinator.com',
      name: 'CTO',
      password: await generatePasswordHash('P@ssw0rd'),
      role: Role.ADMIN,
    },
  })
  const chance = new Chance()
  const date = new Date().valueOf() - 200
  const posts = Array.from({ length: 200 }).map((_, i) => {
    const title = `Post ${i + 1}`
    return {
      title,
      title_slug: title.toLowerCase().replace(/ /g, '-'),
      content: `Content ${i + 1}: ${chance.paragraph({ sentences: Math.ceil(Math.random() * 5) })}`,
      published: i % 2 === 0,
      created_at: new Date(date + i * 1000),
    }
  })
  await prisma.user.upsert({
    where: { email: 'john.doe@mailinator.com' },
    update: {},
    create: {
      email: 'john.doe@mailinator.com',
      name: 'John Doe',
      password: await generatePasswordHash('P@ssw0rd'),
      role: Role.WRITER,
      posts: { create: posts },
    },
  })
  console.log('DB seeded')
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
