
import { DictEnum } from "../../../decorators/dict-enum.decorator";
import { CodedEnum } from "../../../types/coded-enum";

@DictEnum({ key: 'sys_role_role_type', name: '角色类型' })
export class RoleTypeEnum implements CodedEnum {

  static COMMON_ROLE = new RoleTypeEnum(1, '普通角色');
  static DATA_ROLE = new RoleTypeEnum(2, '数据角色');
  static WORKFLOW_ROLE = new RoleTypeEnum(3, '工作流');

  private constructor(private code: number, private message: string) {}

  getCode(): number {
    return this.code;
  }

  getMessage(): string {
    return this.message;
  }
}