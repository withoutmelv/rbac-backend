import { IsNotEmpty } from "class-validator";
import { PageParam } from "../../../utils/page-param";

export class MarketParam{
    id?: string;
    @IsNotEmpty()
    title?: string;
    @IsNotEmpty()
    code?: string;
    @IsNotEmpty()
    description?: string;
    icon?: string;
    iconColor?: string;

}
export class MarketPageParam extends PageParam<any>{
    
}