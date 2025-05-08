
import Router from '@koa/router';
import dictController from '../controllers/dict.controller';

const dictRouter = new Router({ prefix: '/sys/dict' });

dictRouter.post('/getByDictType', dictController.getByDictType);
export default dictRouter;