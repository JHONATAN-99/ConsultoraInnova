import prisma from '../src/prismaClient'
import bcrypt from 'bcrypt'

async function main() {
  console.log('Seeding database...')

  // create some areas first
  const webArea = await prisma.area.create({ data: { nombre: 'Desarrollo web' } })
  const dataArea = await prisma.area.create({ data: { nombre: 'Data Science' } })
  const securityArea = await prisma.area.create({ data: { nombre: 'Ciberseguridad' } })

  await prisma.curso.createMany({
    data: [
      {
        nombre: 'Desarrollo Web con React',
        descripcion: 'Fundamentos de React, hooks y ecosistema moderno.',
        precio: 500,
        areaId: webArea.id,
      },
      {
        nombre: 'Python para Data Science',
        descripcion: 'Análisis de datos, NumPy, Pandas y visualización.',
        precio: 650,
        areaId: dataArea.id,
      },
      {
        nombre: 'Introducción a Ciberseguridad',
        descripcion: 'Conceptos básicos de seguridad informática y buenas prácticas.',
        precio: 550,
        areaId: securityArea.id,
      },
    ],
  })

  // crear usuarios demo con contraseñas hasheadas
  const adminHash = await bcrypt.hash('1234', 10)
  const userHash = await bcrypt.hash('1234', 10)

  await prisma.user.createMany({
    data: [
      { email: 'admin@demo.com', password: adminHash, role: 'admin' },
      { email: 'user@demo.com', password: userHash, role: 'user' },
      { email: 'gerente@demo.com', password: adminHash, role: 'gerente' },
    ],
  })

  console.log('Seed finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
