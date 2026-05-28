import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Incidencia } from '../../model/Incidencia';

@Component({
  selector: 'app-modal-crear-incidencia',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './modal-crear-incidencia.html',
  styleUrl: './modal-crear-incidencia.css'
})

export class ModalCrearIncidenciaComponent {

  @Input() latitud!: number;
  @Input() longitud!: number;
  @Input() visible = false;

  @Output() guardar = new EventEmitter<Incidencia>();
  @Output() cancelar = new EventEmitter<void>();

  titulo = '';
  descripcion = '';
  categoria = 'General';
  categorias = ['General', 'Alumbrado', 'Baches', 'Limpieza', 'Ruido', 'Otro'];

  crearIncidencia() {
    if (!this.titulo.trim()) return;

    const incidencia: Incidencia = {
      latitud: this.latitud,
      longitud: this.longitud,
      titulo: this.titulo,
      descripcion: this.descripcion,
      categoria: this.categoria,
      estado: 'Abierta'
    };

    this.guardar.emit(incidencia);
    this.resetForm();
  }

  cerrar() {
    this.cancelar.emit();
    this.resetForm();
  }

  private resetForm() {
    this.titulo = '';
    this.descripcion = '';
    this.categoria = 'General';
  }
}