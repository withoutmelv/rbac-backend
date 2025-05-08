import jwt from 'jsonwebtoken';

// JWT 秘钥（在生产环境中应该保存在安全的地方）
const JWT_SECRET = 'your_jwt_secret'; // 注意：这里只是一个示例，请使用更安全的方法存储秘钥

// 生成 JWT Token
function generateJwtToken(payload: object, options?: jwt.SignOptions): string {
  return jwt.sign(payload, JWT_SECRET, { ...options, expiresIn: '2h' }); // 设置 token 过期时间为 2 小时
}
interface TokenStore {
    createToken(data: any): string;
    verify(token: any): boolean;
    getInfo(token: any): any;
    checkAccess(token: string, access: string | string[],mode?: string): boolean;
}
class JwtTokenStore implements TokenStore {
    
    verify(token: any): boolean {
        try{
            jwt.verify(token, JWT_SECRET)
            return true;
        } catch(err){
            return false
        }
    }
    createToken(data: any): string {
        return generateJwtToken(data)
    }
    getInfo(token: any): any {
        return jwt.decode(token)
    }
    checkAccess(token: string, access: string | string[],mode?: string): boolean {
        const user = this.getInfo(token);
        if(user.superAdmin) return true;
        const perms = user.perms || [];
        const accessSet = new Set(Array.isArray(access) ? access : access.split(','));
        const permsSet = new Set(perms);

        if (mode === 'or') {
            // 如果是 OR 模式，检查 accessSet 中的任何一个元素是否存在于 permsSet 中
            return [...accessSet].some(permission => permsSet.has(permission));
        } else {
            // 如果是 AND 模式，检查 accessSet 中的所有元素是否都存在于 permsSet 中
            return [...accessSet].every(permission => permsSet.has(permission));
        } 
    }
}

export class TokenManager {
    private tokenStore: TokenStore;
    static instance: any;
    constructor() {
        this.tokenStore = new JwtTokenStore();
    }
    createToken(data: any): string {
        return this.tokenStore.createToken(data);
    }
    verify(token: any): boolean {
        return this.tokenStore.verify(token);
    }
    getInfo(token: any): any {
        return this.tokenStore.getInfo(token);
    }
    checkAccess(token: string, access: string | string[],mode?: string): boolean {
        return this.tokenStore.checkAccess(token, access,mode);
    }
    static getInstance(): TokenManager {
        if (!TokenManager.instance) {
            TokenManager.instance = new TokenManager();
        }
        return TokenManager.instance;
    }
}