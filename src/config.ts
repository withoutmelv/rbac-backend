
class BaseConfig {
  public DEBUG: boolean = true;
  public APP_AUTHOR: string = "rbac";
  public WHITE_LIST: string[] = [
    '/sys/login',
    '/sys/logout',
    '/sys/getCaptchaOpenFlag'
  ];
  public DB_HOST: string = process.env.DB_HOST || "172.16.31.160";
  public DB_PORT: number = parseInt(process.env.DB_PORT || "3306", 10);
  public DB_NAME: string = process.env.DB_NAME || "sys";
  public DB_USER: string = process.env.DB_USER || "root";
  public DB_PASSWORD: string = process.env.DB_PASSWORD || "8Eli#gr#AUk";
  public SQL_ECHO: boolean = false;
  public DEFAULT_PASSWORD: string = process.env.M_DEFAULT_PASSWORD || "123456";
}

class Development extends BaseConfig {
  public NODE_ENV: string = "development";
  public TESTING: boolean = true;
  public SQL_ECHO: boolean = true; // Print SQL
}

class Test extends BaseConfig {
  public NODE_ENV: string = "test";
  public TESTING: boolean = true;
}

class Demo extends BaseConfig {
  public NODE_ENV: string = "demo";
  public TESTING: boolean = true;
  public BLACK_LIST: string[] = [
    "/sys/**/save",
    "/sys/**/update",
    "/sys/**/remove",
    "/sys/user/updatePwd",
    "/sys/user/locked",
    "/sys/user/unLocked",
    "/sys/user/grantRole",
    "/wf/**/remove",
    "/sys/rbac/saveRoleMenu",
    "/sys/rbac/saveUserRole",
    "/sys/rbac/removeUserRole",
    "/sys/menu/syncRoute",
    "/dev/**/save",
    "/dev/**/update",
    "/dev/**/remove",
    "/dev/schema/importTable",
    "/sys/user/logout**",
    "/sys/user/kickout**",
    "/sys/fileInfo/upload",
  ];
}

class Production extends BaseConfig {
  public NODE_ENV: string = "production";
  public DEBUG: boolean = false;
  public TESTING: boolean = false;
}

export const getConfig = (): BaseConfig => {
  const env = process.env.NODE_ENV || "development";
  switch (env) {
    case "test":
      return new Test();
    case "demo":
      return new Demo();
    case "prod":
    case "production":
      return new Production();
    default:
      return new Development();
  }
}
