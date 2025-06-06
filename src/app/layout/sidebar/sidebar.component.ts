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
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/dashboard'
      },
      {
        label: 'Quản lý trường học',
        icon: 'pi pi-building',
        routerLink: '/schools'
      },
      {
        label: 'Quản lý lớp học',
        icon: 'pi pi-users',
        routerLink: '/classes'
      },
      {
        label: 'Quản lý học sinh',
        icon: 'pi pi-user',
        routerLink: '/students'
      }
    ];
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }
}