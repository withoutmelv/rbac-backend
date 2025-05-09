import { Context, Next } from "koa";
import { R } from "../../../utils/common-response";
import marketService from "../services/market.service";
import { plainToClass } from "class-transformer";
import { MarketPageParam, MarketParam } from "../params/market.param";
import { validateOrReject } from "class-validator";
// import { HasPerm } from "../../../decorators/has-perm.decorator";

class MarketController {

  // 添加用户
//   @HasPerm("sys:market:save")
  async save(ctx: Context, next: Next): Promise<void> {
      const param = plainToClass(MarketParam, ctx.request.body);
      await validateOrReject(param);
      await marketService.save(param)
      ctx.body = R.ok();
      await next();
  }
  // 修改用户
//   @HasPerm("sys:market:update")
  async update(ctx: Context, next: Next): Promise<void> {
    const param = plainToClass(MarketParam, ctx.request.body);
    await validateOrReject(param);
    await marketService.update(param)
    ctx.body = R.ok();
    await next();
  }
  // 删除用户
//   @HasPerm("sys:market:remove")
  async remove(ctx: Context, next: Next): Promise<void> {
      const ids: Array<string> = (ctx.request.body as any).ids;
      const data = await marketService.remove(ids);
      ctx.body = R.ok(data);
      await next();
  }
  // 分页查询用户列表
//   @HasPerm("sys:market:page")
  async page(ctx: Context, next: Next): Promise<void> {
    const param = plainToClass(MarketPageParam, ctx.request.body);
    const pageData = await marketService.page(param)
    ctx.body = R.ok(pageData);
    await next();
  }
  // 获取用户详情
//   @HasPerm("sys:market:detail")
  async detail(ctx: Context, next: Next): Promise<void> {
    const id: any = (ctx.request.body as any).id;
    const data = await marketService.detail(id);
    ctx.body = R.ok(data);
    await next();
  }
}
export default new MarketController();