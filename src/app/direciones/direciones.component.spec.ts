import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirecionesComponent } from './direciones.component';

describe('DirecionesComponent', () => {
  let component: DirecionesComponent;
  let fixture: ComponentFixture<DirecionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirecionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirecionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
