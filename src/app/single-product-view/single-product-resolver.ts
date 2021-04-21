import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { ProductsService } from '../shared/services/products.service';

@Injectable({
    providedIn: 'root'
})

export class ProductResolver implements Resolve<any> {

    constructor(private productService: ProductsService, public route: Router) {}

    resolve(next: ActivatedRouteSnapshot): Observable<any>  {
        const productId = +next.paramMap.get('id');
        return this.productService.getProductById(productId);
    }
}