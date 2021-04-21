import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProductResolver } from "./single-product-resolver";

import { SingleProductViewPage } from "./single-product-view.page";

const routes: Routes = [
  {
    path: ":id",
    component: SingleProductViewPage,
    resolve: {
      productResolve: ProductResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SingleProductViewPageRoutingModule {}
