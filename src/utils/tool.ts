import { createHash } from 'crypto';
import { getMetadataArgsStorage, Repository } from 'typeorm';
import { ServiceException } from './service-exception';

// 创建一个函数来生成 MD5 哈希值
export const md5Password=(password: string, salt: string): string => {
  const hash = createHash('md5');
  hash.update(password + salt);
  return hash.digest('hex');
}
// 下划线转小驼峰
export const underlineToCamel=(str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}
// 小驼峰转下划线
export const camelToUnderline=(str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

// 增加逻辑删除条件
export const addLogicDeleteCondition = (qb: any, repository: Repository<any>) =>{
  const metadataArgsStorage = getMetadataArgsStorage();
  const tableMetadata: any = metadataArgsStorage.tables.find((table: any) => table.target === repository.target);

  if (tableMetadata && tableMetadata.options && tableMetadata.options.logicDeleteColumn) {
    const logicDeleteColumn = tableMetadata.options.logicDeleteColumn;
    qb.andWhere(`entity.${logicDeleteColumn} = 0`);
  }
}
// 判断是否存在逻辑删除字段
export const hasLogicDeleteColumn = (repository: Repository<any>): boolean => {
  const metadataArgsStorage = getMetadataArgsStorage();
  const tableMetadata: any = metadataArgsStorage.tables.find((table: any) => table.target === repository.target);

  return tableMetadata && tableMetadata.options && tableMetadata.options.logicDeleteColumn;
}
/**
 * 校验唯一性
 * @param repository 
 * @param column 
 * @param value 
 * @param id 
 * @param error 
 */
export const checkUnique = (repository: Repository<any>,column: string,value: any, id: number | string | undefined,error: string)=>{
  return repository.findOne({
    where: {
      [underlineToCamel(column)]: value,
      id: id ? { $ne: id } : undefined
    }
  }).then((entity: any) => {
    if (entity) {
      ServiceException.throwBiz(99999999, error)
    }
  });
}
// 生成随机字符串，长度可自定义
export const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}