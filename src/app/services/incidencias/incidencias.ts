import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';  
import { Incidencia } from '../../model/Incidencia';

@Injectable({
  providedIn: 'root'
})

export class IncidenciasService {

  private apiUrl = 'http://localhost:8081/api/incidencias';
  
  constructor(private http: HttpClient) {}

  cargarIncidencias(): Observable<Incidencia[]> {
    return this.http.get<Incidencia[]>(this.apiUrl);
  }

  crearIncidencia(incidencia: Incidencia): Observable<Incidencia> {
    return this.http.post<Incidencia>(this.apiUrl, incidencia);
  }

  guardarIncidencia(incidencia: Incidencia): Observable<Incidencia> {
    if (incidencia.id) {
      return this.http.put<Incidencia>(`${this.apiUrl}/${incidencia.id}`, incidencia);
    } else {
      return this.crearIncidencia(incidencia);
    }
  }

}
