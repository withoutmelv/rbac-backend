
import Router from '@koa/router';
import userController from '../controllers/user.controller';

const userRouter = new Router({ prefix: '/sys/user' });

userRouter.post('/save', userController.save);
userRouter.post('/update', userController.update);
userRouter.post('/remove', userController.remove);
userRouter.post('/detail', userController.detail);
userRouter.post('/page', userController.page);
userRouter.post('/info', userController.info);
userRouter.post('/permCode', userController.permCode);
userRouter.post('/select', userController.select);
userRouter.post('/locked', userController.locked);
userRouter.post('/unLocked', userController.unLocked);
userRouter.post('/resetPassword', userController.resetPassword);
userRouter.post('/grantRole', userController.grantRole);

export default userRouter;