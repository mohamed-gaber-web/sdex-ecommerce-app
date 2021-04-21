export class Product {
    id: number;
    order: number;
    price: number;
    priceAfterDiscount:number;
    discount: number;
    quantity: number;
    imagePath: string;
    imagePaths: [];
    productTranslations: [{
        id?: number,
        title: string,
        description: string
    }]
}