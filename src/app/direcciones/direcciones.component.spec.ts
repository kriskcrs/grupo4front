import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DireccionesComponent } from './direcciones.component';

describe('DireccionesComponent', () => {
  let component: DireccionesComponent;
  let fixture: ComponentFixture<DireccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DireccionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DireccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
