import { Component } from '@angular/core';
import { Docente } from '../../interface/docente.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { DocenteService } from '../../services/docente.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { RespuestaGeneral } from 'src/app/interface/respuesta-general.interface';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { Materia } from '../../interface/materia.interface';
import { MatDialog } from '@angular/material/dialog';
import { DialogoComponent } from 'src/app/components/dialogo/dialogo.component';
import { AsignarMaterias } from '../../interface/asignar-materias.interface';
import { Semestre } from '../../interface/semestre.interface';
import { SemestreService } from '../../services/semestre.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buscar-docente',
  templateUrl: './buscar-docente.component.html',
  styleUrls: ['./buscar-docente.component.css']
})
export class BuscarDocenteComponent {

  public listDocentes:Docente[] = []

  public semestre?:Semestre;

  public campoBusqueda= new FormGroup({
    'nombre': new FormControl('')
  })

  constructor(private docenteService:DocenteService,
    private spinner:NgxSpinnerService,
    private matDialog:MatDialog,
    private route:Router,
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
        this.generarMensaje("Error en traer los docentes, comunicate con el administrador", "error");
        this.spinner.hide();
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

  public abrirDialogo(codigo:string){
    this.matDialog.open(DialogoComponent, {
      data: {
        titulo: "Contexto",
        tipoVentana: "DOCENTE",
        data: codigo
      },
    }).beforeClosed().subscribe((resultado) => {
      const materias:Materia[] = resultado as Materia[]
      if(materias.length !== 0){
        const docente:Docente = {
          codigoDocente: codigo
        }
        const docenteMateras:AsignarMaterias = {
          docenteDto: docente,
          semestreDto: this.semestre,
          materiasAsignar: resultado
        }
        this.spinner.show()
        this.docenteService.asignarMateriasDocente(docenteMateras).subscribe({
          next: (v:RespuestaGeneral) => {},
          error: (e) => {
            console.error(e);
            this.generarMensaje("Hubo un error en asignar las materias", "error")
            this.spinner.hide()
          },
          complete: () => {
            this.generarMensaje("Se asignaron las materias exitosamente", "success")
            this.spinner.hide()
          }
        })
      }
    })
  }

}
