import { App } from "../models/market";
import { MarketParam, MarketPageParam } from "../params/market.param";
import { generateId } from "../../../utils/snowflake-id-generator";


class MarketService{
    constructor() {
    }
    async save(param: MarketParam): Promise<void> {
        
        if (!param.id) {
            param.id = generateId();
        }
        console.log("xxxxxxxxxxx", param)
       const newMarket = new App(param);
       await newMarket.save()
    }
    async remove(ids: Array<string>): Promise<void> {
        
    }
    async update(param: MarketParam): Promise<void> {
        
    }
    // 分页查询方法
    async page(param: MarketPageParam): Promise<any> {
        const data = await App.find({}).lean();
        console.log(data);
        return data
    }
    // 详情
    async detail(id: string): Promise<any> {
        
    }

}
export default new MarketService();