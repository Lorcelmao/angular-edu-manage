import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { ServiceListComponent } from './pages/services/service-list/service-list.component';
import { ServiceFormComponent } from './pages/services/service-form/service-form.component';
import { GoiDichVuListComponent } from './pages/goi-dich-vu/goi-dich-vu-list/goi-dich-vu-list.component';
import { GoiDichVuFormComponent } from './pages/goi-dich-vu/goi-dich-vu-form/goi-dich-vu-form.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'services',
        pathMatch: 'full'
      },
      // Service routes
      {
        path: 'services',
        component: ServiceListComponent
      },
      {
        path: 'services/create',
        component: ServiceFormComponent
      },
      {
        path: 'services/edit/:id',
        component: ServiceFormComponent
      },
      {
        path: 'services/view/:id',
        component: ServiceFormComponent
      },
      // Gói dịch vụ routes
      {
        path: 'goi-dich-vu',
        component: GoiDichVuListComponent
      },
      {
        path: 'goi-dich-vu/create',
        component: GoiDichVuFormComponent
      },
      {
        path: 'goi-dich-vu/edit/:id',
        component: GoiDichVuFormComponent
      },
      {
        path: 'goi-dich-vu/view/:id',
        component: GoiDichVuFormComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }