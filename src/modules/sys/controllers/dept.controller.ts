import { Context, Next } from "koa";
import { R } from "../../../utils/common-response";
import deptService from "../services/dept.service";
import { plainToClass } from "class-transformer";
import { DeptPageParam, DeptParam } from "../params/dept.param";
import { validateOrReject } from "class-validator";
import { HasPerm } from "../../../decorators/has-perm.decorator";

class DeptController {

  // 添加部门
  @HasPerm("sys:dept:save")
  async save(ctx: Context, next: Next): Promise<void> {
      const param = plainToClass(DeptParam, ctx.request.body);
      await validateOrReject(param);
      await deptService.save(param)
      ctx.body = R.ok();
      await next();
  }
  // 修改部门
  @HasPerm("sys:dept:update")
  async update(ctx: Context, next: Next): Promise<void> {
      const param = plainToClass(DeptParam, ctx.request.body);
      await validateOrReject(param);
      await deptService.update(param)
      ctx.body = R.ok();
      await next();
  }
  // 删除部门
  @HasPerm("sys:dept:remove")
  async remove(ctx: Context, next: Next): Promise<void> {
    const ids: Array<string> = (ctx.request.body as any).ids;
    const data = await deptService.remove(ids);
    ctx.body = R.ok(data);
    await next();
  }
  // 分页查询部门列表
  @HasPerm("sys:dept:page")
  async page(ctx: Context, next: Next): Promise<void> {
    const param = plainToClass(DeptPageParam, ctx.request.body);
    const pageData = await deptService.page(param)
    ctx.body = R.ok(pageData);
    await next();
  }
  // 获取部门详情
  @HasPerm("sys:dept:detail")
  async detail(ctx: Context, next: Next): Promise<void> {
    const id: any = (ctx.request.body as any).id;
    const data = await deptService.detail(id);
    ctx.body = R.ok(data);
    await next();
  }
  // 查询所有部门列表
  @HasPerm("sys:dept:list")
  async list(ctx: Context, next: Next): Promise<void> {
    const param = plainToClass(DeptPageParam, ctx.request.body);
    const listData = await deptService.list(param)
    ctx.body = R.ok(listData);
    await next();
  }
  // 查询部门列表树
  @HasPerm("sys:dept:tree")
  async tree(ctx: Context, next: Next): Promise<void> {
    const param = plainToClass(DeptPageParam, ctx.request.body);
    const treeData = await deptService.tree(param)
    ctx.body = R.ok(treeData);
    await next();
  }
}
export default new DeptController();