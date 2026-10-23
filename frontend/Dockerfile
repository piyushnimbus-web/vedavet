FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build && mkdir -p dist/images && cp -R public/images/. dist/images/ && cp -R public/shop dist/shop && cp public/vedavet-local.* dist/ 2>/dev/null || true
FROM nginx:1.27-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
