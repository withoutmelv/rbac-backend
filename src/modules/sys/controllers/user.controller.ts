import { Context, Next } from "koa";
import { R } from "../../../utils/common-response";
import userService from "../services/user.service";
import { plainToClass } from "class-transformer";
import { UserPageParam, UserParam } from "../params/user.param";
import lowcodeService from "../services/lowcode.service";
import { validateOrReject } from "class-validator";
import { HasPerm } from "../../../decorators/has-perm.decorator";

class UserController {

  // 添加用户
  @HasPerm("sys:user:save")
  async save(ctx: Context, next: Next): Promise<void> {
      const param = plainToClass(UserParam, ctx.request.body);
      await validateOrReject(param);
      await userService.save(param)
      ctx.body = R.ok();
      await next();
  }
  // 修改用户
  @HasPerm("sys:user:update")
  async update(ctx: Context, next: Next): Promise<void> {
    const param = plainToClass(UserParam, ctx.request.body);
    await validateOrReject(param);
    await userService.update(param)
    ctx.body = R.ok();
    await next();
  }
  // 删除用户
  @HasPerm("sys:user:remove")
  async remove(ctx: Context, next: Next): Promise<void> {
      const ids: Array<string> = (ctx.request.body as any).ids;
      const data = await userService.remove(ids);
      ctx.body = R.ok(data);
      await next();
  }
  // 分页查询用户列表
  @HasPerm("sys:user:page")
  async page(ctx: Context, next: Next): Promise<void> {
    const param = plainToClass(UserPageParam, ctx.request.body);
    const pageData = await userService.page(param)
    ctx.body = R.ok(pageData);
    await next();
  }
  // 获取用户详情
  @HasPerm("sys:user:detail")
  async detail(ctx: Context, next: Next): Promise<void> {
    const id: any = (ctx.request.body as any).id;
    const data = await userService.detail(id);
    ctx.body = R.ok(data);
    await next();
  }
  // 获取当前用户信息
  async info(ctx: Context, next: Next): Promise<void> {
    ctx.body = R.ok(userService.info());

    await next();
  }
  // 获取当前用户权限码
  async permCode(ctx: Context, next: Next): Promise<void> {
    ctx.body = R.ok(userService.permCode());

    await next();
  }
  // 用户下拉
  async select(ctx: Context, next: Next): Promise<void> {
    const param = plainToClass(UserPageParam, ctx.request.body);
    param.labelKey = 'realName';
    const data = await lowcodeService.select('sys', 'user', param)
    ctx.body = R.ok(data);
    await next();
  }
  // 锁定用户
  @HasPerm("sys:user:locked")
  async locked(ctx: Context, next: Next): Promise<void> {
    const ids: Array<string> = (ctx.request.body as any).ids;
    const data = await userService.locked(ids);
    ctx.body = R.ok(data);
    await next();
  }
  // 取消用户
  @HasPerm("sys:user:unLocked")
  async unLocked(ctx: Context, next: Next): Promise<void> {
    const ids: Array<string> = (ctx.request.body as any).ids;
    const data = await userService.unLocked(ids);
    ctx.body = R.ok(data);
    await next();
  }
  // 重置密码
  @HasPerm("sys:user:resetPassword")
  async resetPassword(ctx: Context, next: Next): Promise<void> {
    const ids: Array<string> = (ctx.request.body as any).ids;
    const data = await userService.resetPassword(ids);
    ctx.body = R.ok(data);
    await next();
  }
  // 授权角色
  @HasPerm("sys:user:grantRole")
  async grantRole(ctx: Context, next: Next): Promise<void> {
    const userId: string = (ctx.request.body as any).userId;
    const roleIdList: Array<string> = (ctx.request.body as any).roleIdList;
    const data = await userService.grantRole(userId,roleIdList);
    ctx.body = R.ok(data);
    await next();
  }
}
export default new UserController();