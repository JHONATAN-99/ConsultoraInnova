# React + TypeScript + Vite

The project is now split into two main folders:

- `frontend/`: a React + Vite application written in TypeScript.
- `backend/`: an Express/Prisma server (already present).

The original template provided a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

---

## Running the full stack 🛠️

A simple Express-based backend lives under `backend/` while the frontend code resides inside `frontend/`, allowing clear separation between client and server.

### Arquitectura del backend

La aplicación del servidor ahora sigue una estructura modular típica para un proyecto de consultoría de cursos:

```
backend/
  src/
    controllers/          # lógica de cada entidad (cursos, estudiantes)
      cursosController.ts
      estudiantesController.ts
    routes/               # definición de rutas con routers de Express
      cursos.ts
      estudiantes.ts
      index.ts            # enrutador raíz montado en /api
    models/               # tipos e interfaces TS para datos
      Curso.ts
      Estudiante.ts
    db.ts                 # almacenamiento en memoria (simula una base de datos)
    index.ts              # entrypoint que configura express y monta las rutas
  tsconfig.json
  package.json
```

- **Modelos** contienen únicamente los tipos `Curso`/`Estudiante`.
- **Controladores** reciben `Request`/`Response` y usan `db.ts` para leer/escribir.
- **Rutas** vinculan endpoints HTTP a los controladores mediante `Router`.
- `db.ts` proporciona arrays persistentes en memoria; reemplázalo más adelante por una base de datos real si lo deseas.

Esta separación facilita la extensión futura (middleware, servicios, autenticación, etc.) y establece una base profesional para la consultoría.

### Pasos para ponerlo en marcha

1. **Instala dependencias**

   Ejecuta los scripts desde la raíz para tener ambos proyectos listos:

   ```bash
   npm run frontend:install   # instala paquetes dentro de frontend/
   npm run backend:install    # instala paquetes dentro de backend/
   ```

2. **Configura la base de datos**

   El servidor usa [Prisma](https://www.prisma.io/) y puede conectarse a PostgreSQL o MySQL (u otro proveedor
   soportado).

   - Crea una base de datos en tu servidor local o en la nube.
   - Define la variable de entorno `DATABASE_URL` apuntando a ella. Ejemplos:

     ```bash
     # PostgreSQL
     export DATABASE_URL="postgresql://user:password@localhost:5432/consultora"
     # MySQL
     export DATABASE_URL="mysql://user:password@localhost:3306/consultora"
     ```

3. **Ejecuta las migraciones y el seed**

   Desde `backend/` (o usando el script raíz) corre:

   ```bash
   npm run prisma:migrate    # crea las tablas según schema.prisma
   npm run prisma:generate   # genera el cliente de Prisma
   npm run prisma:seed       # inserta cursos y usuarios iniciales en la BD
   ```

   El seed script ahora también crea usuarios de demostración (`admin@demo.com` y
   `user@demo.com`) con contraseñas hasheadas. Si vuelves a ejecutarlo después de
   editar usuarios, borra primero las filas existentes o usa un nuevo `prisma` reset.

   > **Nota:** la funcionalidad de registro crea el hash automáticamente, por lo
   que no almacenes contraseñas en texto plano.

4. **Arranca ambos servicios**

   ```bash
   npm run start
   ```

   Esto ejecuta simultáneamente el servidor en `http://localhost:3001` y Vite en 5173 con proxy `/api`.

---

## Autenticación

La aplicación ahora soporta registro e inicio de sesión **con correo y contraseña**.
Los usuarios pueden elegir un **rol** (`admin`, `user` o `gerente`) al registrarse y la
información se mantiene en cookies (`role` y `email`) para poder refrescar la
página sin perder el estado.

- **admin** puede crear y actualizar cursos/estudiantes, y asignar alumnos a
  cursos.
- **gerente** tiene acceso completo: crea, actualiza y elimina cursos,
  estudiantes, solicitudes y también puede gestionar áreas.
- **user** es el estudiante que solo puede enviar solicitudes de inscripción.

Además, los cursos se organizan por **áreas**; cada curso pertenece opcionalmente
una área y en el frontend se muestran agrupados.

- El backend expone `/api/auth/register` y `/api/auth/login`.
- Al crear un usuario la contraseña se hashea con `bcrypt` (y durante el seed
  también se utiliza hashing). Nunca guardes contraseñas en texto plano.
- El frontend muestra el formulario de registro junto al de login; elige el rol
  y el correo que quieras probar.
- Haz click en "Cerrar sesión" para eliminar las cookies y volver a la pantalla
  de autenticación.

Recuerda ejecutar `npm install` en el directorio `backend/` después de agregar
la dependencia `bcrypt`.

El resto del README se mantiene sin cambios.

   Esto ejecuta simultáneamente el servidor en `http://localhost:3001` y Vite en 5173 con proxy `/api`.

3. **Desarrollo**

   - Frontend: modifica `src/` y disfruta del HMR de Vite.
   - Backend: edita `backend/src/*`; el servidor se reinicia automáticamente gracias a `ts-node-dev`.

---

El resto del README permanece igual.

   ```bash
   npm run start
   ```

   This script uses [`concurrently`](https://www.npmjs.com/package/concurrently) to launch the backend on `http://localhost:3001` and the Vite frontend (default port 5173) simultaneously.  The frontend is configured to proxy `/api` requests transparently to the server.

3. **Development workflow**

   - Edit React components under `src/`; HMR will refresh the browser automatically.
   - Backend code lives in `backend/src/`; it runs with `ts-node-dev` so changes restart the server.

Feel free to extend the API or adjust ports; the proxy settings are controlled by `vite.config.ts`.






MIGRACION DE DATOS Y DB A LOCAL Y LEVANTAR EL PROYECTO LOS DOS EN UNO
---

## 🚀 Guía de Inicio Rápido

Para poner en marcha el proyecto con la base de datos local, sigue estos pasos en orden:

### 1. Configuración de Base de Datos (Prisma)

Antes de lanzar la aplicación, debes sincronizar el modelo de datos con tu instancia local de PostgreSQL y cargar los datos iniciales.

La base ahora también incluye usuarios (`User`): puedes registrarte desde el front-end o usar las cuentas de demostración generadas por el seed (`admin@demo.com` / `1234` y `user@demo.com` / `1234`).

* **Instalar dependencias:** `npm run backend:install` (instala Prisma y otras herramientas necesarias).
* **Crear tablas (Migración):** `npm run prisma:migrate` (lee tu `.env` y crea la estructura en Postgres).
* **Cargar datos (Seed):** `npm run prisma:seed` (inserta los cursos y estudiantes de prueba).

### 2. Ejecución del Proyecto

Una vez que la base de datos esté lista, no necesitas abrir varias terminales. Usa el comando integrado que levanta el servidor y la interfaz al mismo tiempo.

* **Levantar todo el Stack:** `npm run start`.

> **Nota:** Este comando utiliza `concurrently` para ejecutar el **Backend** (puerto 3001) y el **Frontend** (puerto 5173) simultáneamente. El frontend está configurado con un proxy para redirigir las peticiones `/api` al servidor de forma transparente.

---

**¿Te gustaría que te ayude a redactar también la sección de "Requisitos Previos" para que el README quede totalmente profesional?**