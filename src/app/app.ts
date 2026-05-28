import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MapaIncidenciasComponent } from './maps/mapa-incidencias/mapa-incidencias';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MapaIncidenciasComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('urbeo-frontend');
}