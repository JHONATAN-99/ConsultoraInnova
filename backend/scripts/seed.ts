import prisma from '../src/prismaClient'

async function main() {
  console.log('Seeding database...')

  await prisma.curso.createMany({
    data: [
      {
        nombre: 'Desarrollo Web con React',
        descripcion: 'Fundamentos de React, hooks y ecosistema moderno.',
        precio: 500,
      },
      {
        nombre: 'Python para Data Science',
        descripcion: 'Análisis de datos, NumPy, Pandas y visualización.',
        precio: 650,
      },
      {
        nombre: 'Introducción a Ciberseguridad',
        descripcion: 'Conceptos básicos de seguridad informática y buenas prácticas.',
        precio: 550,
      },
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
