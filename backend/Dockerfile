# Usa la imagen oficial de Node.js, que ya incluye todo lo necesario.
FROM node:20 AS build-stage

# Establece el directorio de trabajo dentro del contenedor.
WORKDIR /usr/src/app

# Copia los archivos de configuración de dependencias.
# Esto es para que Docker aproveche su caché y no reinstale todo si el package.json no cambia.
COPY . .

# Instala todas las dependencias del backend.
RUN npm install

RUN npx prisma generate

RUN npm run tsc

FROM node:20-bullseye-slim

WORKDIR /usr/src/app

# Copia el resto del código fuente del proyecto al contenedor.
COPY --chown=node:node --from=build-stage /usr/src/app/dist ./dist
COPY --chown=node:node --from=build-stage /usr/src/app/prisma ./prisma
COPY --chown=node:node --from=build-stage /usr/src/app/package*.json .
COPY --chown=node:node --from=build-stage /usr/src/app/node_modules/.prisma ./node_modules/.prisma
COPY --chown=node:node --from=build-stage /usr/src/app/node_modules/@prisma ./node_modules/@prisma

RUN npm ci --omit=dev

COPY .env .

RUN npx prisma db push

# Expone el puerto donde tu API escuchará las peticiones.
EXPOSE 3000

USER node

CMD ["npm", "start"]
