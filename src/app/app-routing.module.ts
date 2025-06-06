import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { SchoolListComponent } from './pages/schools/school-list/school-list.component';
import { SchoolFormComponent } from './pages/schools/school-form/school-form.component';
import { ClassListComponent } from './pages/classes/class-list/class-list.component';
import { ClassFormComponent } from './pages/classes/class-form/class-form.component';
import { StudentListComponent } from './pages/students/student-list/student-list.component';
import { StudentFormComponent } from './pages/students/student-form/student-form.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      // School routes
      {
        path: 'schools',
        component: SchoolListComponent
      },
      {
        path: 'schools/create',
        component: SchoolFormComponent
      },
      {
        path: 'schools/edit/:id',
        component: SchoolFormComponent
      },
      {
        path: 'schools/view/:id',
        component: SchoolFormComponent
      },
      // Class routes
      {
        path: 'classes',
        component: ClassListComponent
      },
      {
        path: 'classes/create',
        component: ClassFormComponent
      },
      {
        path: 'classes/edit/:id',
        component: ClassFormComponent
      },
      {
        path: 'classes/view/:id',
        component: ClassFormComponent
      },
      // Student routes
      {
        path: 'students',
        component: StudentListComponent
      },
      {
        path: 'students/create',
        component: StudentFormComponent
      },
      {
        path: 'students/edit/:id',
        component: StudentFormComponent
      },
      {
        path: 'students/view/:id',
        component: StudentFormComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }