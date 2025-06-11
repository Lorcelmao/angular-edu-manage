import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoiDichVuListComponent } from './goi-dich-vu-list.component';

describe('GoiDichVuListComponent', () => {
  let component: GoiDichVuListComponent;
  let fixture: ComponentFixture<GoiDichVuListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoiDichVuListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoiDichVuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
