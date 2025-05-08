import { In, Repository } from "typeorm";
import { AppDataSource } from "../../../utils/data-source";
import { PostPageParam, PostParam } from "../params/post.param";
import { Post } from "../entities/post";
import { plainToClass } from "class-transformer";
import { generateId } from "../../../utils/snowflake-id-generator";
import { getLoginUserId } from "../../../middlewares/auth-middleware";
import { hasLogicDeleteColumn } from "../../../utils/tool";

class PostService{
    postRepository: Repository<Post>;
    constructor() {
        this.postRepository = AppDataSource.manager.getRepository(Post)
    }
    async save(param: PostParam): Promise<void> {
        // 自动映射到 Role 实体
        const entity = plainToClass(Post, param, {
            excludeExtraneousValues: true, // 排除多余的属性,
        });
        entity.id = generateId()
        const now = new Date();
        const userId = getLoginUserId();
        entity.createTime = now;
        entity.createUser = userId;
        entity.updateTime = now;
        entity.updateUser = userId;
        await this.postRepository.save(entity);
    }
    async remove(ids: Array<string>): Promise<void> {
        if(hasLogicDeleteColumn(this.postRepository)){
          await this.postRepository.update({ id: In(ids) }, { isDeleted: 1 });
        } else {
          await this.postRepository.remove(await this.postRepository.findBy({ id: In(ids) }));
        }
    }
    async update(param: PostParam): Promise<void> {
      // 自动映射到 Role 实体
      const entity = plainToClass(Post, param, {
          excludeExtraneousValues: true, // 排除多余的属性,
      });
      const now = new Date();
      const userId = getLoginUserId();
      entity.updateTime = now;
      entity.updateUser = userId;
      await this.postRepository.update({ id: entity.id }, entity);
  }
    // 分页查询方法
    async page(param: PostPageParam): Promise<{ rows: Post[], recordCount: number, totalPage: number }> {
               
        return param.findWithQuery(this.postRepository);
    }
    // 详情
    async detail(id: string): Promise<Post | null> {
        return await this.postRepository.findOneBy({ id });
    }
    
}
export default  new PostService();