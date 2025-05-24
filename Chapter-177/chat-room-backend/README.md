npx prisma migrate dev --name added_user_captcha 添加字段
nest g module redis 创建模块
nest g service redis --no-spec 创建service
nest g resource email --no-spec 这个是创建全部的命令
nest g interceptor common/interceptors/response

### 目前来看 自定义装饰器和自定义参数装饰器 还挺有用的

参数装饰器

prisma 新模型 提示失效问题解决

```
rm -rf node_modules/.prisma/client
npx prisma generate
```

需要重新生成下

https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/generating-prisma-client?utm_source=CLI&utm_medium=generator-warning
或者 自己定义生成的位置 然后引用生成的PrismaClient
如果没有提示 继续上述操作

表创建1.现在prisma 中加入model 2.生成迁移 npx prisma migrate dev --name xxxx
