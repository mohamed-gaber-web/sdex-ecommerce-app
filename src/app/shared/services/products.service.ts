import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiProducts, productDetails,getAllBrands } from "../api/api";
import { Product } from "../models/product";



@Injectable({
    providedIn: 'root'
})
export class ProductsService {

    limit: number = 6;
    offset: number = 0;

    queryParams = `?Offset=${this.offset}&Limit=${this.limit}`

    constructor(private http: HttpClient) {}

    getProducts(productQuery: string,offset?:number) {
        if(offset != null){
            this.queryParams = `?Offset=${offset}&Limit=${this.limit}`

        }
        return this.http.get(`${ApiProducts}/${productQuery}` + this.queryParams);
    }

    getProductById(id: number) {
        const params = `?id=${id}`;
        return this.http.get<Product>(`${productDetails}` + params);
    }

    public getBrands(){
        
        const params = `?Offset=0&Limit=10`
        return this.http.get(`${getAllBrands}` + params);
    }
}