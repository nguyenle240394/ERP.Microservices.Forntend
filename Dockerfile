# Stage 1: Build
FROM node:22-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Sửa lệnh build tùy thuộc vào config Nx của bạn
RUN npx nx build host --configuration=production

# Stage 2: Nginx để phục vụ web
FROM nginx:alpine
# Copy file build từ Stage 1 sang thư mục của Nginx
COPY --from=build /app/dist/apps/host/browser /usr/share/nginx/html
# Xóa cấu hình mặc định và thêm cấu hình hỗ trợ Angular routing (fallback về index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8008
