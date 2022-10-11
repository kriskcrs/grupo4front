import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoIdentidadComponent } from './tipo-identidad.component';

describe('TipoIdentidadComponent', () => {
  let component: TipoIdentidadComponent;
  let fixture: ComponentFixture<TipoIdentidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoIdentidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoIdentidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
