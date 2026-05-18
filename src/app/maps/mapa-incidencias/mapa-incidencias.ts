import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa-incidencias',
  imports: [],
  templateUrl: './mapa-incidencias.html',
  styleUrl: './mapa-incidencias.css',
})

export class MapaIncidenciasComponent implements OnInit {

  private map: any;

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {

    this.map = L.map('map').setView([37.1882, -3.6067], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'OpenStreetMap'
    }).addTo(this.map);

    this.map.on('click', (e: any) => {

      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      console.log('Latitud:', lat);
      console.log('Longitud:', lng);

      L.marker([lat, lng])
        .addTo(this.map)
        .bindPopup('Nueva incidencia')
        .openPopup();
    });
  }

}
