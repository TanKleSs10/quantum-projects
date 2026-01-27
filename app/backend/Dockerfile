# 🧩 Etapa base común
FROM node:20-alpine AS base

WORKDIR /app

# Instala dependencias base (para módulos nativos)
RUN apk add --no-cache python3 make g++

# copia minifets
COPY package*.json ./

# 🔧 Etapa de desarrollo
FROM base AS dev

# Instala todas las dependencias (incluye devDependencies)
RUN npm install

# Copia el código fuente
COPY . .

# Establece variables útiles
ENV NODE_ENV=development

# Puerto interno para desarrollo
EXPOSE 4000

# Comando principal (usa nodemon, como tu script)
CMD ["npm", "run", "dev"]


# 🚀 Etapa de producción
FROM base AS prod

# Instala solo dependencias necesarias
RUN npm install --omit=dev

COPY . .

# Compila el proyecto TypeScript
RUN npm run build

ENV NODE_ENV=production

# Puerto interno para producción
EXPOSE 4000

# Ejecuta el archivo compilado
CMD ["node", "dist/app.js"]

