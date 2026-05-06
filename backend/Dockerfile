# Stage duy nhất cho backend
FROM node:20-alpine

WORKDIR /app

# Copy package trước để tận dụng cache layer
COPY package*.json ./

RUN npm ci --only=production

# Copy toàn bộ source
COPY . .

# Generate Prisma client (vì bạn dùng Prisma)
RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
