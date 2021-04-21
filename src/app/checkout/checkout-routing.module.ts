import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/guard/auth.guard';

import { CheckoutPage } from './checkout.page';

const routes: Routes = [
  {
    path: '',
    component: CheckoutPage,canActivate:[AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CheckoutPageRoutingModule {}
