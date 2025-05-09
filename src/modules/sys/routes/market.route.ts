
import Router from '@koa/router';
import marketController from '../controllers/market.controller';

const marketRouter = new Router({ prefix: '/sys/market' });

marketRouter.post('/save', marketController.save);
marketRouter.post('/page', marketController.page);
marketRouter.post('/update', marketController.update);
marketRouter.post('/remove', marketController.remove);
marketRouter.post('/detail', marketController.detail);

export default marketRouter;