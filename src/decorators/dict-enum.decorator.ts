// src/decorators/dict-enum.decorator.ts
import 'reflect-metadata';

export function DictEnum(options: { key: string; name: string }) {
  return function (target: any) {
    Reflect.defineMetadata('dictKey', options.key, target);
    Reflect.defineMetadata('dictName', options.name, target);
  };
}