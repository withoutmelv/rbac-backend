
import Router from '@koa/router';
import lowcodeController from '../controllers/lowcode.controller';

const lowcodeRouter = new Router({ prefix: '' });

lowcodeRouter.post('/:module/:tableName/select', lowcodeController.select);
export default lowcodeRouter;