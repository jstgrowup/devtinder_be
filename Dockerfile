# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app
ARG FRONTEND_HOST
ARG JWT_SECRET

ENV FRONTEND_HOST=$FRONTEND_HOST
ENV JWT_SECRET=$JWT_SECRET

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 8000

CMD ["node", "dist/app.js"]