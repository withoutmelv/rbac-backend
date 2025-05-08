import { Context, Next } from "koa";
import { R } from "./common-response";
import { ServiceException } from "./service-exception";

export const  errorHandler =()=> {
    return async (ctx: Context, next: Next) => {
      try {
        await next();
        if (ctx.status === 404 && !ctx.body) {
          ctx.status = 200;
          ctx.body = R.fail(99999999,'此功能正在建设中，敬请期待！')
        }
      } catch (err: any) {
        console.log(err);
        if(err instanceof ServiceException){
            ctx.body = R.fail(err.code,err.errorMessage)
        } else {
            ctx.body = R.failWithMsg(typeof err)
        }
      }
    };
  }