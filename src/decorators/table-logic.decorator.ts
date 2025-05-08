// src/decorators/table-logic.decorator.ts
import { getMetadataArgsStorage } from 'typeorm';
import { camelToUnderline } from '../utils/tool';

export const TableLogic = (target: Object, propertyName: string) =>{
  const metadataArgsStorage = getMetadataArgsStorage();
  const name = camelToUnderline(propertyName)
  metadataArgsStorage.columns.push({
    target: target.constructor,
    propertyName: propertyName,
    options: {
      name: name,
      type: 'tinyint',
      default: 0,
      comment: '是否删除',
    },
  } as any);

  // 添加自定义元数据
  metadataArgsStorage.tables.push({
    target: target.constructor,
    options: {
      logicDeleteColumn: name,
    },
  } as any);
}