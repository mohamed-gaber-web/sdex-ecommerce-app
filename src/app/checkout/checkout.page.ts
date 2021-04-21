import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AlertController, ToastController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import { CartItem } from "../shared/models/cartItem";
import { StorageService } from "../shared/services/storage.service";
import { CheckoutService } from "./checkout.service";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.page.html",
  styleUrls: ["./checkout.page.scss"],
})
export class CheckoutPage implements OnInit {
  public cart: CartItem[] = [];
  addressForm: FormGroup;
  deliveryForm: FormGroup;
  paymentForm: FormGroup;
  subs: Subscription[] = [];

  deliveryMethods = [];
  grandTotal = 0;
  addressList = [];
  addressFilInput;
  source;
  isValidSubmit = true;
  isLoading = false;
  constructor(
    public toastController: ToastController,
    public alertController: AlertController,
    public formBuilder: FormBuilder,
    public checkoutService: CheckoutService,
    public storageService: StorageService,
    public router:Router,
  ) {
    this.storageService.cartItemsChange.subscribe((value) => {
      this.cart = value;
    });
  }

  ngOnInit() {    
    this.cart = this.storageService.getCartItems();

    this.getShippingAddress();
    this.addressList;
    // address shipping form 
    this.addressForm = this.formBuilder.group({
      address: [, Validators.required],
    });
    this.deliveryForm = this.formBuilder.group({
      deliveryMethod: [, Validators.required]
    });
  }


  shippingCost = 45;
  discount = 0;
  couponCode = "";
  couponApplied = false;


  applyCoupon() {
    if (this.couponCode == "SALE100") {
      this.discount = 100;
      this.doTotalCalculation();
      this.simpleAlert("Hurray! Coupon Applied.");
      this.couponApplied = true;
    } else {
      this.simpleAlert("Invalid Coupon Code!");
    }
  }

  removeCoupon() {
    this.couponCode = "";
    this.discount = 0;
    this.couponApplied = false;
    this.doTotalCalculation();
    this.simpleAlert("Coupon Removed!");
  }

  doTotalCalculation() {
    this.storageService.setCartItems(this.cart);

  }

  async removeFromCart(i) {
    const alert = await this.alertController.create({
      header: "Do you want to remove this item?",
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

  async simpleAlert(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
    });
    toast.present();
  }
  async simpleAlertError(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1000,
      color:'danger'
    });
    toast.present();
  }
  public async placeOrder(){
    var x = this.addressForm.get("address").value;
    var address = this.addressList.filter(item=> item.id == x)[0];
    this.isValidSubmit = false;
    if(!this.addressForm.valid){
      await this.simpleAlertError("Please select delviery address");
      this.isValidSubmit = true;
      return;
    }
    if(!this.deliveryForm.valid){
      await this.simpleAlertError("Please select payment method");
      this.isValidSubmit = true;
      return;
    }
    const infoUser = {
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      landline: address.landline,
      area: address.area,
      streetName: address.streetName,
      buildingName: address.buildingName,
      floorNumber: address.floorNumber,
      apartmentNumber: address.apartmentNumber,
      nearestLandmark: address.nearestLandmark,
      cationType: address.cationType,
      cityName: address.cityName,
      note: address.note,
      paymentMethodId: +this.deliveryForm.get("deliveryMethod").value,
      cartItems: this.cart.map(product => {
        return {
          productId: product.id,
          quantity: product.amount 
        }
      })
    }
    
    if(this.addressForm.valid && this.deliveryForm.valid) {
      this.checkoutService.createOrder(infoUser).pipe(
        tap(res => {
          if(this.deliveryForm.get("deliveryMethod").value == 1){
            const token = res['result'].result.paymentKey;
            this.source = `https://accept.paymobsolutions.com/api/acceptance/iframes/152312?payment_token=${token}`
          }else{
            if(res['success'] == true){
              this.router.navigate(['/order-success'])
            }else{
              this.router.navigate(['/order-failed'])
            }
          }
         
        })
        )
      .subscribe(() => {
        // this.horizontalStepper._steps.forEach(step => step.editable = false);
        // this.verticalStepper._steps.forEach(step => step.editable = false);
        this.cart.length = 0;    
        this.cart = [];
        localStorage.setItem('cartList', JSON.stringify(this.cart))
      })
    } else {
      return;
    }
    
  }


  getShippingAddress() {
    this.isLoading = true;
    this.checkoutService.getShippingAddressByUserId()
    .subscribe(response => {
      this.isLoading = false;
      this.addressList = response['result'];   
    });
  }

  removeAddress(id) {
    this.checkoutService.removeShippingAddressByUserId(id).subscribe(response => {

      if(response) {
        this.addressList = this.addressList.filter(item => item.id !== id);      
      }
      return;
      
    })
  }

  fillAddress(address) {
    this.addressFilInput = address;
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
