import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  const passwordHash = await bcrypt.hash('senha123', 12)

  const demo = await prisma.user.upsert({
    where: { email: 'demo@deliveryhub.com.br' },
    update: {},
    create: {
      name: 'Usuário Demo',
      email: 'demo@deliveryhub.com.br',
      passwordHash,
    },
  })

  await prisma.searchHistory.createMany({
    data: [
      { userId: demo.id, query: 'hambúrguer', results: 14 },
      { userId: demo.id, query: 'pizza', results: 21 },
      { userId: demo.id, query: 'sushi', results: 8 },
    ],
    skipDuplicates: true,
  })

  await prisma.favorite.createMany({
    data: [
      {
        userId: demo.id,
        providerSlug: 'ifood',
        restaurantExtId: 'mcdonalds-sp-01',
        restaurantName: "McDonald's",
        category: 'Fast Food',
      },
      {
        userId: demo.id,
        providerSlug: '99food',
        restaurantExtId: 'outback-sp-01',
        restaurantName: 'Outback Steakhouse',
        category: 'Carnes',
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Seed concluído!')
  console.log('\n📧 demo@deliveryhub.com.br / senha123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
