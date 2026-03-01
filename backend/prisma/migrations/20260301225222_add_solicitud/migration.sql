-- CreateTable
CREATE TABLE "Solicitud" (
    "id" SERIAL NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "usuario" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
