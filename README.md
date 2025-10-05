# MedCore Monorepo

Estado actual y guía rápida para el equipo.

## Stack
- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript + Prisma + JWT + Nodemailer

Nota: El requerimiento especifica Next.js 14 + TS + Tailwind para el Frontend. El proyecto actual usa Vite (SPA). Abajo se incluye un plan de migración sugerido si se decide adoptar Next.js.

## Cómo correr

### Backend
- Requisitos: Node 18+, PostgreSQL/MySQL/SQLite según configuración de Prisma, variables de entorno.
- Variables de entorno (archivo `backend/.env`):
  - `PORT=3000`
  - `DATABASE_URL=...` (Prisma)
  - `SECRET=...` (JWT)
  - `SMTP_USER=...` (Gmail)
  - `SMTP_PASS=...` (si usas Gmail App Password: 16 caracteres sin espacios)
  - `SMTP_HOST`/`SMTP_PORT`/`SMTP_SECURE` (opcional, si usas SMTP propio)
  - `EMAIL_ENABLED=true` (pon `false` en dev para omitir envío y evitar 500)
- Comandos:
  - `cd backend`
  - `npm install`
  - `npm run dev` (desarrollo)

### Frontend
- Requisitos: Node 18+
- Variables de entorno (archivo `frontend/.env` opcional):
  - `VITE_API_BASE=http://localhost:3000/api/v1`
  - `VITE_DISABLE_AUTH=false` (si `true`, desactiva las restricciones de autenticación/roles para pruebas)
- Comandos:
  - `cd frontend`
  - `npm install`
  - `npm run dev`

## Cobertura de Requisitos (Frontend)

- Tecnología Next.js 14 + TS + Tailwind:
  - Actual: React + Vite + TS + Tailwind (no Next.js). Pendiente migración para cumplir con Next.js 14.

- Landing Page inicial:
  - Existe `frontend/src/pages/Home.tsx`.
  - Botón de registro en landing: deshabilitado/oculto. Se añadió CTA de "Iniciar sesión".

- Acceso a Login:
  - Acceso directo desde landing y desde el icono de usuario en `Navbar`.

- Formulario de Login:
  - Muestra errores de autenticación.
  - Se implementó alternancia de contraseña mostrar/ocultar.

- Verificación de Código:
  - Vista implementada en `frontend/src/pages/VerifyEmail.tsx`.
  - El correo de verificación llega con estilos (backend `backend/src/config/emailConfig.ts`).

- Dashboard y Roles:
  - Vistas: `AdminDashboard`, `PatientDashboard`, `MedicoDashboard` (nueva).
  - Rutas con guard por rol: `RoleRoute` en `frontend/src/components/RoleRoute.tsx`.
  - Nota: El backend aún no retorna `role` en el objeto `user`. Las rutas de rol redirigen a `/dashboard` si no hay rol. Cuando el backend exponga `role`, quedará plenamente funcional.

- Navegación y Sesión:
  - Sidebar presente con opciones. Se agregó toggle responsive (mobile) con overlay.
  - Cerrar Sesión: opción disponible en `AuthStatus`. Al cerrar sesión:
    - Se limpian datos en Local Storage.
    - Redirige a la landing page (`/`).

- UX/UI y Responsive:
  - Diseño con Tailwind responsive para mobile (<640px), tablet (640–1024px) y desktop (>1024px).
  - Se añadieron botones de menú en mobile para abrir la sidebar.

## Puntos Técnicos Clave

- Limpieza de sesión: `frontend/src/context/AuthContext.tsx` → `logout()` ahora hace `localStorage.clear()` y redirige a `/`.
- Toggle de contraseña: `frontend/src/pages/Login.tsx`.
- Toggle de sidebar:
  - Componentes: `frontend/src/components/Sidebar.tsx` (acepta `open` y `onClose`).
  - Uso en páginas: `Dashboard.tsx`, `PatientDashboard.tsx`, `MedicoDashboard.tsx`, `AdminDashboard.tsx` (overlay en mobile).
- Rutas de roles: `frontend/src/components/RoleRoute.tsx`.

## Qué falta para 100% de los requisitos

- Migración a Next.js 14 (App Router) para cumplir el requerimiento de tecnología.
- Exposición de `role` en la API de login (backend) para habilitar acceso estricto por rol. Sugerido: `users` con campo `role: enum('admin','patient','medico')` y devolverlo en `/auth/log-in`.

## Plan de Migración a Next.js 14 (Sugerido)

1. Crear proyecto Next.js 14 con TypeScript y Tailwind (`create-next-app`).
2. Migrar rutas a App Router (`app/`): `/(public)/home`, `/(auth)/login`, `/(auth)/verify`, `/(auth)/signup`, `/(dash)/admin`, `/(dash)/patient`, `/(dash)/medico`.
3. Portar componentes y estilos existentes (Tailwind v4 ya presente).
4. Implementar providers en `app/providers.tsx` y envolver con `AuthProvider`.
5. Proteger rutas con middlewares/client guards según rol.
6. Ajustar llamadas a API con `fetch`/`axios` desde componentes o Server Actions (si aplica).

## Testing rápido

1. Backend `npm run dev` y verificar `GET /api/v1/health`.
2. Frontend `npm run dev` y probar:
   - Landing sin botón de registro; CTA a Login.
   - Login con alternancia de contraseña y manejo de errores.
   - Verificación de email.
   - Sidebar toggle en mobile.
   - Logout limpia Local Storage y redirige a `/`.

Para probar rutas por rol mientras el backend no expone rol, se puede simular agregando manualmente en el `localStorage` el `user.role` después de login.

## Troubleshooting

- Error 500 al crear cuenta (signup):
  - Suele deberse a fallo al enviar el correo de verificación (SMTP).
  - Verifica `SMTP_USER` y `SMTP_PASS`. En Gmail usa un App Password de 16 caracteres sin espacios.
  - Si usas `SMTP_HOST/PORT/SECURE`, el backend los tomará en lugar del servicio Gmail.
  - En desarrollo puedes poner `EMAIL_ENABLED=false` para omitir el envío (se loguea el código en consola) y evitar el 500.
