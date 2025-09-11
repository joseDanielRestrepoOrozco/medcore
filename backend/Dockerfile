# Usa la imagen oficial de Node.js, que ya incluye todo lo necesario.
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor.
WORKDIR /usr/src/app

# Copia los archivos de configuración de dependencias.
# Esto es para que Docker aproveche su caché y no reinstale todo si el package.json no cambia.
COPY package*.json ./

# Instala todas las dependencias del backend.
RUN npm install

# Copia el resto del código fuente del proyecto al contenedor.
COPY . .

# Expone el puerto donde tu API escuchará las peticiones.
EXPOSE 3000

# Define el comando que se ejecutará al iniciar el contenedor.
# Asume que tienes un script llamado "start" en tu package.json.
CMD ["npm", "run", "start"]