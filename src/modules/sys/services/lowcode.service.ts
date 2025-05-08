import { AppDataSource } from "../../../utils/data-source";
import { PageParam } from "../../../utils/page-param";
import { underlineToCamel } from "../../../utils/tool";
export interface LabelValueVO {
  label: string;
  value: any;
  ext?: Record<string, any>;
}
class LowcodeService {
  constructor() {
        
    }
    async select(module: string, tableName: string, param: PageParam<any>): Promise<LabelValueVO[]> {
      const entity: any = AppDataSource.entityMetadatas.find(entity=>{
        const delModule = entity.tableName.replace(`${module}_`, '');
        return underlineToCamel(delModule) === tableName;
      })
      if(!entity){
        return Promise.resolve([]);
      }
      const repository = AppDataSource.getRepository(entity); // 构建仓库
      const queryBuilder = repository.createQueryBuilder(tableName);
      // 设置默认键值
      const labelKey = param.labelKey || 'name';
      const valueKey = param.valueKey || 'id';
    
      // 构造查询条件
      if (param.includeIds && param.includeType === 2) {
        if(!param.includeIds.length){
          param.includeIds=['-1']
        }
        queryBuilder.where(`${valueKey} IN (:...includeIds)`, { includeIds: param.includeIds });
      }
    
      // 执行查询
      let entities = await queryBuilder.getMany();
    
      // 如果是增量类型，则添加额外的数据
      if (param.includeIds && param.includeType === 1) {
        if(!param.includeIds.length){
          param.includeIds=['-1']
        }
        const valueList = entities.map(entity => entity[valueKey]);
        const newQueryBuilder = repository.createQueryBuilder(tableName);
        if (valueList.length > 0) {
          newQueryBuilder.where(`${valueKey} IN (:...includeIds)`, { includeIds: param.includeIds })
                         .andWhere(`${valueKey} NOT IN (:...excludeIds)`, { excludeIds: valueList });
        } else {
          newQueryBuilder.where(`${valueKey} IN (:...includeIds)`, { includeIds: param.includeIds });
        }
        const addEntities = await newQueryBuilder.getMany();
        entities = [...entities, ...addEntities];
      }
    
      // 处理扩展字段
      const hasExt = param.extFieldNames && param.extFieldNames.length > 0;
      return entities.map(entity => ({
        label: String(entity[labelKey]),
        value: entity[valueKey],
        ext: hasExt ? this.parseExtFields(entity, (param.extFieldNames || '').split(',')) : undefined,
      }));
    }
    
    parseExtFields(entity: any, fieldNames: string[]): Record<string, any> {
      return fieldNames.reduce((acc, fieldName) => {
        if (entity[fieldName] !== undefined) {
          acc[fieldName] = entity[fieldName];
        }
        return acc;
      }, {} as Record<string, any>);
    }
}

export default  new LowcodeService();