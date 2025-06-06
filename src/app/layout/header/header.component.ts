import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() sidebarToggled = new EventEmitter<boolean>();
  
  items: MenuItem[] = [];
  sidebarVisible: boolean = false; // Mặc định đóng

  ngOnInit() {
    // Không auto show sidebar nữa
    
    this.items = [
      {
        label: 'Trang chủ',
        icon: 'pi pi-home',
        routerLink: '/dashboard'
      },
      {
        label: 'Quản lý',
        icon: 'pi pi-cog',
        items: [
          {
            label: 'Trường học',
            icon: 'pi pi-building',
            routerLink: '/schools'
          },
          {
            label: 'Lớp học',
            icon: 'pi pi-users',
            routerLink: '/classes'
          },
          {
            label: 'Học sinh',
            icon: 'pi pi-user',
            routerLink: '/students'
          }
        ]
      }
    ];
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
    this.sidebarToggled.emit(this.sidebarVisible);
  }
}