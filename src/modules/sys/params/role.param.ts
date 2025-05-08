import { IsNotEmpty } from "class-validator";
import { Role } from "../entities/role";
import { PageParam } from "../../../utils/page-param";

export class RoleParam{
    id?: string;
    appCode?: string;
    @IsNotEmpty()
    name?: string;
    @IsNotEmpty()
    code?: string;
    @IsNotEmpty()
    roleType?: number;
    @IsNotEmpty()
    enabled?: number;
    remark?: string;
}
export class RolePageParam extends PageParam<Role>{
    
}