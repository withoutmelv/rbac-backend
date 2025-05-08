export class LoginUserVO {
    /**
   * 用户ID
   */
  id?: string;

  /**
   * 用户名
   */
  userName?: string;

  /**
   * 姓名
   */
  realName?: string;

  /**
   * 昵称
   */
  nickName?: string;

  /**
   * 管理员类型
   */
  adminType?: number;

  /**
   * 角色ID集合
   */
  roleIds: Array<string> = [];

  /**
   * 角色名称集合，默认为空数组
   */
  roleNames: Array<string> = [];

  /**
   * 角色标识集合，默认为空数组
   */
  roleCodes: Array<string> = [];

  /**
   * 部门ID
   */
  deptId?: number;

  /**
   * 部门名称
   */
  deptName?: string;

  /**
   * 岗位ID
   */
  postId?: number;

  /**
   * 岗位名称
   */
  postName?: string;

  /**
   * 扩展信息，默认为新的 Dict 实例
   */
  ext: any = {};

  /**
   * 应用代码
   */
  appCode?: string;

  /**
   * 是否超级管理员
   */
  superAdmin?: boolean;

  /**
   * 登录时间戳
   */
  loginTimestamp?: number;

  /**
   * 登录ip
   */
  loginIp?: string;

  /**
   * 登录浏览器
   */
  loginBrowser?: string;

  /**
   * 用户关联的第三方账号列表，默认为空数组
   */
  relThirdAccountTypeList: Array<string> = []; 
  // 权限码
  perms: Array<string> = [];
}