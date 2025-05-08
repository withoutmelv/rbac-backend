
import Router from '@koa/router';
import deptController from '../controllers/dept.controller';

const deptRouter = new Router({ prefix: '/sys/dept' });

deptRouter.post('/save', deptController.save);
deptRouter.post('/update', deptController.update);
deptRouter.post('/remove', deptController.remove);
deptRouter.post('/detail', deptController.detail);
deptRouter.post('/page', deptController.page);
deptRouter.post('/tree', deptController.tree);
deptRouter.post('/list', deptController.list);


export default deptRouter;