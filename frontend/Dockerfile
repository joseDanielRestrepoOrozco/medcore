# Usa una construcción de múltiples etapas (multi-stage build) para optimizar el tamaño de la imagen final.

# ETAPA 1: Construcción
# Usa la imagen oficial de Node.js para compilar la aplicación.
FROM node:20 as build

# Establece el directorio de trabajo dentro del contenedor.
WORKDIR /usr/src/app

# Copia el resto del código fuente al contenedor.
COPY . .

# Instala todas las dependencias del frontend.
RUN npm install

# Compila la aplicación de React. Asume que tienes un script "build" en tu package.json.
RUN npm run build

# ETAPA 2: Servir la aplicación
# Usa una imagen de Nginx ligera y segura para servir los archivos estáticos.
FROM nginx:1.20.1

# Copia los archivos compilados desde la etapa anterior a la carpeta de Nginx.
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
