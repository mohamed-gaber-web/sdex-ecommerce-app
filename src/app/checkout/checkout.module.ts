import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CheckoutPageRoutingModule } from './checkout-routing.module';

import { CheckoutPage } from './checkout.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    IonicModule,
    CheckoutPageRoutingModule,
    TranslateModule
  ],
  declarations: [CheckoutPage]
})
export class CheckoutPageModule {}
