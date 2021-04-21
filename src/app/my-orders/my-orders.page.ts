import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { OrdersService } from "./orders.service";

@Component({
  selector: "app-my-orders",
  templateUrl: "./my-orders.page.html",
  styleUrls: ["./my-orders.page.scss"],
})
export class MyOrdersPage implements OnInit {
  sub: Subscription;
  isLoading: boolean = false;
  orderPerPage: number = 6;
  currentPage = 0;
  totalOrders: number = 0;
  orders: Array<any> = [];
  constructor(private ordersService: OrdersService) {}

  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    this.isLoading = true;
    this.sub = this.ordersService
      .getListOfOrders(this.currentPage, this.orderPerPage)
      .pipe(
        map((response) => {
          Object.entries(response);
          this.isLoading = false;
          this.totalOrders = response["length"];
          return response["result"];
        })
      )
      .subscribe((response) => {
        if (this.orders.length == 0) {
          this.orders = response;
        } else {
          response.forEach((element) => {
            this.orders.push(element);
          });
        }
        this.isLoading = false;
        this.currentPage++;
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loadData(event) {
    if (this.orders.length < this.totalOrders) {
      setTimeout(() => {
        this.getOrders();
        console.log("Done");
        event.target.complete();

        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (this.orders.length == 1000) {
          event.target.disabled = true;
        }
      }, 500);
    } else {
      event.target.disabled = true;
    }
  }
}
