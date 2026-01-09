# Estágio de build
FROM node:22-alpine AS build
WORKDIR /app

# Copiar package.json e instalar dependências
COPY package*.json ./
RUN npm ci --only=production

# Copiar arquivos do projeto
COPY . .

RUN npm install

# Build da aplicação Angular
RUN npm run build -- --configuration=production

# Estágio de produção com NGINX
FROM nginx:alpine

# Copiar configuração customizada do NGINX (opcional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Copiar os arquivos de build do estágio anterior
COPY --from=build /app/dist/backoffice /usr/share/nginx/html

# Expor porta 80
EXPOSE 80

# Iniciar NGINX
CMD ["nginx", "-g", "daemon off;"]