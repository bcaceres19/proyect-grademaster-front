import { Component, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DialogoComponent } from 'src/app/components/dialogo/dialogo.component';
import { HorarioMaterias } from '../../interface/horario-materias.interface';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Router } from '@angular/router';
import { SemestreService } from '../../services/semestre.service';
import { RespuestaGeneral } from 'src/app/interface/respuesta-general.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { MateriaService } from '../../services/materia.service';
import { CrearMateria } from '../../interface/crear-materia.interface';
import { Materia } from '../../interface/materia.interface';
import { Semestre } from '../../interface/semestre.interface';
import { Time } from '@angular/common';
import { MensajesErrorConstantes } from 'src/app/shared/mensajesError.constants';
import { MensajesOk } from 'src/app/shared/mensajesOk.constants';

@Component({
  selector: 'app-crear-materia',
  templateUrl: './crear-materia.component.html',
  styleUrls: ['./crear-materia.component.css']
})
export class CrearMateriaComponent {

  public dataSource = new MatTableDataSource<HorarioMaterias>();


  public habilitarFechas:boolean = false;

  public semestre?:Semestre;

  @ViewChild(FormGroupDirective) formRef!: FormGroupDirective;

  public horariosAgregados:HorarioMaterias[] = []

  public mensajesError = MensajesErrorConstantes;

  public formMateria = new FormGroup({
    'codigoMateria': new FormControl(''),
    'nombreMateria':new FormControl('', Validators.required),
    'numeroCreditos':new FormControl('', Validators.required),
    'horarios': new FormArray([])
  })


  public nombreColumnas:string[] = [
    'horaInicio',
    'horaFinal',
    'acciones'
  ]

  get codigoMateria(){
    return this.formMateria.get("codigoMateria") as FormControl
  }

  get nombreMateria(){
    return this.formMateria.get("nombreMateria") as FormControl
  }

  get numeroCreditos(){
    return this.formMateria.get("numeroCreditos") as FormControl
  }

  get horarios(){
    return this.formMateria.get("horarios") as FormArray
  }

   constructor(private matDialog:MatDialog,
    private route:Router,
    private spinner:NgxSpinnerService,
    private semestreService:SemestreService,
    private materiaService:MateriaService
   ){}

   public crearMateria(){
    this.spinner.show()
    const materia:Materia = {
      codigo:this.codigoMateria.value,
      nombre:this.nombreMateria.value,
      ncreditos:this.numeroCreditos.value
    }
    const dataMateria:CrearMateria = {
      materia: materia,
      horarios: this.horariosAgregados,
      semestre: this.semestre
    }
    this.materiaService.crearMateria(dataMateria).subscribe({
      next: (v:RespuestaGeneral) => {},
      error: (e) => {
        console.error(e);
        this.spinner.hide()
        this.generarMensaje(this.mensajesError.ERROR_GENERAL,"error");
      },
      complete: () =>{
        this.spinner.hide()
        this.generarMensajeCrear(MensajesOk.MENSAJE_CONFIRMACION_MATERIA, "success")}
    })
   }

   public abrirDialogo(){
      this.matDialog.open(DialogoComponent, {
        data: {
          titulo: "Crear Horarios",
          tipoVentana: "MATERIAS"
        },
      }).beforeClosed().subscribe((resultado) => {
          if(resultado > 0){
            const materiasVacias:HorarioMaterias[] = []
            for(let i = 0; i<Number(resultado); i++){
              const formHorarios = new FormGroup({
                horaInicio: new FormControl('', Validators.required),
                horaFinal: new FormControl('',Validators.required),
                activarBoton: new FormControl(true)
              })
              this.horarios.push(formHorarios);
              materiasVacias.push({
                indice: i
              })
            }
            this.dataSource = new MatTableDataSource<HorarioMaterias>(materiasVacias as HorarioMaterias[]);
            this.habilitarFechas = true;
          }else{
            this.generarMensaje(this.mensajesError.ERROR_CANTIDAD_HORARIOS, "error")
          }
         
      })
   }

