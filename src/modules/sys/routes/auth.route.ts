
import Router from '@koa/router';
import authController from '../controllers/auth.controller';

const authRouter = new Router({ prefix: '' });

authRouter.post('/sys/login', authController.login);
authRouter.post('/sys/logout', authController.logout);  
authRouter.post('/sys/getCaptchaOpenFlag', authController.getCaptchaOpenFlag);
authRouter.post('/sys/playUser', authController.playUser);
authRouter.post('/sys/unPlayUser', authController.unPlayUser);

export default authRouter;