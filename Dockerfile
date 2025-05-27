# 1. 빌드 단계 (Node.js를 사용하여 React 앱 빌드)
FROM node:23.11-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

#COPY .env ./.env

ENV VITE_BASE_URL="https://coordipai-web-server.knuassignx.site"

COPY . .
RUN npm run build

# 2. 프로덕션 단계 (Nginx를 사용하여 빌드된 앱 서빙)
FROM nginx:stable-alpine

# Nginx 기본 설정 제거 (선택 사항이지만 깔끔하게 시작하기 위해)
RUN rm /etc/nginx/conf.d/default.conf

# 사용자 정의 Nginx 설정 파일 복사
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 단계에서 생성된 React 앱을 Nginx의 웹 루트로 복사
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx 포트 노출
EXPOSE 80

# Nginx 시작
CMD ["nginx", "-g", "daemon off;"]