import { Repository } from "typeorm";
import { AppDataSource } from "../../../utils/data-source";
import { Dict } from "../entities/dict";
import { DictItem } from "../entities/dict-item";
import { DictModel } from "../../../types/dict";
import { EnumParser } from "../../../utils/enum-parser";

class DictService{
    dictRepository: Repository<Dict>;
    dictItemRepository: Repository<DictItem>;
    constructor() {
        this.dictRepository = AppDataSource.manager.getRepository(Dict)
        this.dictItemRepository = AppDataSource.manager.getRepository(DictItem)
    }
    async getByDictType(dictType: string): Promise<any> {

            const data: DictModel | undefined = EnumParser.getInstance(__dirname).getDictMap().get(dictType);
            const res: any = []
            if (data) {
              data.items.forEach((item: any) => {
                res.push({
                  value: item.dictItemValue,
                  label: item.name
                })
              })
            }
            return Promise.resolve(res);
        }
    
}
export default  new DictService();