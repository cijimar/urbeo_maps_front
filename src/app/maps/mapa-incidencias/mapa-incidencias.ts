import { Component, AfterViewInit, PLATFORM_ID, inject, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ModalCrearIncidenciaComponent } from '../../components/modal-crear-incidencia/modal-crear-incidencia';
import { IncidenciasService } from '../../services/incidencias/incidencias';
import { Incidencia } from '../../model/Incidencia';

let L: any;

@Component({
  selector: 'app-mapa-incidencias',
  standalone: true,
  templateUrl: './mapa-incidencias.html',
  styleUrl: './mapa-incidencias.css',
  imports: [ModalCrearIncidenciaComponent]
})
export class MapaIncidenciasComponent implements AfterViewInit {

  private platformId = inject(PLATFORM_ID);
  private cdr = inject(ChangeDetectorRef);   
  private map: any;
  private markersLayer: any;

  modalVisible = false;
  nuevaLat = 0;
  nuevaLng = 0;

  constructor(private incidenciasService: IncidenciasService) {}

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;
    const leaflet = await import('leaflet');
    L = (leaflet as any).default || leaflet;
    this.initMap();
    this.cargarIncidencias();
  }

  initMap() {
    this.map = L.map('map').setView([37.1773, -3.5986], 13);

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

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.map);

    this.markersLayer = L.layerGroup().addTo(this.map);

    this.map.on('click', (e: any) => {
      this.nuevaLat = e.latlng.lat;
      this.nuevaLng = e.latlng.lng;
      this.modalVisible = true;
      this.cdr.detectChanges();   
    });
  }

  cargarIncidencias() {
    this.markersLayer.clearLayers();
    this.incidenciasService.cargarIncidencias().subscribe({
      next: (incidencias: Incidencia[]) => {
        incidencias.forEach((incidencia) => {
          L.marker([incidencia.latitud, incidencia.longitud])
            .addTo(this.markersLayer)
            .bindPopup(`<b>${incidencia.titulo}</b><br>${incidencia.descripcion}`);
        });
        this.cdr.detectChanges();   
      },
      error: (error) => console.error('Error cargando incidencias', error)
    });
  }

  onGuardarIncidencia(incidencia: Incidencia) {
    this.incidenciasService.crearIncidencia(incidencia).subscribe({
      next: () => {
        this.modalVisible = false;
        this.cargarIncidencias();
        this.cdr.detectChanges();   
      },
      error: (error) => console.error('Error creando incidencia', error)
    });
  }

  onCancelarModal() {
    this.modalVisible = false;
    this.cdr.detectChanges();   
  }
}