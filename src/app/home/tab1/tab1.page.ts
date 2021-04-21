import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { MenuController } from "@ionic/angular";
import { Product } from "src/app/shared/models/product";
import { Subscription } from "rxjs";
import { ProductsService } from "src/app/shared/services/products.service";
import { map, tap } from "rxjs/operators";

@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page {
  public onSaleProducts: Array<Product>;
  public newArrivalsProducts: Array<Product>;
  public featuredProducts: Array<Product>;
  public brands = [];


  sub: Subscription[] = [];
  isLoading = true;

  constructor(
    private router: Router,
    private menu: MenuController,
    public ps: ProductsService
  ) {}

  categories = {
    categories: [
      "Womens",
      "Mobiles",
      "Beauty",
      "Kids",
      "Skin care",
      "Home",
      "Fashion",
    ],
  };

  ngOnInit() {
    this.getProducts("featured");
    this.getProducts("on sale");
    this.getProducts("LatestProduct");
    this.getBrands();
  }

  doSearch() {
    this.router.navigateByUrl("/search");
  }

  openMenu() {
    this.menu.enable(true, "first");
    this.menu.open("first");
  }

  public getProducts(type?) {
    // Featured Products
    if (type == "featured" && !this.featuredProducts) {
      this.isLoading = true;
      this.sub.push(
        this.ps
          .getProducts("FeaturedProduct")
          .pipe(
            map((response) => {
              Object.entries(response);
              return response["result"];
            })
          )
          .subscribe((res) => {
            this.isLoading = false;
            this.featuredProducts = res;
          })
      );
    }

    // On sale Products
    if (type == "on sale" && !this.onSaleProducts) {
      this.sub.push(
        this.ps
          .getProducts("OnSaleProduct")
          .pipe(
            map((response) => {
              Object.entries(response);
              this.isLoading = false;
              //   this.uiService.hideLoadingBar();
              return response["result"];
            })
          )
          .subscribe((res) => {
            this.onSaleProducts = res;
          })
      );
    }

    // if(type == "top rated" && !this.topRatedProducts){
    //   this.appService.getProducts("top-rated").subscribe(data=>{
    //     this.topRatedProducts = data;
    //   })
    // }

    // Latest Products
    if (type == "LatestProduct" && !this.newArrivalsProducts) {
      //   this.uiService.showLoadingBar();
      this.isLoading = true;
      this.sub.push(
        this.ps
          .getProducts("LatestProduct")
          .pipe(
            map((response) => {
              Object.entries(response);
              this.isLoading = false;
              // this.uiService.hideLoadingBar();
              return response["result"];
            })
          )
          .subscribe((res) => {
            this.newArrivalsProducts = res;
          })
      );
    }
  }

  
  public getBrands(){
    this.isLoading = true;
    this.sub.push(
      this.ps.getBrands()
      .subscribe(response => {
        this.isLoading = false;
        this.brands = response['result'];      
      })
    )
  }

  // onLoad() {
  //   this.loading = false;
  // }


  ngOnDestroy() {
    this.sub.forEach((sub) => sub.unsubscribe());
  }
}
