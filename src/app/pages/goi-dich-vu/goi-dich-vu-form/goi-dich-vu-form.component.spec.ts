import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoiDichVuFormComponent } from './goi-dich-vu-form.component';

describe('GoiDichVuFormComponent', () => {
  let component: GoiDichVuFormComponent;
  let fixture: ComponentFixture<GoiDichVuFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoiDichVuFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoiDichVuFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
