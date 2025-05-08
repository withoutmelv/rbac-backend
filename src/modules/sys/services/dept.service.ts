import { In, Repository } from "typeorm";
import { AppDataSource } from "../../../utils/data-source";
import { Dept } from "../entities/dept";
import { plainToClass } from "class-transformer";
import { generateId } from "../../../utils/snowflake-id-generator";
import { getLoginUserId } from "../../../middlewares/auth-middleware";
import { hasLogicDeleteColumn } from "../../../utils/tool";
import { DeptPageParam, DeptParam } from "../params/dept.param";
import { TreeTool } from "../../../utils/tree-tool";

class DeptService{
    deptRepository: Repository<Dept>;
    constructor() {
        this.deptRepository = AppDataSource.manager.getRepository(Dept)
    }
    async save(param: DeptParam): Promise<void> {
        // 自动映射到 Role 实体
        const entity = plainToClass(Dept, param, {
            excludeExtraneousValues: true, // 排除多余的属性,
        });
        if(param.leaderIdList){
            entity.leaderIds = param.leaderIdList.join(',')
        }
        entity.id = generateId()
        const now = new Date();
        const userId = getLoginUserId();
        entity.createTime = now;
        entity.createUser = userId;
        entity.updateTime = now;
        entity.updateUser = userId;
        await this.deptRepository.save(entity);
    }
    async remove(ids: Array<string>): Promise<void> {
        if(hasLogicDeleteColumn(this.deptRepository)){
          await this.deptRepository.update({ id: In(ids) }, { isDeleted: 1 });
        } else {
          await this.deptRepository.remove(await this.deptRepository.findBy({ id: In(ids) }));
        }
    }
    async update(param: DeptParam): Promise<void> {
      // 自动映射到 Role 实体
      const entity = plainToClass(Dept, param, {
          excludeExtraneousValues: true, // 排除多余的属性,
      });
      if(param.leaderIdList){
        entity.leaderIds = param.leaderIdList.join(',')
      }
      const now = new Date();
      const userId = getLoginUserId();
      entity.updateTime = now;
      entity.updateUser = userId;
      await this.deptRepository.update({ id: entity.id }, entity);
  }
    // 分页查询方法
    async page(param: DeptPageParam): Promise<{ rows: Dept[], recordCount: number, totalPage: number }> {
        return param.findWithQuery(this.deptRepository);
    }
    // 详情
    async detail(id: string): Promise<Dept | null> {
        const data = await this.deptRepository.findOneBy({ id });
        if(data && data.leaderIds){
            data.leaderIdList = data.leaderIds.split(',')
        }
        return data;
    }
    // 获取所有部门列表
    async list(param: DeptPageParam): Promise<Dept[]> {
        param.pageSize = 10000;
        return param.findWithQueryList(this.deptRepository);
    }
    // 获取部门树
    async tree(param: DeptPageParam): Promise<Dept[]> {
        param.pageSize = 10000;
        const listData = await param.findWithQueryList(this.deptRepository);
        return TreeTool.listToTree(listData)
    }
}
export default  new DeptService();