import { Context, Next } from "koa";
import { R } from "../../../utils/common-response";
import rbacService from "../services/rbac.service";
import { HasPerm } from "../../../decorators/has-perm.decorator";

class RbacController {

    @HasPerm("sys:rbac:saveRoleMenu")
    async saveRoleMenu(ctx: Context, next: Next): Promise<void> {
        await rbacService.saveRoleMenu(ctx.request.body as any);
        ctx.body = R.ok();
        await next();
    }
    @HasPerm(["sys:rbac:roleMenuIds",'sys:rbac:saveRoleMenu'],'or')
    async roleMenuIds(ctx: Context, next: Next): Promise<void> {
        const roleId = (ctx.request.body as any).roleId;
        const data = await rbacService.roleMenuIds(roleId)
        ctx.body = R.ok(data);
        await next();
    }
    @HasPerm("sys:rbac:saveUserRole")
    async saveUserRole(ctx: Context, next: Next): Promise<void> {
        await rbacService.saveUserRole(ctx.request.body as any);
        ctx.body = R.ok();
        await next();
    }
    @HasPerm("sys:rbac:removeUserRole")
    async removeUserRole(ctx: Context, next: Next): Promise<void> {
        await rbacService.removeUserRole(ctx.request.body as any);
        ctx.body = R.ok();
        await next();
    }
    @HasPerm(["sys:rbac:saveUserRole","sys:rbac:userListByRoleId"], 'or')
    async userListByRoleId(ctx: Context, next: Next): Promise<void> {
        const data = await rbacService.userListByRoleId(ctx.request.body as any);
        ctx.body = R.ok(data);
        await next();
    }
    @HasPerm(["sys:rbac:saveUserRole","sys:rbac:userListExcludeRoleId",'or'])
    async userListExcludeRoleId(ctx: Context, next: Next): Promise<void> {
        const data = await rbacService.userListExcludeRoleId(ctx.request.body as any);
        ctx.body = R.ok(data);
        await next();
    }
}
export default new RbacController();