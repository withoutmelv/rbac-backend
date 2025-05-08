
import Router from '@koa/router';
import rbacController from '../controllers/rbac.controller';

const rbacRouter = new Router({ prefix: '' });

rbacRouter.post('/sys/rbac/saveRoleMenu', rbacController.saveRoleMenu);
rbacRouter.post('/sys/rbac/roleMenuIds', rbacController.roleMenuIds);
rbacRouter.post('/sys/rbac/saveUserRole', rbacController.saveUserRole);
rbacRouter.post('/sys/rbac/removeUserRole', rbacController.removeUserRole);
rbacRouter.post('/sys/rbac/userListByRoleId', rbacController.userListByRoleId);
rbacRouter.post('/sys/rbac/userListExcludeRoleId', rbacController.userListExcludeRoleId);

export default rbacRouter;