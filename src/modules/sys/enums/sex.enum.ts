
import { DictEnum } from "../../../decorators/dict-enum.decorator";
import { CodedEnum } from "../../../types/coded-enum";

@DictEnum({ key: 'sex', name: '性别' })
export class SexEnum implements CodedEnum {
  static MAN = new SexEnum(1, '男');
  static WOMAN = new SexEnum(2, '女');
  static UN_KNOW = new SexEnum(3, '未知');

  private constructor(private code: number, private message: string) {}

  getCode(): number {
    return this.code;
  }

  getMessage(): string {
    return this.message;
  }
}