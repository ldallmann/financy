import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const DEMO_EMAIL = 'conta@teste.com'
const DEMO_PASSWORD = '12345678'

const categories = [
  { key: 'food', title: 'Alimentação', description: 'Restaurantes, delivery e refeições', icon: 'utensils', color: 'blue' },
  { key: 'entertainment', title: 'Entretenimento', description: 'Cinema, jogos e lazer', icon: 'ticket', color: 'pink' },
  { key: 'investment', title: 'Investimento', description: 'Aplicações e retornos financeiros', icon: 'piggy-bank', color: 'green' },
  { key: 'groceries', title: 'Mercado', description: 'Compras de supermercado e mantimentos', icon: 'shopping-cart', color: 'orange' },
  { key: 'salary', title: 'Salário', description: 'Renda mensal e bonificações', icon: 'briefcase-business', color: 'green' },
  { key: 'health', title: 'Saúde', description: 'Medicamentos, consultas e exames', icon: 'heart-pulse', color: 'red' },
  { key: 'transport', title: 'Transporte', description: 'Gasolina, transporte público e viagens', icon: 'car-front', color: 'purple' },
  { key: 'utilities', title: 'Utilidades', description: 'Energia, água, internet e telefone', icon: 'tool-case', color: 'yellow' },
] as const

type CategoryKey = (typeof categories)[number]['key']

function day(monthOffset: number, dayOfMonth: number): Date {
  const now = new Date()
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + monthOffset, dayOfMonth, 12))
}

const transactions: Array<{ description: string; type: 'INCOME' | 'EXPENSE'; amount: number; date: Date; category: CategoryKey }> = [
  { description: 'Pagamento de Salário', type: 'INCOME', amount: 425000, date: day(0, 1), category: 'salary' },
  { description: 'Jantar no Restaurante', type: 'EXPENSE', amount: 8950, date: day(-1, 30), category: 'food' },
  { description: 'Posto de Gasolina', type: 'EXPENSE', amount: 10000, date: day(-1, 29), category: 'transport' },
  { description: 'Compras no Mercado', type: 'EXPENSE', amount: 15680, date: day(-1, 28), category: 'groceries' },
  { description: 'Retorno de Investimento', type: 'INCOME', amount: 34025, date: day(-1, 26), category: 'investment' },
  { description: 'Aluguel', type: 'EXPENSE', amount: 170000, date: day(-1, 26), category: 'utilities' },
  { description: 'Freelance', type: 'INCOME', amount: 250000, date: day(-1, 24), category: 'salary' },
  { description: 'Compras Jantar', type: 'EXPENSE', amount: 15000, date: day(-1, 22), category: 'groceries' },
  { description: 'Cinema', type: 'EXPENSE', amount: 8800, date: day(-1, 18), category: 'entertainment' },
  { description: 'Almoço com clientes', type: 'EXPENSE', amount: 12400, date: day(-1, 15), category: 'food' },
  { description: 'Uber para o aeroporto', type: 'EXPENSE', amount: 6250, date: day(-1, 12), category: 'transport' },
  { description: 'Conta de luz', type: 'EXPENSE', amount: 21890, date: day(-1, 10), category: 'utilities' },
  { description: 'Internet', type: 'EXPENSE', amount: 12990, date: day(-1, 8), category: 'utilities' },
  { description: 'Show', type: 'EXPENSE', amount: 9740, date: day(-1, 5), category: 'entertainment' },
  { description: 'Padaria', type: 'EXPENSE', amount: 3280, date: day(-1, 3), category: 'food' },
  { description: 'Pagamento de Salário', type: 'INCOME', amount: 425000, date: day(-1, 1), category: 'salary' },
  { description: 'Feira', type: 'EXPENSE', amount: 8420, date: day(-2, 27), category: 'groceries' },
  { description: 'Estacionamento', type: 'EXPENSE', amount: 2500, date: day(-2, 21), category: 'transport' },
  { description: 'Delivery', type: 'EXPENSE', amount: 5690, date: day(-2, 19), category: 'food' },
  { description: 'Conta de água', type: 'EXPENSE', amount: 8900, date: day(-2, 10), category: 'utilities' },
  { description: 'Café da manhã', type: 'EXPENSE', amount: 2890, date: day(-2, 6), category: 'food' },
  { description: 'Pagamento de Salário', type: 'INCOME', amount: 425000, date: day(-2, 1), category: 'salary' },
]

async function main() {
  const password = await bcrypt.hash(DEMO_PASSWORD, 10)

  const user = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: { name: 'Conta teste', password },
    create: { name: 'Conta teste', email: DEMO_EMAIL, password },
  })

  await prisma.transaction.deleteMany({ where: { userId: user.id } })
  await prisma.category.deleteMany({ where: { userId: user.id } })

  const ids: Partial<Record<CategoryKey, string>> = {}
  for (const { key, ...data } of categories) {
    const category = await prisma.category.create({ data: { ...data, userId: user.id } })
    ids[key] = category.id
  }

  await prisma.transaction.createMany({
    data: transactions.map(({ category, ...data }) => ({ ...data, categoryId: ids[category], userId: user.id })),
  })

  console.log(`Seed concluído: ${categories.length} categorias e ${transactions.length} transações para ${DEMO_EMAIL}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
