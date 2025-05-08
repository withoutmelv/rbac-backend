import { Context, Next } from "koa";
import { R } from "../../../utils/common-response";
import dictService from "../services/dict.service";

class DictController {
    async getByDictType(ctx: Context, next: Next): Promise<void> {
        const res = await dictService.getByDictType((ctx.request.body as any).dictType);
        ctx.body = R.ok(res);
        await next();
    }
  }
  export default new DictController();