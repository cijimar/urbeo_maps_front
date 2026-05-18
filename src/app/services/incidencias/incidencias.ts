import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';  

@Injectable({
  providedIn: 'root'
})

export class IncidenciasService {

  private apiUrl = 'http://localhost:8080/incidencias';

  constructor(private http: HttpClient) {}

  obtenerIncidencias(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  crearIncidencia(incidencia: any): Observable<any> {
    return this.http.post(this.apiUrl, incidencia);
  }
