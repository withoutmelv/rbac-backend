import { IsNotEmpty } from "class-validator";
import { PageParam } from "../../../utils/page-param";
import { Dept } from "../entities/dept";

export class DeptParam{
    id?: string;
    parentId?: string;  
    @IsNotEmpty()
    name?: string;
    @IsNotEmpty()
    code?: string;
    @IsNotEmpty()
    enabled?: number;
    sort?: number;
    leaderIds?: string;
    leaderIdList?: Array<string>;
    mainLeaderId?: string;
    remark?: string;
}
export class DeptPageParam extends PageParam<Dept>{
    
}