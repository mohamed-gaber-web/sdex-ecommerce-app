import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guard/auth.guard';
import { Tab4Page } from './tab4.page';

const routes: Routes = [
  {
    path: '',
    component: Tab4Page,canActivate:[AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab4PageRoutingModule {}
