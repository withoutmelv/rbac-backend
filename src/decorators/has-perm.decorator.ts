// src/decorators/has-perm.decorator.ts
import 'reflect-metadata';
import { Context } from 'koa';
import { TokenManager } from '../token/token-manager';
import { ServiceException } from '../utils/service-exception';

export function HasPerm(access: string | string[], mode?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const ctx: Context = args[0];
      // const next: Next = args[1];
      let token = ctx.request.header.authorization;
      if (token) {
          token = token.replace('Bearer ', '');
      }
      if (!await TokenManager.getInstance().checkAccess(token || '',access, mode)) {
        ServiceException.throwBiz(99990406,'您没有资源访问权限，请联系管理员！');
      }
      return await originalMethod.apply(this, args);
    };

    return descriptor;
  };
}