/*
  Warnings:

  - The values [admin,user] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `descripcion` on the `Curso` table. All the data in the column will be lost.
  - You are about to drop the column `duracionSemanas` on the `Curso` table. All the data in the column will be lost.
  - You are about to drop the column `precio` on the `Curso` table. All the data in the column will be lost.
  - You are about to drop the column `apellido` on the `Estudiante` table. All the data in the column will be lost.
  - You are about to drop the column `cursoId` on the `Estudiante` table. All the data in the column will be lost.
  - You are about to drop the column `montoInicial` on the `Estudiante` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `Estudiante` table. All the data in the column will be lost.
  - You are about to drop the `Solicitud` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[ci]` on the table `Estudiante` will be added. If there are existing duplicate values, this will fail.
  - Made the column `areaId` on table `Curso` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `apellidos` to the `Estudiante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ci` to the `Estudiante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombres` to the `Estudiante` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Modalidad" AS ENUM ('certificado', 'examen');

-- CreateEnum
CREATE TYPE "TipoPago" AS ENUM ('efectivo', 'transaccion');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('administrador', 'gerente');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Curso" DROP CONSTRAINT "Curso_areaId_fkey";

-- DropForeignKey
ALTER TABLE "Estudiante" DROP CONSTRAINT "Estudiante_cursoId_fkey";

-- DropForeignKey
ALTER TABLE "Solicitud" DROP CONSTRAINT "Solicitud_cursoId_fkey";

-- AlterTable
ALTER TABLE "Curso" DROP COLUMN "descripcion",
DROP COLUMN "duracionSemanas",
DROP COLUMN "precio",
ADD COLUMN     "fechaEmisionCert" TIMESTAMP(3),
ALTER COLUMN "areaId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Estudiante" DROP COLUMN "apellido",
DROP COLUMN "cursoId",
DROP COLUMN "montoInicial",
DROP COLUMN "nombre",
ADD COLUMN     "apellidos" TEXT NOT NULL,
ADD COLUMN     "ci" TEXT NOT NULL,
ADD COLUMN     "departamento" TEXT,
ADD COLUMN     "nombres" TEXT NOT NULL,
ADD COLUMN     "prefijo" TEXT,
ADD COLUMN     "profesion" TEXT,
ADD COLUMN     "telefono" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- DropTable
DROP TABLE "Solicitud";

-- CreateTable
CREATE TABLE "Inscripcion" (
    "id" SERIAL NOT NULL,
    "estudianteId" INTEGER NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "modalidad" "Modalidad" NOT NULL,
    "nota" DOUBLE PRECISION,
    "completado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Inscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" SERIAL NOT NULL,
    "inscripcionId" INTEGER NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipoPago" "TipoPago" NOT NULL,
    "comprobante" TEXT,
    "recibo" TEXT,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificado" (
    "id" SERIAL NOT NULL,
    "inscripcionId" INTEGER NOT NULL,
    "fechaEmision" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certificado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Certificado_inscripcionId_key" ON "Certificado"("inscripcionId");

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_ci_key" ON "Estudiante"("ci");

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Estudiante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inscripcion" ADD CONSTRAINT "Inscripcion_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_inscripcionId_fkey" FOREIGN KEY ("inscripcionId") REFERENCES "Inscripcion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificado" ADD CONSTRAINT "Certificado_inscripcionId_fkey" FOREIGN KEY ("inscripcionId") REFERENCES "Inscripcion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
