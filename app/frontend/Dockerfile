# 🧩 Etapa base
FROM node:20-alpine AS base

WORKDIR /app

# Copiamos manifests
COPY package*.json ./

# 🔧 Etapa de desarrollo
FROM base AS dev

# Instala dependencias
RUN npm install

# Copia el código
COPY . .

# Entorno dev
ENV NODE_ENV=development

# Vite usa 5173
EXPOSE 5173

# Arranque en modo dev (Vite)
CMD ["npm", "run", "dev"]

# 🚀 Etapa de producción
FROM base AS build

# Instala dependencias
RUN npm install

# Copia código
COPY . .

# Build estático
RUN npm run build


# 🌍 Runtime producción (Nginx)
FROM nginx:alpine AS prod

# Limpia config default
RUN rm /etc/nginx/conf.d/default.conf

# Copia config custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia build de Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Puerto HTTP
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

