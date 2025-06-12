import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DichVuFormComponent } from './dich-vu-form.component';

describe('DichVuFormComponent', () => {
  let component: DichVuFormComponent;
  let fixture: ComponentFixture<DichVuFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DichVuFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DichVuFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
