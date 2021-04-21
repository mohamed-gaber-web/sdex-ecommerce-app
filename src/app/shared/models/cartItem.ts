import { Product } from "./product";

export class CartItem{
    id:number;
    title: string;
    imagePath: string;
    discountPerItem:number;
    pricePerItem:number;
    amount:number;
    stock:number;
}