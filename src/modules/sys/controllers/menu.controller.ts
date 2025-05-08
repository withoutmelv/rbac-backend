import { Context, Next } from "koa";
import { R } from "../../../utils/common-response";
import menuService from "../services/menu.service";
import { plainToClass } from "class-transformer";
import { MenuPageParam, MenuParam } from "../params/menu.param";
import { validateOrReject } from "class-validator";
import { HasPerm } from "../../../decorators/has-perm.decorator";

class MenuController {

  // 添加菜单
  @HasPerm("sys:menu:save")
  async save(ctx: Context, next: Next): Promise<void> {
      const param = plainToClass(MenuParam, ctx.request.body);
      await validateOrReject(param);
      await menuService.save(param)
      ctx.body = R.ok();
      await next();
  }
  // 修改菜单
  @HasPerm("sys:menu:update")
  async update(ctx: Context, next: Next): Promise<void> {
      const param = plainToClass(MenuParam, ctx.request.body);
      await validateOrReject(param);
      await menuService.update(param)
      ctx.body = R.ok();
      await next();
  }
  // 删除菜单
  @HasPerm("sys:menu:remove")
  async remove(ctx: Context, next: Next): Promise<void> {
    const ids: Array<string> = (ctx.request.body as any).ids;
    const data = await menuService.remove(ids);
    ctx.body = R.ok(data);
    await next();
  }
  // 分页查询菜单列表
  @HasPerm("sys:menu:page")
  async page(ctx: Context, next: Next): Promise<void> {
    const param = plainToClass(MenuPageParam, ctx.request.body);
    const pageData = await menuService.page(param)
    ctx.body = R.ok(pageData);
    await next();
  }
  // 获取菜单详情
  @HasPerm("sys:menu:detail")
  async detail(ctx: Context, next: Next): Promise<void> {
    const id: any = (ctx.request.body as any).id;
    const data = await menuService.detail(id);
    ctx.body = R.ok(data);
    await next();
  }
  // 查询所有菜单列表
  @HasPerm("sys:menu:list")
  async list(ctx: Context, next: Next): Promise<void> {
    const param = plainToClass(MenuPageParam, ctx.request.body);
    const listData = await menuService.list(param)
    ctx.body = R.ok(listData);
    await next();
  }
  // 查询菜单列表树
  @HasPerm(["sys:rbac:saveRoleMenu","sys:menu:tree"], 'or')
  async tree(ctx: Context, next: Next): Promise<void> {
    const param = plainToClass(MenuPageParam, ctx.request.body);
    const treeData = await menuService.tree(param)
    ctx.body = R.ok(treeData);
    await next();
  }
  // 获取应用列表
  async appList(ctx: Context, next: Next): Promise<void> {
    const data = await menuService.appList()
    ctx.body = R.ok(data);
    await next();
  }
  // 同步前端路由
  @HasPerm("sys:menu:syncRoute")
  async syncRoute(ctx: Context, next: Next): Promise<void> {
    const data = await menuService.syncRoute('',ctx.request.body as any)
    ctx.body = R.ok(data);
    await next();
  }
}
export default new MenuController();