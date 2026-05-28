import {  Component,  AfterViewInit,  PLATFORM_ID,  inject} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import { IncidenciasService } from '../../services/incidencias/incidencias';
import { Incidencia } from '../../model/Incidencia';

//import { ModalCrearIncidenciaComponent } from '../../components/modal-crear-incidencia/modal-crear-incidencia';

let L: any;

@Component({
  selector: 'app-mapa-incidencias',
  standalone: true,
  templateUrl: './mapa-incidencias.html',
  styleUrl: './mapa-incidencias.css',
  imports: []
})

export class MapaIncidenciasComponent implements AfterViewInit {

  private platformId = inject(PLATFORM_ID);
  private map: any;
  private markersLayer: any;

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

    // 2. Configurar iconos (opcional, para evitar problemas con rutas)
    const iconDefault = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;

    // 3. Capa base
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.map);

    // 4. Capa de marcadores
    this.markersLayer = L.layerGroup().addTo(this.map);

    // 5. Click en mapa
    this.map.on('click', (e: any) => {
      console.log('CLICK DETECTADO');
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      console.log('Click en mapa:', lat, lng);
      this.abrirPopupCrearIncidencia(lat, lng);
    });
  }

  cargarIncidencias() {
    this.markersLayer.clearLayers(); // Limpiar marcadores existentes
    this.incidenciasService.cargarIncidencias().subscribe({
      next: (incidencias: Incidencia[]) => {
        incidencias.forEach((incidencia) => {
          L.marker([
            incidencia.latitud,
            incidencia.longitud
          ])
            .addTo(this.markersLayer)
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
            descripcion: 'Creada desde el mapa',
            categoria: 'General',
            estado: 'Pendiente'
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

  
  //No borro esta funcion porque ya se hace en el popup, la dejo por si las moscas
  /*guardarIncidencia(incidencia: Incidencia) {
    this.incidenciasService.crearIncidencia(incidencia)
      .subscribe({
        next: (res) => {
          console.log('Incidencia creada', res);
          L.marker([
            res.latitud,
            res.longitud
          ])
          .addTo(this.markersLayer)
          .bindPopup(`
            <b>${res.titulo}</b>
            <br>
            ${res.descripcion}
          `);
        },
        error: (error) => {
          console.error(error);
        }
      });
  }*/


}