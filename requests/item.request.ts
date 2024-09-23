export interface itemRequest {
  name: string;
  price: number;
  description: string;
  category: string;
  seller_id: any;
  quantity: number;
}
export interface itemSearch {
  cateogry: string;
  name: string;
  min: number;
  max: number;
}

export interface updateItem {
    seller_id:any,
    _id:string,
    name?:string,
    quantity?:number,
    price?:number,
    description?:string
}
