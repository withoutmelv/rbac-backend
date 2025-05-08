import { IsNotEmpty } from "class-validator";
import { PageParam } from "../../../utils/page-param";
import { Post } from "../entities/post";

export class PostParam{
    id?: string;
    @IsNotEmpty()
    name?: string;
    @IsNotEmpty()
    code?: string;
    @IsNotEmpty()
    enabled?: number;
    sort?: number;
    remark?: string;
}
export class PostPageParam extends PageParam<Post>{
    
}