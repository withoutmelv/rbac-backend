// src/utils/common-response.ts

export interface CommonResult<T> {
  code: number;
  msg: string;
  data?: T;
}

export class R<T> {
  private result: CommonResult<T>;

  constructor(code: number, msg: string, data?: T) {
    this.result = { code, msg, data };
  }

  static ok(data?: any): CommonResult<any> {
    return new R(0, '成功', data).build();
  }

  static okWithMsg(msg: string, data?: any): CommonResult<any> {
    return new R(0, msg, data).build();
  }

  static fail(code: number, msg: string, data?: any): CommonResult<any> {
    return new R(code, msg, data).build();
  }

  static failWithEnum(errEnum: { code: number; message: string }, data?: any): CommonResult<any> {
    return new R(errEnum.code, errEnum.message, data).build();
  }

  static failWithMsg(msg: string): CommonResult<any> {
    return new R(99999999, msg, null).build();
  }

  static data(data: any): CommonResult<any> {
    return new R(0, '成功', data).build();
  }

  build(): CommonResult<T> {
    return this.result;
  }
}