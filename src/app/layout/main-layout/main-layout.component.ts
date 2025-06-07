import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  sidebarVisible: boolean = false; 

  constructor() {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    
    if (typeof window !== 'undefined' && window.innerWidth <= 1200) {
      this.sidebarVisible = false;
    }
  }

  onSidebarToggle(isVisible: boolean) {
    this.sidebarVisible = isVisible;
  }

  closeSidebar() {
    this.sidebarVisible = false;
  }
}