import {
  Component,
  AfterViewInit,
  PLATFORM_ID,
  inject
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import { IncidenciasService } from '../../services/incidencias/incidencias';
import { Incidencia } from '../../model/Incidencia';

let L: any;

@Component({
  selector: 'app-mapa-incidencias',
  standalone: true,
  templateUrl: './mapa-incidencias.html',
  styleUrl: './mapa-incidencias.css'
})
export class MapaIncidenciasComponent implements AfterViewInit {

  private platformId = inject(PLATFORM_ID);

  private map: any;

  constructor(private incidenciasService: IncidenciasService) {}

  async ngAfterViewInit() {

    if (!isPlatformBrowser(this.platformId)) return;

    const leaflet = await import('leaflet');
    L = leaflet.default;

    this.initMap();

    this.cargarIncidencias();
  }

  initMap() {

    this.map = L.map('map').setView([37.1773, -3.5986], 13);

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap'
      }
    ).addTo(this.map);
  }

  cargarIncidencias() {

    this.incidenciasService.obtenerIncidencias().subscribe({

      next: (incidencias) => {

        incidencias.forEach((incidencia: Incidencia) => {

          L.marker([
            incidencia.latitud,
            incidencia.longitud
          ])
          .addTo(this.map)
          .bindPopup(`
            <b>${incidencia.titulo}</b>
            <br>
            ${incidencia.descripcion}
          `);

        });

      },

      error: (error) => {
        console.error('Error cargando incidencias', error);
      }

    });

  }

}