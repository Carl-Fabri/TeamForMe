# Frontend Angular 21 con SSR (Express). Multi-stage: compila con todas las dependencias
# y la imagen final solo lleva dist/ + dependencias de producción.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS final
WORKDIR /app
ENV NODE_ENV=production PORT=4000
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
USER node
EXPOSE 4000
CMD ["node", "dist/TeamForMe/server/server.mjs"]
