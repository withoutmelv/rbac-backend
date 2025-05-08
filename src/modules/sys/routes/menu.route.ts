
import Router from '@koa/router';
import menuController from '../controllers/menu.controller';

const menuRouter = new Router({ prefix: '/sys/menu' });

menuRouter.post('/save', menuController.save);
menuRouter.post('/update', menuController.update);
menuRouter.post('/remove', menuController.remove);
menuRouter.post('/detail', menuController.detail);
menuRouter.post('/page', menuController.page);
menuRouter.post('/tree', menuController.tree);
menuRouter.post('/list', menuController.list);
menuRouter.post('/appList', menuController.appList);
menuRouter.post('/syncRoute', menuController.syncRoute);

export default menuRouter;