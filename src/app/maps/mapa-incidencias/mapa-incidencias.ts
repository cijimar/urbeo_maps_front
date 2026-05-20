import { Component, AfterViewInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

let L: any;

@Component({
  selector: 'app-mapa-incidencias',
  standalone: true,
  templateUrl: './mapa-incidencias.html',
  styleUrl: './mapa-incidencias.css'
})
export class MapaIncidenciasComponent implements AfterViewInit {

  private platformId = inject(PLATFORM_ID);

  async ngAfterViewInit() {

    if (!isPlatformBrowser(this.platformId)) return;

    // IMPORT DINÁMICO (IMPORTANTE)
    const leaflet = await import('leaflet');
    L = leaflet.default;

    this.initMap();
  }

  initMap() {
    const map = L.map('map').setView([37.1773, -3.5986], 13); // Granada

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);
  }
}