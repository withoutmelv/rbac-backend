
import { DictEnum } from "../../../decorators/dict-enum.decorator";
import { CodedEnum } from "../../../types/coded-enum";

@DictEnum({ key: 'yes_no', name: '是否' })
export class YesNo implements CodedEnum {
  static YES = new YesNo(1, '是');
  static NO = new YesNo(0, '否');

  private constructor(private code: number, private message: string) {}

  getCode(): number {
    return this.code;
  }

  getMessage(): string {
    return this.message;
  }
}