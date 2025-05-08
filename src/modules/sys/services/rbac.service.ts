import { EntityManager, In } from "typeorm";
import { AppDataSource } from "../../../utils/data-source";
import { generateId } from "../../../utils/snowflake-id-generator";
import { Menu } from "../entities/menu";
import { RoleMenu } from "../entities/role-menu";
import { User } from "../entities/user";
import { UserRole } from "../entities/user-role";
import { getLoginUserId, isSuperAdmin } from "../../../middlewares/auth-middleware";

class RbacService {
  private roleMenuRepository = AppDataSource.manager.getRepository(RoleMenu);
  private menuRepository = AppDataSource.manager.getRepository(Menu);
  private userRepository = AppDataSource.manager.getRepository(User);
  private userRoleRepository = AppDataSource.manager.getRepository(UserRole);

  async getInCache(roleId: string, appCode: string): Promise<string[]> {
    const roleMenus = await this.roleMenuRepository.find({ where: { roleId } });
    const menuIds = roleMenus.map((rm) => rm.menuId);
    if(menuIds.length === 0) return []
    let queryBuilder = this.menuRepository.createQueryBuilder('menu')
      .where('menu.appCode = :appCode', { appCode });

    if (menuIds.length > 0) {
      queryBuilder = queryBuilder.andWhere('menu.id IN (:...menuIds)', { menuIds });
    }

    const menus = await queryBuilder.getMany();
    return Promise.resolve(menus.map((menu) => (menu.code as string)));
  }

  async getPermInCache(roleIds: string[], appCode: string): Promise<string[]> {
    if (roleIds.length === 0) return [];

    const perms = [];
    for (const roleId of roleIds) {
      perms.push(...await this.getInCache(roleId, appCode));
    }
    return [...new Set(perms)]; // 使用Set去重
  }

  async roleMenuIds(roleId: string): Promise<string[]> {
    const roleMenus = await this.roleMenuRepository.find({ where: { roleId } });
    return roleMenus.map((rm) => rm.menuId.toString());
  }

  async saveRoleMenu(roleMenus: any[]): Promise<void> {
    if (!roleMenus || roleMenus.length === 0) return;

    const roleId = roleMenus[0].roleId;
    await AppDataSource.transaction(async (transactionalEntityManager: EntityManager) => {
        
        transactionalEntityManager.delete(RoleMenu, { roleId });
        let menuIds: string[] = []
        const superAdmin = isSuperAdmin();
        if(!superAdmin){
            menuIds = await this.getMenuIdsByUserId(getLoginUserId());
        }
        const entities: RoleMenu[] = roleMenus.filter(item=>{
            if(superAdmin) return true;
            return menuIds.includes(item.menuId.toString());
        }).map(item => {
            const roleMenu: RoleMenu = new RoleMenu();
            roleMenu.id = generateId();
            roleMenu.roleId = roleId;
            roleMenu.menuId = item.menuId;
            return roleMenu;
        });

        await transactionalEntityManager.save(entities);
    })
    
  }

  async userListByRoleId(param: any): Promise<{ rows: User[], recordCount: number,totalPage: number }> {
    const roleId = param.roleId;
    const keywords = param.keywords;
    const pageNum = param.pageNum || 1;
    const pageSize = param.pageSize || 10;
    const userRoles = await this.userRoleRepository.find({ where: { roleId } });
    const userIds = userRoles.map((ur) => ur.userId);

    if (userIds.length === 0) return { rows: [], recordCount: 0, totalPage: 0 };

    let queryBuilder = this.userRepository.createQueryBuilder('user')
      .where('user.adminType != :adminType', { adminType: 1 })
      .andWhere('user.id IN (:...userIds)', { userIds });

    if (keywords) {
      queryBuilder = queryBuilder.andWhere('user.userName LIKE :keywords', { keywords: `%${keywords}%` });
    }

    const [items, total] = await queryBuilder
      .skip((pageNum - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { 
        rows: items,
        recordCount: total,
        totalPage: Math.ceil(total / pageSize) 
    };
  }

  async removeUserRole(userRoles: any[]): Promise<void> {
    if (!userRoles || userRoles.length === 0) return;

    for (const item of userRoles) {
      await this.userRoleRepository.delete({
        userId: item.userId,
        roleId: item.roleId,
      });
    }
  }

  async userListExcludeRoleId(param: any): Promise<{ rows: User[], recordCount: number,totalPage: number }> {
    
    const roleId = param.roleId;
    const keywords = param.keywords;
    const pageNum = param.pageNum || 1;
    const pageSize = param.pageSize || 10;

    const userRoles = await this.userRoleRepository.find({ where: { roleId } });
    const userIds = userRoles.map((ur) => ur.userId);

    let queryBuilder = this.userRepository.createQueryBuilder('user')
      .where('user.adminType != :adminType', { adminType: 1 });

    if (userIds.length !== 0) {
      queryBuilder = queryBuilder.andWhere('user.id NOT IN (:...userIds)', { userIds });
    }

    if (keywords) {
      queryBuilder = queryBuilder.andWhere('(user.userName LIKE :keywords OR user.realName LIKE :keywords)', { keywords: `%${keywords}%` });
    }

    const [items, total] = await queryBuilder
      .skip((pageNum - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

      return { 
        rows: items,
        recordCount: total,
        totalPage: Math.ceil(total / pageSize) 
    };
  }

  async saveUserRole(userRoles: any[]): Promise<void> {
    if (!userRoles || userRoles.length === 0) return;

    for (const userRole of userRoles) {
      const count = await this.userRoleRepository.count({
        where: {
          roleId: userRole.roleId,
          userId: userRole.userId,
        },
      });

      if (count === 0) {
        userRole.id = generateId();
        await this.userRoleRepository.save(userRole);
      }
    }
  }
    // 新增方法：根据用户ID获取菜单ID列表
    async getMenuIdsByUserId(userId: string): Promise<string[]> {
        // 获取某个用户的角色ID
        const userRoles = await this.userRoleRepository.find({ where: { userId } });
        const roleIds = userRoles.map((ur) => ur.roleId);
    
        if (roleIds.length === 0) return [];
    
        // 获取角色菜单关系
        const roleMenus = await this.roleMenuRepository.find({ where: { roleId: In(roleIds) } });
    
        // 获取菜单ID
        const menuIds = roleMenus.map((rm) => rm.menuId.toString());
    
        return menuIds;
      }
}

export default new RbacService();