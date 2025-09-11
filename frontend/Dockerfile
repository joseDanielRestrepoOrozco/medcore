# Usa una construcción de múltiples etapas (multi-stage build) para optimizar el tamaño de la imagen final.

# ETAPA 1: Construcción
# Usa la imagen oficial de Node.js para compilar la aplicación.
FROM node:18-alpine as build

# Establece el directorio de trabajo dentro del contenedor.
WORKDIR /app

# Copia los archivos de dependencias. Esto es clave para aprovechar la caché de Docker.
COPY package*.json ./

# Instala todas las dependencias del frontend.
RUN npm install

# Copia el resto del código fuente al contenedor.
COPY . .

# Compila la aplicación de React. Asume que tienes un script "build" en tu package.json.
RUN npm run build

# ETAPA 2: Servir la aplicación
# Usa una imagen de Nginx ligera y segura para servir los archivos estáticos.
FROM nginx:stable-alpine

# Copia los archivos compilados desde la etapa anterior a la carpeta de Nginx.
COPY --from=build /app/dist /usr/share/nginx/html

# Expone el puerto 80, que es el puerto HTTP estándar.
EXPOSE 80