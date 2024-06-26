import { Component } from '@angular/core';
import { Docente } from '../../interface/docente.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { DocenteService } from '../../services/docente.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaGeneral } from 'src/app/interface/respuesta-general.interface';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { Materia } from '../../interface/materia.interface';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogoComponent } from 'src/app/components/dialogo/dialogo.component';
import { AsignarMaterias } from '../../interface/asignar-materias.interface';
import { Semestre } from '../../interface/semestre.interface';
import { SemestreService } from '../../services/semestre.service';
import { Router } from '@angular/router';
import { MensajesErrorConstantes } from 'src/app/shared/mensajesError.constants';
import { MensajesOk } from 'src/app/shared/mensajesOk.constants';

@Component({
  selector: 'app-buscar-docente',
  templateUrl: './buscar-docente.component.html',
  styleUrls: ['./buscar-docente.component.css']
})
export class BuscarDocenteComponent {

  public mensajeError = MensajesErrorConstantes;

  public listDocentes:Docente[] = []

  public semestre?:Semestre;

  public campoBusqueda= new FormGroup({
    'nombre': new FormControl('')
  })

  constructor(private docenteService:DocenteService,
    private spinner:NgxSpinnerService,
    private matDialog:MatDialog,
    private semestreService:SemestreService
  ){}

  ngOnInit(): void {
    this.spinner.show()
    this.getAllDocentesActivos()
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

  public getAllDocentesActivos(){
    this.spinner.show()
    this.docenteService.buscarDocentesAtivosSistema().subscribe({
      next: (v:RespuestaGeneral) => {
        this.listDocentes = v.data as Docente[]
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

  public buscarDocenteNombre(){
    this.spinner.show()
    this.docenteService.buscarDocenteNombre(this.campoBusqueda.get("nombre")?.value!).subscribe({
      next: (v:RespuestaGeneral) => {
        this.listDocentes = v.data as Docente[]
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

  public abrirDialogo(codigo:string){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true
    dialogConfig.data = {
      titulo: "Asignar Materias",
      tipoVentana: "DOCENTE",
      data: codigo,
      allowOutsideClick: false
    }
    this.matDialog.open(DialogoComponent,dialogConfig).beforeClosed().subscribe((resultado) => {
      const materias:Materia[] = resultado.dataAsig as Materia[]
      if(materias.length !== 0 && resultado.nuevo){
        const docente:Docente = {
          codigoDocente: codigo
        }
        const docenteMateras:AsignarMaterias = {
          docenteDto: docente,
          semestreDto: this.semestre,
          materiasAsignar: materias,
          materiasNoAsignadas: resultado.dataNoAsig
        }
        this.spinner.show()
        this.docenteService.asignarMateriasDocente(docenteMateras).subscribe({
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
      }
    })
  }

}
