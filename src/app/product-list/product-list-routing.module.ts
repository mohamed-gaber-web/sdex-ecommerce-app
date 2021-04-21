import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductListPage } from './product-list.page';

const routes: Routes = [
  {
    path: ':type/:id',
    component: ProductListPage
  },
  {
    path: ':type',
    component: ProductListPage
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductListPageRoutingModule {}
