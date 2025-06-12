import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DichVuListComponent } from './pages/dich-vu/dich-vu-list/dich-vu-list.component';
import { DichVuFormComponent } from './pages/dich-vu/dich-vu-form/dich-vu-form.component';
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
      // Dịch vụ routes (giữ nguyên path 'services')
      {
        path: 'services',
        component: DichVuListComponent
      },
      {
        path: 'services/create',
        component: DichVuFormComponent
      },
      {
        path: 'services/edit/:id',
        component: DichVuFormComponent
      },
      {
        path: 'services/view/:id',
        component: DichVuFormComponent
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