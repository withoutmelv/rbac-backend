import { Context, Next } from "koa";
import lowcodeService from "../services/lowcode.service";
import { PageParam } from "../../../utils/page-param";
import { plainToClass } from "class-transformer";
import { R } from "../../../utils/common-response";

class LowcodeController {

  async select(ctx: Context, next: Next): Promise<void> {
      const param = plainToClass(PageParam, ctx.request.body);
      const { module, tableName } = ctx.params; // 获取路由参数
      const res = await lowcodeService.select(module,tableName,param)
      ctx.body = R.ok(res);
      await next();
  }
}
export default new LowcodeController();