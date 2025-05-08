import { Context, Next } from "koa";
import { TokenManager } from "../token/token-manager";
import { R } from "../utils/common-response";
import * as cls from 'cls-hooked';
import { getConfig } from "../config";
// 创建命名空间
const NAMESPACE_NAME = 'my-namespace';
export const namespace = cls.getNamespace(NAMESPACE_NAME) || cls.createNamespace(NAMESPACE_NAME);
// 白名单
const whiteList = getConfig().WHITE_LIST
export const authMiddleware = ()=> {
    return async (ctx: Context, next: Next) => {
        await namespace.runAndReturn(async () => {
            if (!whiteList.includes(ctx.url)) {
                let token = ctx.request.header.authorization;
                if (token) {
                    token = token.replace('Bearer ', '');
                }
                const verify: boolean = TokenManager.getInstance().verify(token);
                if (!verify) {
                    ctx.body = R.fail(99990403,'token已过期');
                    return;
                }

                try {
                    // 将用户信息附加到命名空间
                    const userInfo = TokenManager.getInstance().getInfo(token);
                    namespace.set('user', userInfo);
                    namespace.set('token', token)
                } catch (e) {
                    console.error(e);
                    ctx.body = R.fail(99990403,'获取用户信息失败');
                    return;
                }
            }
            await next();
        })
    };
  }

export const getLoginUser = ()=>{
    return namespace.get('user');
}
export const getLoginUserId = ()=>{
    const user = getLoginUser();
    if(!user) return null;
    return user.id;
}
export const isSuperAdmin = ()=>{
    const user = getLoginUser();
    if(!user) return false;
    return user.superAdmin;
}
export const getLoginUserName = ()=>{
    const user = getLoginUser();
    if(!user) return null;
    return user.userName;
}
export const getToken=()=>{
    return namespace.get('token');
}