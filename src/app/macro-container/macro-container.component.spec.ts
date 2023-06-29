import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MacroContainerComponent } from './macro-container.component';

describe('MacroContainerComponent', () => {
  let component: MacroContainerComponent;
  let fixture: ComponentFixture<MacroContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MacroContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MacroContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
