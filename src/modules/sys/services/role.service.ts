import { In, Repository } from "typeorm";
import { AppDataSource } from "../../../utils/data-source";
import { Role } from "../entities/role";
import { RolePageParam, RoleParam } from "../params/role.param";
import { plainToClass } from "class-transformer";
import { generateId } from "../../../utils/snowflake-id-generator";
import { getLoginUserId } from "../../../middlewares/auth-middleware";
import { hasLogicDeleteColumn } from "../../../utils/tool";

class RoleService{
    roleRepository: Repository<Role>;
    constructor() {
        this.roleRepository = AppDataSource.manager.getRepository(Role)
    }
    async save(param: RoleParam): Promise<void> {
        // 自动映射到 Role 实体
        const entity = plainToClass(Role, param, {
            excludeExtraneousValues: true, // 排除多余的属性,
        });
        entity.id = generateId()
        entity.appCode = 'platform'
        const now = new Date();
        const userId = getLoginUserId();
        entity.createTime = now;
        entity.createUser = userId;
        entity.updateTime = now;
        entity.updateUser = userId;
        await this.roleRepository.save(entity);
    }
    async remove(ids: Array<string>): Promise<void> {
        if(hasLogicDeleteColumn(this.roleRepository)){
          await this.roleRepository.update({ id: In(ids) }, { isDeleted: 1 });
        } else {
          await this.roleRepository.remove(await this.roleRepository.findBy({ id: In(ids) }));
        }
    }
    async update(param: RoleParam): Promise<void> {
      // 自动映射到 Role 实体
      const entity = plainToClass(Role, param, {
          excludeExtraneousValues: true, // 排除多余的属性,
      });
      const now = new Date();
      const userId = getLoginUserId();
      entity.updateTime = now;
      entity.updateUser = userId;
      await this.roleRepository.update({ id: entity.id }, entity);
  }
    // 分页查询方法
    async page(param: RolePageParam): Promise<{ rows: Role[], recordCount: number, totalPage: number }> {
        return param.findWithQuery(this.roleRepository);
    }
    // 详情
    async detail(id: string): Promise<Role | null> {
        const data = await this.roleRepository.findOneBy({ id });
        return data;
    }
}
export default  new RoleService();