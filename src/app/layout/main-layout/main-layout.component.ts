import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  sidebarVisible: boolean = false; // Mặc định đóng cho tất cả màn hình

  constructor() {
    // Không auto show sidebar nữa, để mặc định đóng
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Chỉ auto-close sidebar trên mobile khi resize
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