   ngOnInit(): void {
      this.spinner.show()
      this.codigoMateria.disable()

      this.semestreService.semestreVencido().subscribe({
        next: (v:RespuestaGeneral) => {
          if(v.data as Boolean){
            this.generarMensaje(this.mensajesError.ERROR_SEMESTRE_VENCIDO, "error")
            this.route.navigate(["/administrativos"])
          }
        },
        error: (e) => {
          console.error(e);
          this.spinner.hide()
          this.generarMensaje(this.mensajesError.ERROR_GENERAL, "error")
      },
      complete: () => {
        this.semestreService.getUltimoSemestre().subscribe({
          next:(v:RespuestaGeneral) => {
              this.semestre = v.data as Semestre;
          },
          error: (e) => {
            console.error(e);
            this.spinner.hide()
            this.generarMensaje(this.mensajesError.ERROR_GENERAL, "error")
          },
          complete: () => {
            this.materiaService.generarCodigo().subscribe({
              next: (e:RespuestaGeneral) => {
                this.codigoMateria.setValue(e.data);
              },
              error: (e) => {
                console.error(e);
                this.spinner.hide()
                this.generarMensaje(this.mensajesError.ERROR_GENERAL, "error")
              },
              complete: () => this.spinner.hide()
            })
          }
        })
      }
      })
    }


  public agregarHorario(indice:number){
    let horarioAgregar = this.horarios.controls[indice].value as HorarioMaterias
    horarioAgregar.indice = null;
    if(this.horariosAgregados.filter(materiaD => materiaD.horaInicio === horarioAgregar.horaInicio && materiaD.horaFinal === horarioAgregar.horaFinal).length > 0){
      this.generarMensaje(this.mensajesError.ERROR_HORARIO_EXISTENTE, "error")
    }else if(horarioAgregar.horaInicio === horarioAgregar.horaFinal){
      this.generarMensaje(this.mensajesError.ERROR_HORARIO_IGUAL, "error")
    }else if((horarioAgregar.horaInicio as Time) > (horarioAgregar.horaFinal as Time)){
      this.generarMensaje(this.mensajesError.ERROR_FINAL_MENOR, "error")
    }else{
      this.horarios.controls[indice].get('activarBoton')?.setValue(false)
      this.horariosAgregados.push(horarioAgregar)
    }
  }

  public quitarHorario(indice:number){
    this.horarios.controls[indice].get('activarBoton')?.setValue(true)
    const deleteData = this.horariosAgregados.filter(materiaD => materiaD.horaInicio !== this.horarios.controls[indice].get('horaInicio')?.value && materiaD.horaFinal !== this.horarios.controls[indice].get('horaFinal')?.value);
    this.horariosAgregados = deleteData;
  }

  private generarMensajeCrear(mensaje:string, icono:SweetAlertIcon){
    Swal.fire({
      text: mensaje,
      icon: icono,
      showCancelButton: true,
      allowOutsideClick: false
    }).then((resultado) => {
      if(resultado.isConfirmed){
        this.formRef.resetForm();
        this.habilitarFechas = false;
        this.materiaService.generarCodigo().subscribe({
          next: (e:RespuestaGeneral) => {
            this.codigoMateria.setValue(e.data);
          },
          error: (e) => {
            console.error(e);
            this.spinner.hide()
            this.generarMensaje(this.mensajesError.ERROR_GENERAL, "error")
          },
          complete: () => this.spinner.hide()
        })
      }else if(resultado.dismiss?.toString() === 'cancel'){
        this.route.navigate(["/administrativos"])
      }
    });
  }

  private generarMensaje(mensaje:string, icono:SweetAlertIcon){
    Swal.fire({
      text: mensaje,
      icon: icono,
      showCancelButton: false,
      allowOutsideClick: false
    });
  }

  public volver(){
    this.route.navigate(["/administrativos"])
  }
}
