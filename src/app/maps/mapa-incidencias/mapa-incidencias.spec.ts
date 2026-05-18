import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaIncidencias } from './mapa-incidencias';

describe('MapaIncidencias', () => {
  let component: MapaIncidencias;
  let fixture: ComponentFixture<MapaIncidencias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaIncidencias],
    }).compileComponents();

    fixture = TestBed.createComponent(MapaIncidencias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
