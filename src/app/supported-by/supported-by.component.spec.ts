import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportedByComponent } from './supported-by.component';

describe('SupportedByComponent', () => {
  let component: SupportedByComponent;
  let fixture: ComponentFixture<SupportedByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupportedByComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportedByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
