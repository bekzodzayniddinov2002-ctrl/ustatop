# ─────────────────────────────────────────────────────────────────────────────
# UstaTop admin panel — ko'p bosqichli Dockerfile
#   dev   → Vite dev-server, hot reload (HMR) bilan
#   prod  → nginx orqali statik build
# ─────────────────────────────────────────────────────────────────────────────

ARG NODE_VERSION=22-alpine

# ── umumiy asos: bog'liqliklar o'rnatiladi ───────────────────────────────────
FROM node:${NODE_VERSION} AS deps
WORKDIR /app
# Faqat manifestlar nusxalanadi — kod o'zgarganda bu qatlam qayta ishlatiladi
COPY package.json package-lock.json ./
RUN npm ci

# ── ishlab chiqish (hot reload) ──────────────────────────────────────────────
FROM node:${NODE_VERSION} AS dev
WORKDIR /app
ENV NODE_ENV=development
# Bind mount fayl o'zgarishini inotify orqali yetkazmasa (macOS / Windows),
# Vite polling rejimiga o'tadi — vite.config.js shu o'zgaruvchini o'qiydi.
ENV VITE_POLLING=true
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 5173
# --host: konteyner tashqarisidan ochilishi uchun 0.0.0.0 ga bog'lanadi
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

# ── ishlab chiqarish build'i ─────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS build
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ── ishlab chiqarish: nginx ──────────────────────────────────────────────────
FROM nginx:1.27-alpine AS prod
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://localhost/ >/dev/null || exit 1
CMD ["nginx", "-g", "daemon off;"]
