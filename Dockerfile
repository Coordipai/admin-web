# 1단계: 빌드 환경
FROM node:23.11-alpine AS build

WORKDIR /app

# package.json, package-lock.json 복사 후 의존성 설치
COPY package*.json ./
RUN npm ci

# 소스 전체 복사 후 빌드
COPY . .
RUN npm run build

# 2단계: Nginx로 정적 파일 서빙
FROM nginx:alpine

# 빌드된 정적 파일을 Nginx의 기본 경로로 복사
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx 기본 설정 덮어쓰기(선택, 없으면 생략)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]