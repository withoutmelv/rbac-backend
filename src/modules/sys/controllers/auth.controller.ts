import { Context, Next } from "koa";
import authService from "../services/auth.service";
import { plainToClass } from "class-transformer";
import { validateOrReject } from "class-validator";
import { LoginParam } from "../params/login.param";
import { R } from "../../../utils/common-response";
import { HasPerm } from "../../../decorators/has-perm.decorator";

class AuthController {

    async login(ctx: Context, next: Next): Promise<void> {
        const loginParam = plainToClass(LoginParam, ctx.request.body);
        await validateOrReject(loginParam);
        const res = await authService.login(loginParam)
        ctx.body = R.ok(res);
        await next();
    }
    async logout(ctx: Context, next: Next): Promise<void> {
        await authService.logout();
        ctx.body = R.ok();
        await next();
    }
    async getCaptchaOpenFlag(ctx: Context, next: Next): Promise<void> {
        ctx.body = R.ok({
            flag: false
        });
        await next();
    }
    @HasPerm("sys:playUser")
    async playUser(ctx: Context, next: Next): Promise<void> {
        const userId: any = (ctx.request.body as any).userId;
        const res = await authService.playUser(userId);
        ctx.body = R.ok(res);
        await next();
    }
    @HasPerm("sys:unPlayUser")
    async unPlayUser(ctx: Context, next: Next): Promise<void> {
        const res = await authService.unPlayUser();
        ctx.body = R.ok(res);
        await next();
    }
}

export default new AuthController();