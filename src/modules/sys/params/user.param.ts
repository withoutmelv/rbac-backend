import { IsNotEmpty } from "class-validator";
import { PageParam } from "../../../utils/page-param";
import { User } from "../entities/user";

export class UserParam{
    id?: string;
    @IsNotEmpty()
    userName!: string;
    @IsNotEmpty()
    realName!: string;
    nickName?: string;
    avatar?: string;
    password?: string;
    salt?: string;
    @IsNotEmpty()
    mobilePhone!: string;
    tel?: string;
    email?: string;
    adminType?: number;
    sex!: number;
    isLocked!: number;
    @IsNotEmpty()
    deptId?: string;
    @IsNotEmpty()
    postId?: string;
    remark?: string;

}
export class UserPageParam extends PageParam<User>{
    
}