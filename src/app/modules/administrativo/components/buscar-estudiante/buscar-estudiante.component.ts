import { Component } from '@angular/core';
import { Estudiante } from '../../interface/estudiante.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { EstudianteService } from '../../services/estudiante.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SemestreService } from '../../services/semestre.service';
import { Semestre } from '../../interface/semestre.interface';
import { RespuestaGeneral } from 'src/app/interface/respuesta-general.interface';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { MensajesErrorConstantes } from 'src/app/shared/mensajesError.constants';
import { Materia } from '../../interface/materia.interface';
import { DialogoComponent } from 'src/app/components/dialogo/dialogo.component';
import { AsignarMateriasEstudiante } from '../../interface/asignar-materias-estudiante.interface';
import { MensajesOk } from 'src/app/shared/mensajesOk.constants';

@Component({
  selector: 'app-buscar-estudiante',
  templateUrl: './buscar-estudiante.component.html',
  styleUrls: ['./buscar-estudiante.component.css']
})
export class BuscarEstudianteComponent {

  public listEstudiantes:Estudiante[] = []

  public mensajeError = MensajesErrorConstantes;


  public semestre?:Semestre;

  public campoBusqueda= new FormGroup({
    'nombre': new FormControl('')
  })

  constructor(private estudianteService:EstudianteService,
    private spinner:NgxSpinnerService,
    private matDialog:MatDialog,
    private semestreService:SemestreService
  ){}
  
  ngOnInit(): void {
    this.spinner.show()
    this.getAllEstudiantesActivos()
    this.semestreService.getUltimoSemestre().subscribe({
      next: (v:RespuestaGeneral) => {
        this.semestre = v.data as Semestre;  
      },
      error: (e) => {
        console.error(e);
        this.spinner.hide()
      },
      complete: () => {
        this.spinner.hide()
      }
    });
  }

  public getAllEstudiantesActivos(){
    this.spinner.show()
    this.estudianteService.getAllEstudiantesActivos().subscribe({
      next: (v:RespuestaGeneral) => {
        this.listEstudiantes = v.data as Estudiante[]
      },
      error: (e) => {
        console.error(e);
        this.spinner.hide();
        this.generarMensaje(this.mensajeError.ERROR_GENERAL,"error");
      },
      complete: () => {
        this.spinner.hide()
      }
    })
  }

  private generarMensaje(mensaje:string, icono:SweetAlertIcon){
    Swal.fire({
      text: mensaje,
      icon: icono,
      showCancelButton: false
    })
  }

  public buscarEstudiantesNombre(){
    this.spinner.show()
    this.estudianteService.getAllEstudiantesActivosNombre(this.campoBusqueda.get("nombre")?.value!).subscribe({
      next: (v:RespuestaGeneral) => {
        this.listEstudiantes = v.data as Estudiante[]
      },
      error: (e) => {
        console.error(e);
        this.spinner.hide()
        this.generarMensaje(this.mensajeError.ERROR_GENERAL,"error");
      },
      complete: () => {
        this.spinner.hide()
      }
    })
  }

  public abrirDialogo(objEstudiante:Estudiante){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true
    dialogConfig.data = {
      titulo: "Asignar Materias",
      tipoVentana: "ESTUDIANTE",
      data: {
        codigoCarrera:objEstudiante.codigoCarreraEntityFk?.codigoCarrera,
        codigoEstudiante:objEstudiante.codigoEstudiante
      },
      allowOutsideClick: false
    }
    this.matDialog.open(DialogoComponent,dialogConfig).beforeClosed().subscribe((resultado) => {
      const materias:Materia[] = resultado.dataAsig as Materia[]
      if(materias.length !== 0 && resultado.nuevo){
        const estudiante:Estudiante = {
          codigoEstudiante: objEstudiante.codigoEstudiante
        }
        const estudianteMaterias:AsignarMateriasEstudiante = {
          estudianteDto: estudiante,
          materiasAsignar: materias,
          materiasNoAsignadas: resultado.dataNoAsig
        }
        this.spinner.show()
        this.estudianteService.asignarMateriasEstudiante(estudianteMaterias).subscribe({
          next: (v:RespuestaGeneral) => {},
          error: (e) => {
            console.error(e);
            this.spinner.hide()
            this.generarMensaje(this.mensajeError.ERROR_GENERAL,"error");
          },
          complete: () => {
            this.spinner.hide()
            this.generarMensaje(MensajesOk.MENSAJE_CONFIRMACION_ASIGNACION_MATERIAS, "success")
          }
        })
      }else if(materias.length === 0){
        this.generarMensaje(this.mensajeError.ERROR_CANTIDAD_MATERIAS_ESTUDIANTE,"error");
      }
    })
  }


}
