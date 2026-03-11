/*
  Warnings:

  - The values [transaccion] on the enum `TipoPago` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `precio` to the `Curso` table without a default value. This is not possible if the table is not empty.
  - Added the required column `montoTotal` to the `Inscripcion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TipoPago_new" AS ENUM ('efectivo', 'transferencia');
ALTER TABLE "Pago" ALTER COLUMN "tipoPago" TYPE "TipoPago_new" USING ("tipoPago"::text::"TipoPago_new");
ALTER TYPE "TipoPago" RENAME TO "TipoPago_old";
ALTER TYPE "TipoPago_new" RENAME TO "TipoPago";
DROP TYPE "TipoPago_old";
COMMIT;

-- AlterTable
ALTER TABLE "Curso" ADD COLUMN     "precio" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Inscripcion" ADD COLUMN     "montoPagado" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "montoTotal" DOUBLE PRECISION NOT NULL;
