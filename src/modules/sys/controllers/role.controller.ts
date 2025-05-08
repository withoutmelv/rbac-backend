import { Context, Next } from "koa";
import { R } from "../../../utils/common-response";
import roleService from "../services/role.service";
import { RolePageParam, RoleParam } from "../params/role.param";
import { plainToClass } from "class-transformer";
import { validateOrReject } from "class-validator";
import { HasPerm } from "../../../decorators/has-perm.decorator";
class RoleController {
  // 添加角色
  @HasPerm("sys:role:save")
  async save(ctx: Context, next: Next): Promise<void> {
      const param = plainToClass(RoleParam, ctx.request.body);
      await validateOrReject(param);
      await roleService.save(param)
      ctx.body = R.ok();
      await next();
  }
  // 修改角色
  @HasPerm("sys:role:update")
  async update(ctx: Context, next: Next): Promise<void> {
      const param = plainToClass(RoleParam, ctx.request.body);
      await validateOrReject(param);
      await roleService.update(param)
      ctx.body = R.ok();
      await next();
  }
  // 删除角色
  @HasPerm("sys:role:remove")
  async remove(ctx: Context, next: Next): Promise<void> {
    const ids: Array<string> = (ctx.request.body as any).ids;
    const data = await roleService.remove(ids);
    ctx.body = R.ok(data);
    await next();
  }
  // 分页查询角色列表
  @HasPerm("sys:role:page")
  async page(ctx: Context, next: Next): Promise<void> {
    const param = plainToClass(RolePageParam, ctx.request.body);
    const pageData = await roleService.page(param)
    ctx.body = R.ok(pageData);
    await next();
  }
  // 获取角色详情
  @HasPerm("sys:role:detail")
  async detail(ctx: Context, next: Next): Promise<void> {
    const id: any = (ctx.request.body as any).id;
    const data = await roleService.detail(id);
    ctx.body = R.ok(data);
    await next();
  }
}
export default new RoleController();