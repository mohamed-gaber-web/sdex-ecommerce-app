import { Component, OnInit } from "@angular/core";
import { ToastController, AlertController } from "@ionic/angular";
import { CartItem } from "src/app/shared/models/cartItem";
import { Product } from "src/app/shared/models/product";
import { StorageService } from "src/app/shared/services/storage.service";

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"],
})
export class Tab3Page implements OnInit {
  public cart: CartItem[] = [];
  constructor(
    public toastController: ToastController,
    public alertController: AlertController,
    public storageService: StorageService
  ) {
    this.storageService.cartItemsChange.subscribe((value) => {
      this.cart = value;
    });
  }

  ngOnInit() {
    this.cart = this.storageService.getCartItems();
    this.doTotalCalculation();
  }

  totalCost = 0;

  lessQty(cartItem: CartItem) {
    if (this.cart.filter((item) => item.id == cartItem.id)[0].amount > 0) {
      this.cart.filter((item) => item.id == cartItem.id)[0].amount =
        this.cart.filter((item) => item.id == cartItem.id)[0].amount - 1;
      this.doTotalCalculation();
    }
    if (this.cart.filter((item) => item.id == cartItem.id)[0].amount == 0) {
      this.removeFromCart(cartItem);
    }
  }

  addQty(cartItem: CartItem) {
    if (
      this.cart.filter((item) => item.id == cartItem.id)[0].amount >= 0 &&
      this.cart.filter((item) => item.id == cartItem.id)[0].amount <=
        this.cart.filter((item) => item.id == cartItem.id)[0].stock
    ) {
      this.cart.filter((item) => item.id == cartItem.id)[0].amount =
        this.cart.filter((item) => item.id == cartItem.id)[0].amount + 1;
    } else {
      this.toastAlertDanger(
        "You can not add more items than available. In stock !"
      );
    }
    this.doTotalCalculation();
  }

  doTotalCalculation() {
    

    this.storageService.setCartItems(this.cart);
  }

  async removeFromCart(i) {
    console.log(i);
    const alert = await this.alertController.create({
      header: "Do you want to remove this item from your cart?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Action cancelled");
          },
        },
        {
          text: "Yes!",
          handler: () => {
            this.toastAlert("Item removed from cart.", i);
          },
        },
      ],
    });

    await alert.present();
  }

  async toastAlert(msg, index) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
    });
    toast.present();
    console.log(index);
    var item = this.cart.filter((item) => item.id == index.id)[0];
    console.log(item);
    this.cart.forEach((value, index) => {
      if (value == item) this.cart.splice(index, 1);
    });
    this.doTotalCalculation();
  }

  async toastAlertDanger(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: "danger",
    });
    toast.present();
  }
}
