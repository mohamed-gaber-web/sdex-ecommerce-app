import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ActionSheetController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { Product } from "../shared/models/product";
import { ProductsService } from "../shared/services/products.service";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.page.html",
  styleUrls: ["./product-list.page.scss"],
})
export class ProductListPage implements OnInit {
  public type: string;
  public title: string;
  public categoryId: any;
  private offset:number;
  private totalLength:number;
  sub: Subscription[] = [];
  public products: Array<Product> = [];

  isLoading = false;
  constructor(
    public actionSheetController: ActionSheetController,
    public ps: ProductsService,
    private _Activatedroute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.offset = 0;
    this.type = this._Activatedroute.snapshot.paramMap.get("type");
    this.categoryId = this._Activatedroute.snapshot.paramMap.get("id");
    if (this.type == "FeaturedProduct") {
      this.title = "Featured Products"; //TO DO replace with translated
    }
    if (this.type == "OnSaleProduct") {
      this.title = "On Sale"; //TO DO replace with translated
    }
    if (this.type == "LatestProduct") {
      this.title = "New Arrival"; //TO DO replace with translated
    }
    if (!this.categoryId) {
      this.getProducts(this.type);
    } else {
      this.getProductsOfCategory(this.type, this.categoryId);
    }
  }
  getProductsOfCategory(type: string, categoryId: any) {
    throw new Error("Method not implemented.");
  }

  async doFilter() {
    const actionSheet = await this.actionSheetController.create({
      header: "Sort by",
      buttons: [
        {
          text: "Featured Products",
          icon: "funnel-outline",
          handler: () => {
            console.log("Sort by: Featured");
          },
        },
        {
          text: "Price High to Low",
          icon: "trending-down-outline",
          handler: () => {
            console.log("Sort by: Price High to Low");
          },
        },
        {
          text: "Price Low to High",
          icon: "trending-up-outline",
          handler: () => {
            console.log("Sort by: Price Low to High");
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {
            console.log("Cancelled");
          },
        },
      ],
    });
    await actionSheet.present();
  }

  public getProducts(type) {
    this.isLoading = true;

    this.sub.push(
      this.ps
        .getProducts(type,this.offset)
        .pipe(
          map((response) => {
            Object.entries(response);
            this.isLoading = false;
            this.totalLength = response["length"];
            return response["result"];
          })
        )
        .subscribe((res) => {
          if(this.products.length==0){
            this.products=res;
          }else{
            res.forEach(element => {
              this.products.push(element);
            });
          }
          this.offset++;

        })
    );
  }
  loadData(event) {
    if(this.products.length < this.totalLength){
      setTimeout(() => {
        this.getProducts(this.type);
        console.log('Done');
        event.target.complete();
  
        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (this.products.length == 1000) {
          event.target.disabled = true;
        }
      }, 500);
    }else{
      event.target.disabled = true;

    }
   
  }
  
}
