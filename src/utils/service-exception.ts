export class ServiceException extends Error {
    public readonly code: number;
    public readonly errorMessage: string;
  
    constructor(code: number, errorMessage: string) {
      super(errorMessage);
      Object.setPrototypeOf(this, new.target.prototype); // 恢复原型链
  
      this.code = code;
      this.errorMessage = errorMessage;
  
      Error.captureStackTrace(this);
    }

    static throwBiz(code: number, message: string): never {
      throw new ServiceException(code, message);
    }
  
  }