import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-crear-materia',
  templateUrl: './crear-materia.component.html',
  styleUrls: ['./crear-materia.component.css']
})
export class CrearMateriaComponent {

  public dataSource = new MatTableDataSource<HorarioMaterias>();

  public errorNombreMateria: string = "";

  public errorCantidadCreditos:string = "";

  public habilitarFechas:boolean = false;

  public semestre?:Semestre;

  public horariosAgregados:HorarioMaterias[] = []

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
        this.generarMensaje("Hubo un error en crear la materia", "error", false)
        this.spinner.hide()
      },
      complete: () =>{
        this.spinner.hide()
        this.generarMensaje("Se creo correctamente la materia", "success", true)}
    })
   }

   public abrirDialogo(){
      this.matDialog.open(DialogoComponent, {
        data: {
          titulo: "Contexto",
          tipoVentana: "MATERIAS"
        },
      }).beforeClosed().subscribe((resultado) => {
          if(resultado > 0){
            const materiasVacias:HorarioMaterias[] = []
            for(let i = 0; i<Number(resultado); i++){
              const formHorarios = new FormGroup({
                horaInicio: new FormControl(''),
                horaFinal: new FormControl(''),
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
            this.generarMensaje("La cantidad ingresada es menor a 0, porfavor, ingresa un numero mayor", "error", false)
          }
         
      })
   }

   ngOnInit(): void {
      this.spinner.show()
      this.actualizarMensajeError()
      this.codigoMateria.disable()

      this.semestreService.semestreVencido().subscribe({
        next: (v:RespuestaGeneral) => {
          if(v.data as Boolean){
            this.generarMensaje("El semestre esta vencido,porfavor, genera uno nuevo", "error", false)
            this.route.navigate(["/administrativos"])
          }
        },
        error: (e) => {
          console.error(e);
          this.spinner.hide()
          this.generarMensaje("Hubo un error en validar el semestre", "error", false)
      },
      complete: () => {
        this.semestreService.getUltimoSemestre().subscribe({
          next:(v:RespuestaGeneral) => {
              this.semestre = v.data as Semestre;
          },
          error: (e) => {
            console.error(e);
            this.spinner.hide()
            this.generarMensaje("Hubo un error en traer el ultimo semestre", "error", false)
          },
          complete: () => {
            this.materiaService.generarCodigo().subscribe({
              next: (e:RespuestaGeneral) => {
                this.codigoMateria.setValue(e.data);
              },
              error: (e) => {
                console.error(e);
                this.spinner.hide()
                this.generarMensaje("Hubo un error en generar el codigo", "error", false)
              },
              complete: () => this.spinner.hide()
            })
          }
        })
      }
      })
    }

   private actualizarMensajeError(){

    this.errorNombreMateria = this.nombreMateria.invalid ? "Se requiere un nombre de la materia" : "";
    this.errorCantidadCreditos = this.numeroCreditos.invalid ? "Se requiere una cantidad" : "";

  }

  public agregarHorario(indice:number){
    let horarioAgregar = this.horarios.controls[indice].value as HorarioMaterias
    horarioAgregar.indice = null;
    if(this.horariosAgregados.filter(materiaD => materiaD.horaInicio === horarioAgregar.horaInicio && materiaD.horaFinal === horarioAgregar.horaFinal).length > 0){
      this.generarMensaje("Ya existe este horario, porfavor, coloca otro distinto", "error", false)
    }else if(horarioAgregar.horaInicio === horarioAgregar.horaFinal){
      this.generarMensaje("Los horarios son iguales, deben ser distintos", "error", false)
      
    }else if((horarioAgregar.horaInicio as Time) > (horarioAgregar.horaFinal as Time)){
      this.generarMensaje("La hora inicial es mayor que la hora final, porfavor, cambialos", "error", false)
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

  private generarMensaje(mensaje:string, icono:SweetAlertIcon, pasarPagina:boolean){
    Swal.fire({
      text: mensaje,
      icon: icono,
      showCancelButton: false
    }).then((resultado) => {
      if(pasarPagina  && (resultado.isConfirmed || resultado.isDismissed)){
        this.route.navigate(["/administrativos"])
      }
    });
  }

}
