import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

  // USERS
  await prisma.user.createMany({
    data: [
      {
        email: "admin@demo.com",
        password: "1234",
        role: "administrador",
      },
      {
        email: "gerente@demo.com",
        password: "1234",
        role: "gerente",
      },
    ],
    skipDuplicates: true,
  })

  // AREAS
  const leyes = await prisma.area.create({
    data: { nombre: "Leyes en Salud" },
  })

  const programas = await prisma.area.create({
    data: { nombre: "Programas en Salud" },
  })

  const sistemas = await prisma.area.create({
    data: { nombre: "Sistemas en Salud" },
  })

  const gestion = await prisma.area.create({
    data: { nombre: "Gestión Pública" },
  })

  const ofimatica = await prisma.area.create({
    data: { nombre: "Ofimática" },
  })

  const idiomas = await prisma.area.create({
    data: { nombre: "Idiomas" },
  })

  const otros = await prisma.area.create({
    data: { nombre: "Otros" },
  })

  const financiera = await prisma.area.create({
    data: { nombre: "Área Financiera" },
  })

  // CURSOS LEYES EN SALUD
  await prisma.curso.createMany({
    data: [
      { nombre: "LEY Nº 1152 SUS", precio: 200, areaId: leyes.id },
      { nombre: "LEY Nº 475", precio: 200, areaId: leyes.id },
      { nombre: "POLITICAS SAFCI", precio: 200, areaId: leyes.id },
      { nombre: "LEY Nº 3131", precio: 200, areaId: leyes.id },
      { nombre: "LEY Nº 1737", precio: 200, areaId: leyes.id },
      { nombre: "PRIMEROS AUXILIOS", precio: 200, areaId: leyes.id },
      { nombre: "URGENCIAS Y EMERGENCIAS MEDICAS", precio: 200, areaId: leyes.id },
      { nombre: "NORMAS DE BIOSEGURIDAD", precio: 200, areaId: leyes.id },
      { nombre: "REGLAMENTO GENERAL DE HOSPITALES", precio: 200, areaId: leyes.id },
      { nombre: "RNVE 2.0", precio: 200, areaId: leyes.id },
    ],
  })

  // PROGRAMAS EN SALUD
  await prisma.curso.createMany({
    data: [
      { nombre: "SALMI", precio: 200, areaId: programas.id },
      { nombre: "SOAPS", precio: 200, areaId: programas.id },
      { nombre: "SIAL", precio: 200, areaId: programas.id },
      { nombre: "SNIS – VE", precio: 200, areaId: programas.id },
      { nombre: "PAI", precio: 200, areaId: programas.id },
      { nombre: "DENGUE", precio: 200, areaId: programas.id },
      { nombre: "RABIA", precio: 200, areaId: programas.id },
      { nombre: "FIEBRE AMARILLA", precio: 200, areaId: programas.id },
      { nombre: "ZIKA", precio: 200, areaId: programas.id },
      { nombre: "TUBERCULOSIS", precio: 200, areaId: programas.id },
    ],
  })

  // SISTEMAS EN SALUD
  await prisma.curso.createMany({
    data: [
      { nombre: "SICE", precio: 200, areaId: sistemas.id },
      { nombre: "SIAF", precio: 200, areaId: sistemas.id },
      { nombre: "SICOFS", precio: 200, areaId: sistemas.id },
      { nombre: "SIP", precio: 200, areaId: sistemas.id },
    ],
  })

  // OFIMATICA
  await prisma.curso.createMany({
    data: [
      { nombre: "WINDOWS", precio: 150, areaId: ofimatica.id },
      { nombre: "WORD", precio: 150, areaId: ofimatica.id },
      { nombre: "EXCEL", precio: 150, areaId: ofimatica.id },
      { nombre: "POWER POINT", precio: 150, areaId: ofimatica.id },
      { nombre: "PUBLISHER", precio: 150, areaId: ofimatica.id },
    ],
  })

  // IDIOMAS
  await prisma.curso.createMany({
    data: [
      { nombre: "QUECHUA", precio: 250, areaId: idiomas.id },
      { nombre: "AYMARA", precio: 250, areaId: idiomas.id },
      { nombre: "INGLES", precio: 250, areaId: idiomas.id },
    ],
  })

  // OTROS
  await prisma.curso.createMany({
    data: [
      { nombre: "ORATORIA Y LIDERAZGO", precio: 200, areaId: otros.id },
      { nombre: "CLASES VACACIONAL", precio: 200, areaId: otros.id },
    ],
  })

  // AREA FINANCIERA
  await prisma.curso.createMany({
    data: [
      { nombre: "DETECCION DE BILLETES FALSOS", precio: 250, areaId: financiera.id },
      { nombre: "CAJEROS", precio: 250, areaId: financiera.id },
      { nombre: "ATENCION AL CLIENTE", precio: 250, areaId: financiera.id },
      { nombre: "OFICIAL DE CREDITOS", precio: 250, areaId: financiera.id },
    ],
  })

  console.log("Seed completado 🚀")
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())