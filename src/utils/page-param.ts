import { getMetadataArgsStorage, Repository } from "typeorm";
import { addLogicDeleteCondition } from "./tool";

export class PageParam<T>{
  pageNum?: number;
  pageSize?: number;
  keywords?: string;
  searchKeys?: string;
  orderBy?: string;
  labelKey?: string;
  valueKey?: string;
  includeIds?: string[];
  includeType?: number;
  extFieldNames?: string;
  /**
   * 构建并执行查询
   * @param queryParam 查询参数
   * @returns 查询结果
   */
  async findWithQuery(repository: any, rowHandler=(_item: T)=>{}, customQb=(qb: any)=>{ return qb}):Promise<{ rows: T[], recordCount: number, totalPage: number }> {
    if(!this.pageNum){
      this.pageNum = 1;
    }
    if(!this.pageSize){
      this.pageSize = 10;
    }
    let queryBuilder = this.buildQueryBuilder(repository);
    if(customQb){
      queryBuilder = customQb(queryBuilder);
    }
    const [data, total] = await queryBuilder.getManyAndCount();

    // 创建新的数组来存储处理后的数据
    const processedData: T[] = [];
    await Promise.all(data.map(async (item: T) => {
      const newItem = { ...item }; // 深拷贝 item
      await rowHandler(newItem); // 应用 rowHandler
      processedData.push(newItem); // 将处理后的 item 添加到新数组
    }));

    return {
      rows: processedData,
      recordCount: total,
      totalPage: Math.ceil(total / this.pageSize)
    };
  }
  /**
   * 构建并执行查询
   * @param queryParam 查询参数
   * @returns 查询结果
   */
  async findWithQueryList(repository: any):Promise<T[]> {
    const queryBuilder = this.buildQueryBuilder(repository);
    return queryBuilder.getMany();
  }
  /**
   * 构建查询构造器
   * @param queryParam 查询参数
   * @returns QueryBuilder
   */
  private buildQueryBuilder(repository: any) {
    const qb = repository.createQueryBuilder('entity');
    const queryParam = this;
    if(!queryParam.pageNum){
      queryParam.pageNum = 1;
    }
    if(!queryParam.pageSize){
      queryParam.pageSize = 10;
    }
    // 处理分页
    if (this.pageNum && this.pageSize) {
      qb.skip((queryParam.pageNum - 1) * queryParam.pageSize).take(queryParam.pageSize);
    }

    // 处理排序
    if (queryParam.orderBy) {
      const orderByArr = queryParam.orderBy.split(',');
      orderByArr.forEach(order => {
        const [column, direction] = order.trim().split(/\s+/);
        qb.addOrderBy(`entity.${column}`, direction?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
      });
    }

    // 构建查询条件
    Object.keys(queryParam).forEach(key => {
      if (key.startsWith('m_')) {
        const [_, type, column] = key.split('_');
        const value = queryParam[key as keyof PageParam<T>]; // 使用类型断言

        switch (type.toUpperCase()) {
          case 'EQ':
            qb.andWhere(`entity.${column} = :${column}`, { [column]: value });
            break;
          case 'NE':
            qb.andWhere(`entity.${column} != :${column}`, { [column]: value });
            break;
          case 'GT':
            qb.andWhere(`entity.${column} > :${column}`, { [column]: value });
            break;
          case 'GE':
            qb.andWhere(`entity.${column} >= :${column}`, { [column]: value });
            break;
          case 'LT':
            qb.andWhere(`entity.${column} < :${column}`, { [column]: value });
            break;
          case 'LE':
            qb.andWhere(`entity.${column} <= :${column}`, { [column]: value });
            break;
          case 'LIKE':
            qb.andWhere(`entity.${column} LIKE :${column}`, { [column]: `%${value}%` });
            break;
          case 'NLIKE':
            qb.andWhere(`entity.${column} NOT LIKE :${column}`, { [column]: `%${value}%` });
            break;
          case 'LLIKE':
            qb.andWhere(`entity.${column} LIKE :${column}`, { [column]: `%${value}` });
            break;
          case 'RLIKE':
            qb.andWhere(`entity.${column} LIKE :${column}`, { [column]: `${value}%` });
            break;
          case 'BT':
            if (Array.isArray(value) && value.length === 2) {
              qb.andWhere(`entity.${column} BETWEEN :min AND :max`, { min: value[0], max: value[1] });
            }
            break;
          case 'IN':
            if (Array.isArray(value)) {
              qb.andWhere(`entity.${column} IN (:...ids)`, { ids: value });
            }
            break;
          case 'NIN':
            if (Array.isArray(value)) {
              qb.andWhere(`entity.${column} NOT IN (:...ids)`, { ids: value });
            }
            break;
          default:
            break;
        }
      }
    });

    // 关键字模糊查询
    if (queryParam.keywords && queryParam.searchKeys) {
      const keywordConditions = queryParam.searchKeys.split(',').map(searchKey =>
        `entity.${searchKey} LIKE :keyword`
      );
      qb.andWhere(`(${keywordConditions.join(' OR ')})`, { keyword: `%${queryParam.keywords}%` });
    }
    addLogicDeleteCondition(qb, repository);
    return qb;
  }
}

