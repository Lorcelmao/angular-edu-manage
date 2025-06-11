import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() isVisible: boolean = true;
  
  menuItems: any[] = [];

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Quản lý dịch vụ',
        icon: 'pi pi-cog',
        routerLink: '/services'
      },
      {
        label: 'Quản lý gói dịch vụ',
        icon: 'pi pi-briefcase',
        routerLink: '/goi-dich-vu'
      }
    ];
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }
}