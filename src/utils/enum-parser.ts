// src/utils/enum-parser.ts
import fs from 'fs';
import path from 'path';
import { DictModel } from '../types/dict';

export class EnumParser {
  private static instance: EnumParser;
  private readonly dictList: DictModel[] = [];
  private readonly dictMap: Map<string, DictModel> = new Map();
  private baseDir: string;

  private constructor(baseDir: string) {
    this.baseDir = baseDir;
  }

  // 获取单例实例
  public static getInstance(baseDir: string): EnumParser {
    if (!EnumParser.instance) {
      EnumParser.instance = new EnumParser(baseDir);
    }
    return EnumParser.instance;
  }

  public async init() {
    await this.scanEnums();
  }

  private async scanEnums() {
    const modulesDir = path.join(this.baseDir, 'modules');

    try {
      // 读取 modules 目录下的所有子目录（即各个模块）
      const moduleNames = fs.readdirSync(modulesDir)
        .filter((name) => fs.statSync(path.join(modulesDir, name)).isDirectory());

      await Promise.all(moduleNames.map(async (moduleName) => {
        const enumsDir = path.join(modulesDir, moduleName, 'enums');

        if (fs.existsSync(enumsDir)) {
          // 读取每个模块下的 enums 目录中的所有文件
          const enumFiles = fs.readdirSync(enumsDir);

          await Promise.all(enumFiles.map(async (file) => {
            if (file.endsWith('.ts') || file.endsWith('.js')) {
              const enumPath = path.join(enumsDir, file);
              let enumModule;

              try {
                // 使用 require 动态加载模块
                enumModule = require(enumPath);
                await this.processEnumModule(enumModule);
                console.log(`Loaded enum: ${enumPath}`);
              } catch (error) {
                console.error(`Failed to load enum: ${enumPath}`, error);
              }
            }
          }));
        } else {
          console.warn(`No enums directory found for module: ${moduleName}`);
        }
      }));
    } catch (error) {
      console.error('Error loading enums:', error);
    }
  }

  private async processEnumModule(module: any) {
    for (const key in module) {
      const clazz = module[key];
      if (typeof clazz === 'function' && Reflect.hasMetadata('dictKey', clazz)) {
        const dictKey = Reflect.getMetadata('dictKey', clazz);
        const dictName = Reflect.getMetadata('dictName', clazz);
        const model = this.handleDictEnum(clazz, { key: dictKey, name: dictName });
        this.dictList.push(model);
        this.dictMap.set(dictKey, model);
      }
    }
  }

  private handleDictEnum(clazz: any, enumCode: { key: string; name: string }): DictModel {
    const model: DictModel = {
      name: enumCode.name,
      dictKey: enumCode.key,
      items: [],
    };

    // 假设每个枚举成员实现了 CodedEnum 接口
    Object.values(clazz).forEach((item: any) => {
      if (item instanceof clazz && typeof item.getCode === 'function' && typeof item.getMessage === 'function') {
        model.items.push({
          name: item.getMessage(),
          dictItemKey: item.getCode().toString(),
          dictItemValue: item.getCode(),
        });
      }
    });

    return model;
  }

  public getDictList(): DictModel[] {
    return this.dictList;
  }

  public getDictMap(): Map<string, DictModel> {
    return this.dictMap;
  }
}

// 导出单例获取方法
export default function getEnumParser(baseDir: string): EnumParser {
  return EnumParser.getInstance(baseDir);
}