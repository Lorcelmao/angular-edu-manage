import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// PrimeNG Imports
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

// Layout Components
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

// Service Components
// import { ServiceListComponent } from './pages/services/service-list/service-list.component';
// import { ServiceFormComponent } from './pages/services/service-form/service-form.component';
import { DichVuListComponent } from './pages/dich-vu/dich-vu-list/dich-vu-list.component';
import { DichVuFormComponent } from './pages/dich-vu/dich-vu-form/dich-vu-form.component';
import { GoiDichVuListComponent } from './pages/goi-dich-vu/goi-dich-vu-list/goi-dich-vu-list.component';
import { GoiDichVuFormComponent } from './pages/goi-dich-vu/goi-dich-vu-form/goi-dich-vu-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    MainLayoutComponent,
    // Thay thế các component cũ
    DichVuListComponent,
    DichVuFormComponent,
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
    // PrimeNG Modules
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
  providers: [
    MessageService, 
    ConfirmationService,
    // Nếu có ServiceService ở đây, thay đổi thành DichVuService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
