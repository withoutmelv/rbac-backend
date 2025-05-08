
import Router from '@koa/router';
import roleController from '../controllers/role.controller';

const roleRouter = new Router({ prefix: '/sys/role' });

roleRouter.post('/save', roleController.save);
roleRouter.post('/update', roleController.update);
roleRouter.post('/remove', roleController.remove);
roleRouter.post('/detail', roleController.detail);
roleRouter.post('/page', roleController.page);

export default roleRouter;