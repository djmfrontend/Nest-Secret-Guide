FROM node:latest
Workdir /app
Copy . .
RUN npm config set registry https://registry.npmmirror.com/
# RUN npm config set registry https://1jbfim28.mirror.aliyuncs.com

RUN npm install  -g http-server

Expose 8080
CMD ["http-server", "-p", "8080"]