import { Component } from '@angular/core';
import { Estudiante } from '../../interface/estudiante.interface';
import { EstudianteService } from '../../services/estudiante.service';
import { DocenteService } from '../../services/docente.service';
import { Docente } from '../../interface/docente.interface';
import { RespuestaGeneral } from 'src/app/interface/respuesta-general.interface';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  public listDocentes:Docente[] = []

  public listEstudiantes:Estudiante[] = []

  constructor(private estudianteService:EstudianteService,
    private docenteService:DocenteService
  ){}

  ngOnInit(): void {
    this.estudianteService.getAllEstudiantesActivos().subscribe({
      next:(v:RespuestaGeneral) => {
        this.listEstudiantes = v.data as Estudiante[]
      },
      error:(e)=> {
        console.error(e);
      },
      complete: () => {
      }
    })
    this.docenteService.buscarDocentesAtivosSistema().subscribe({
      next:(v:RespuestaGeneral) => {
        this.listDocentes = v.data as Docente[]
      },
      error:(e) => {
        console.error(e);
      },
      complete: () => {}
    })
  }

}
