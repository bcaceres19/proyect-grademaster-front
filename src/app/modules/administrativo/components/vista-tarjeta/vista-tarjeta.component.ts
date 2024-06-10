import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Estudiante } from '../../interface/estudiante.interface';

@Component({
  selector: 'app-vista-tarjeta',
  templateUrl: './vista-tarjeta.component.html',
  styleUrls: ['./vista-tarjeta.component.css']
})
export class VistaTarjetaComponent {

  @Input()
  public codigo?:string | null;

  @Input()
  public nombre?:string;

  @Input()
  public genero?:string | null;

  @Input()
  public telefono?:string | null;

  @Input()
  public correoUniversitario?:string | null;
  
  @Input()
  public correoPersonal?:string | null;

  @Input()
  public urlImagen?:string|null;

  @Input()
  public nombreEstado?:string | null;

  @Input()
  public textoBotonUno?:string;

  @Input()
  public objetoEstudiante?:Estudiante;

  @Input()
  public tipoTarjeta?:string;

  @Output() itemModal = new EventEmitter<string>();
  emitirModal(){
    this.itemModal.emit(this.codigo!);
  }

  @Output() objetoModal = new EventEmitter<Estudiante>();
  emitirObjeto(){
    this.objetoModal.emit(this.objetoEstudiante);
  }
}
