import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber'; 
import { InputSwitchModule } from 'primeng/inputswitch'; 
import { TagModule } from 'primeng/tag'; 
import { MenubarModule } from 'primeng/menubar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { AvatarModule } from 'primeng/avatar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';

import { PaginatorModule } from 'primeng/paginator';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ChipModule } from 'primeng/chip';
import { TabViewModule } from 'primeng/tabview';

import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

import { SchoolListComponent } from './pages/schools/school-list/school-list.component';
import { SchoolFormComponent } from './pages/schools/school-form/school-form.component';

import { ClassListComponent } from './pages/classes/class-list/class-list.component';
import { ClassFormComponent } from './pages/classes/class-form/class-form.component';

import { StudentListComponent } from './pages/students/student-list/student-list.component';
import { StudentFormComponent } from './pages/students/student-form/student-form.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ServiceListComponent } from './pages/services/service-list/service-list.component';
import { ServiceFormComponent } from './pages/services/service-form/service-form.component';
import { GoiDichVuListComponent } from './pages/goi-dich-vu/goi-dich-vu-list/goi-dich-vu-list.component';
import { GoiDichVuFormComponent } from './pages/goi-dich-vu/goi-dich-vu-form/goi-dich-vu-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    MainLayoutComponent,
    SchoolListComponent,
    SchoolFormComponent,
    ClassListComponent,
    ClassFormComponent,
    StudentListComponent,
    StudentFormComponent,
    DashboardComponent,
    ServiceListComponent,
    ServiceFormComponent,
    GoiDichVuListComponent,
    GoiDichVuFormComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ButtonModule,
    CardModule,
    TableModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule, 
    InputSwitchModule, 
    TagModule, 
    MenubarModule,
    PanelMenuModule,
    AvatarModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
    DropdownModule,
    CalendarModule,
    PaginatorModule,
    ChartModule,
    ProgressSpinnerModule,
    ChipModule,
    TabViewModule
  ],
  providers: [MessageService,ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
