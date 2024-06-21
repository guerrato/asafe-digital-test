import { Post, Prisma, PrismaClient, Role } from '@prisma/client'
import 'dotenv/config'
import { generatePasswordHash, isEmpty } from '@asafe-digital-test/utils'
import Chance from 'chancets2'

const prisma = new PrismaClient()
async function main() {
  if (isEmpty(process.env.SECRET_KEY)) {
    throw new Error('DB_VAR_MISSING: Internal Error: Variables missing')
  }

  await prisma.user.upsert({
    where: { email: 'cto@mailinator.com' },
    update: {},
    create: {
      email: 'cto@mailinator.com',
      name: 'CTO',
      password: await generatePasswordHash('P@ssw0rd', process.env.SECRET_KEY),
      role: Role.ADMIN,
    },
  })
  const chance = new Chance()

  const date = new Date().valueOf() - 200
  const posts = Array.from({ length: 200 }).map<Prisma.PostCreateWithoutAuthorInput>((_, i) => {
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
      password: await generatePasswordHash('P@ssw0rd', process.env.SECRET_KEY),
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
