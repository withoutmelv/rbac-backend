import { IsNotEmpty } from "class-validator";
import { Menu } from "../entities/menu";
import { PageParam } from "../../../utils/page-param";

export class MenuParam{
    id?: string;
    appCode?: string | null;
    parentId?: string;
    @IsNotEmpty()
    name?: string;
    @IsNotEmpty()
    code?: string;
    pids?: string | null;
    type?: number | null;
    sort?: number;
    path?: string | null;
    component?: string | null;
    icon?: string | null;
    isShow?: number;
    isLink?: number;
    url?: string | null;
    enabled?: number;
    openType?: number | null;
    isCache?: number;
    isSync?: number | null;
    variable?: string | null;
}
export class MenuPageParam extends PageParam<Menu>{
    filterByUser?: number;
}