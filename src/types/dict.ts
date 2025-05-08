export interface DictItemModel {
  name: string;
  dictItemKey: string;
  dictItemValue: any;
}

export interface DictModel {
  name: string;
  dictKey: string;
  items: DictItemModel[];
}