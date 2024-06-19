import { PrismaClient, Role } from '@prisma/client'
import 'dotenv/config'
import { generatePasswordHash } from '../src/utils/security'
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

  console.log('DB seeded')
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
