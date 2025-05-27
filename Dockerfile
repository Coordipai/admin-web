# 빌드 스테이지
FROM node:20-alpine AS builder

WORKDIR /app

# 패키지 파일 복사 및 설치
COPY package*.json ./
RUN npm ci --frozen-lockfile

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# 프로덕션 스테이지
FROM nginx:stable-alpine

# nginx 설정 파일 복사
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 파일 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# 보안을 위한 추가 설정
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# nginx 사용자로 실행
USER nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]