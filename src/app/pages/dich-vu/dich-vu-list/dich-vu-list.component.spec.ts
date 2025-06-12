import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DichVuListComponent } from './dich-vu-list.component';

describe('DichVuListComponent', () => {
  let component: DichVuListComponent;
  let fixture: ComponentFixture<DichVuListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DichVuListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DichVuListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
