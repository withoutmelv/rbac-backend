import { Context, Next } from "koa";
import { R } from "../../../utils/common-response";
import postService from "../services/post.service";
import { plainToClass } from "class-transformer";
import { PostPageParam, PostParam } from "../params/post.param";
import { validateOrReject } from "class-validator";
import { HasPerm } from "../../../decorators/has-perm.decorator";

class PostController {

  // 添加岗位
  @HasPerm("sys:post:save")
  async save(ctx: Context, next: Next): Promise<void> {
      const param = plainToClass(PostParam, ctx.request.body);
      await validateOrReject(param);
      await postService.save(param)
      ctx.body = R.ok();
      await next();
  }
  // 修改岗位
  @HasPerm("sys:post:update")
  async update(ctx: Context, next: Next): Promise<void> {
      const param = plainToClass(PostParam, ctx.request.body);
      await validateOrReject(param);
      await postService.update(param)
      ctx.body = R.ok();
      await next();
  }
  // 删除岗位
  @HasPerm("sys:post:remove")
  async remove(ctx: Context, next: Next): Promise<void> {
    const ids: Array<string> = (ctx.request.body as any).ids;
    const data = await postService.remove(ids);
    ctx.body = R.ok(data);
    await next();
  }
  // 分页查询岗位列表
  @HasPerm("sys:post:page")
  async page(ctx: Context, next: Next): Promise<void> {
    const param = plainToClass(PostPageParam, ctx.request.body);
    const pageData = await postService.page(param)
    ctx.body = R.ok(pageData);
    await next();
  }
  // 获取岗位详情
  @HasPerm("sys:post:detail")
  async detail(ctx: Context, next: Next): Promise<void> {
    const id: any = (ctx.request.body as any).id;
    const data = await postService.detail(id);
    ctx.body = R.ok(data);
    await next();
  }

}
export default new PostController();