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

    // 1. Crear mapa PRIMERO
    this.map = L.map('map').setView([37.1773, -3.5986], 13);

    // 2. Capa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.map);

    // 3. Click en mapa
    this.map.on('click', (e: any) => {

      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      console.log('Click en mapa:', lat, lng);

      this.abrirPopupCrearIncidencia(lat, lng);
    });
  }

  cargarIncidencias() {

    this.incidenciasService.obtenerIncidencias().subscribe({

      next: (incidencias: Incidencia[]) => {

        incidencias.forEach((incidencia) => {

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

  abrirPopupCrearIncidencia(lat: number, lng: number) {

    const popupContent = `
      <div>
        <h3>Nueva incidencia</h3>
        <p>Lat: ${lat}</p>
        <p>Lng: ${lng}</p>
        <button id="btnCrear">Crear aquí</button>
      </div>
    `;

    const popup = L.popup()
      .setLatLng([lat, lng])
      .setContent(popupContent)
      .openOn(this.map);

    setTimeout(() => {

      const btn = document.getElementById('btnCrear');

      if (btn) {

        btn.addEventListener('click', () => {

          // IMPORTANTE: coincide con la interfaz
          const incidencia: Incidencia = {
            latitud: lat,
            longitud: lng,
            titulo: 'Nueva incidencia',
            descripcion: 'Creada desde el mapa'
          };

          this.incidenciasService.crearIncidencia(incidencia)
            .subscribe({
              next: (res) => {
                console.log('Incidencia creada', res);

                this.map.closePopup(popup);

                // recargar markers
                this.cargarIncidencias();
              },

              error: (error) => {
                console.error('Error creando incidencia', error);
              }
            });
        });
      }

    }, 100);
  }
}