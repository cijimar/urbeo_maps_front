/*import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Incidencia } from '../../model/Incidencia';

@Component({
  selector: 'app-modal-crear-incidencia',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './modal-crear-incidencia.html',
  styleUrl: './modal-crear-incidencia.css'
})

export class ModalCrearIncidenciaComponent {

  @Input() latitud!: number;
  @Input() longitud!: number;

  @Output() guardar = new EventEmitter<Incidencia>();

  titulo = '';
  descripcion = '';

  crearIncidencia() {

    const incidencia: Incidencia = {
      latitud: this.latitud,
      longitud: this.longitud,
      titulo: this.titulo,
      descripcion: this.descripcion
    };

    this.guardar.emit(incidencia);
  }
}*/