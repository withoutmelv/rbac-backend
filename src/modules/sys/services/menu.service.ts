import { EntityManager, In, Repository } from "typeorm";
import { AppDataSource } from "../../../utils/data-source";
import { Menu } from "../entities/menu";
import { plainToClass } from "class-transformer";
import { generateId } from "../../../utils/snowflake-id-generator";
import { getLoginUserId, isSuperAdmin } from "../../../middlewares/auth-middleware";
import { hasLogicDeleteColumn } from "../../../utils/tool";
import { MenuPageParam, MenuParam } from "../params/menu.param";
import { TreeTool } from "../../../utils/tree-tool";
import { YesNo } from "../enums/yes-no.enum";
import { RoleMenu } from "../entities/role-menu";
import rbacService from "./rbac.service";

class MenuService{
    menuRepository: Repository<Menu>;
    roleMenuRepository: Repository<any>;
    constructor() {
        this.menuRepository = AppDataSource.manager.getRepository(Menu)
        this.roleMenuRepository = AppDataSource.manager.getRepository(RoleMenu)
    }
    async save(param: MenuParam): Promise<void> {
        // 自动映射到 Menu 实体
        const entity = plainToClass(Menu, param, {
            excludeExtraneousValues: true, // 排除多余的属性,
        });

        entity.id = generateId()
        const now = new Date();
        const userId = getLoginUserId();
        entity.createTime = now;
        entity.createUser = userId;
        entity.updateTime = now;
        entity.updateUser = userId;
        await this.menuRepository.save(entity);
    }
    async remove(ids: Array<string>): Promise<void> {
        if(hasLogicDeleteColumn(this.menuRepository)){
          await this.menuRepository.update({ id: In(ids) }, { isDeleted: 1 });
        } else {
          await this.menuRepository.remove(await this.menuRepository.findBy({ id: In(ids) }));
        }
    }
    async update(param: MenuParam): Promise<void> {
      // 自动映射到 Menu 实体
      const entity = plainToClass(Menu, param, {
          excludeExtraneousValues: true, // 排除多余的属性,
      });
      const now = new Date();
      const userId = getLoginUserId();
      entity.updateTime = now;
      entity.updateUser = userId;
      await this.menuRepository.update({ id: entity.id }, entity);
  }
    // 分页查询方法
    async page(param: MenuPageParam): Promise<{ rows: Menu[], recordCount: number, totalPage: number }> {
        return param.findWithQuery(this.menuRepository);
    }
    // 详情
    async detail(id: string): Promise<Menu | null> {
        const data = await this.menuRepository.findOneBy({ id });
        return data;
    }
    // 获取所有菜单列表
    async list(param: MenuPageParam): Promise<Menu[]> {
        param.pageSize = 10000;
        return param.findWithQueryList(this.menuRepository);
    }
    // 获取菜单树
    async tree(param: MenuPageParam): Promise<Menu[]> {
        param.pageSize = 10000;
        const listData = await param.findWithQueryList(this.menuRepository);
        // 非超级管理员这里只返回所有菜单，非用户拥有的菜单设置disabled=true
        if(!isSuperAdmin() && param.filterByUser === 1){
            const menuIds = await rbacService.getMenuIdsByUserId(getLoginUserId())
            listData.forEach(item => {
                if(!menuIds.includes(item.id as string)){
                    item.disabled = true;
                }
            })
        }
        return TreeTool.listToTree(listData)
    }
    async appList():Promise<any> {
        return Promise.resolve([{
            label: '平台',
            value: 'platform'
        }]);
    }
    async syncRoute(appCode: string, paramList: any[]): Promise<void> {
        if(!appCode){
            appCode = 'platform';
        }
        // 同步规则:
        // 1.默认只同步四级数据(可用递归，也可使用四层遍历)
        // 2.以appCode,code为唯一标识进行同步
        // 3.只同步isSync=true或isSync=1的数据
        // 4.同步时，有变化时，要更新，也可全字段更新
        // 5.ext扩展信息存放到variable
        // 6. 当前端删除路由时，后端对应的也要删除掉
        await AppDataSource.transaction(async (transactionalEntityManager: EntityManager) => {
            const pidList: string[] = ["0"];
            const menusIds = await this.saveMenu(appCode, '0', pidList, paramList, 1, transactionalEntityManager);

            const delLambdaQueryWrapper = transactionalEntityManager
                .createQueryBuilder(Menu, 'menu')
                .where('menu.appCode = :appCode', { appCode })
                .andWhere('menu.id NOT IN (:...menusIds)', { menusIds })
                .andWhere('menu.isSync = :isSync', { isSync: YesNo.YES.getCode() });

            const delIds = (await delLambdaQueryWrapper.getMany()).map(item => item.id);

            if (delIds.length > 0) {
                await transactionalEntityManager.delete(Menu, { id: In(delIds) });
                await transactionalEntityManager.delete(RoleMenu, { menuId: In(delIds) });
            }
        });
      }
    
      private async saveMenu(
        appCode: string,
        parentId: string,
        pidList: string[],
        list: any[],
        maxLevel: number,
        transactionalEntityManager: EntityManager
    ): Promise<string[]> {
        if (!list || maxLevel > 4) return [];
    
        const menusIds: string[] = [];
        const inserts: Menu[] = [];
        const updates: Menu[] = [];
    
        for (const item of list) {
            if (item.isSync !== YesNo.YES.getCode()) continue;
    
            let menu: any = await this.findOneByAppCodeAndCode(appCode, item.code, transactionalEntityManager);
            if (!menu) {
                menu = new Menu();
                menu.id = generateId();
                menu.parentId = parentId;
                menu.appCode = appCode;
                Object.assign(menu, item, { variable: JSON.stringify(item.ext), pids: pidList.join(',') });
                inserts.push(menu);
            } else {
                if (menu.isSync === YesNo.YES.getCode()) {
                    Object.assign(menu, item, { variable: JSON.stringify(item.ext), pids: pidList.join(',') });
                    updates.push(menu);
                }
            }
            menusIds.push(menu.id);
    
            const newPidList = [...pidList, menu.id.toString()];
            const childIds = await this.saveMenu(appCode, menu.id, newPidList, item.children || [], maxLevel + 1, transactionalEntityManager);
            menusIds.push(...childIds);
        }
    
        if (inserts.length > 0) {
            await transactionalEntityManager.save(inserts);
        }
        if (updates.length > 0) {
            await transactionalEntityManager.save(updates);
        }
    
        return menusIds;
    }
    
    private async findOneByAppCodeAndCode(appCode: string, code: string, transactionalEntityManager: EntityManager): Promise<Menu | null> {
        return transactionalEntityManager.findOne(Menu, { where: { appCode, code } });
    }
}
export default  new MenuService();