import { prisma } from '../lib/prisma'

async function main() {
  const count = await prisma.jasa.count()
  console.log('count', count)
  await prisma.$disconnect()
}

main().catch((err) => {
  console.error(err)
  return prisma.$disconnect()
})
