
import 'reflect-metadata';
import Koa from 'koa';
import dotenv from 'dotenv'
// import userRoute from './modules/sys/routes/user-route';
// import roleRoute from './modules/sys/routes/role-route';
import path from 'path';
import bodyParser from 'koa-bodyparser';
import { loadRoutes } from './utils/load-routes';
import { errorHandler } from './utils/error-handler';
import { authMiddleware } from './middlewares/auth-middleware';
import getEnumParser from './utils/enum-parser';

// 加载环境变量
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` })
// 初始化单例枚举解析器，假设你的项目根目录是 __dirname
getEnumParser(__dirname).init();
const app = new Koa();
// 全局错误处理中间件
app.use(errorHandler())
// 权限拦截器
app.use(authMiddleware())
// 使用 body parser 中间件
app.use(bodyParser());
// 使用路由中间件
// app.use(userRoute.routes()).use(userRoute.allowedMethods());
// app.use(roleRoute.routes()).use(roleRoute.allowedMethods());
// 自动加载路由
const baseDir = path.join(__dirname, '../src');
loadRoutes(app, baseDir);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});