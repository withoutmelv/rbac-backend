
import { DictEnum } from "../../../decorators/dict-enum.decorator";
import { CodedEnum } from "../../../types/coded-enum";

@DictEnum({ key: 'sys_user_admin_type', name: '管理员类型' })
export class AdminTypeEnum implements CodedEnum {

  static SUPER_ADMIN = new AdminTypeEnum(1, '超级管理员');
  static COMMON_ADMIN = new AdminTypeEnum(2, '普通管理员');

  private constructor(private code: number, private message: string) {}

  getCode(): number {
    return this.code;
  }

  getMessage(): string {
    return this.message;
  }
}