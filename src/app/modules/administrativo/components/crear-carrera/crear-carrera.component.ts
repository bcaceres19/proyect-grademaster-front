import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Materia } from '../../interface/materia.interface';
import { TransversalesService } from 'src/app/services/transversales.service';
import { RespuestaGeneral } from 'src/app/interface/respuesta-general.interface';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSort } from '@angular/material/sort';
import { CarreraService } from '../../services/carrera.service';
import { Carrera } from '../../interface/carrera.interface';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Router } from '@angular/router';
import { MensajesErrorConstantes } from 'src/app/shared/mensajesError.constants';
import { MensajesOk } from 'src/app/shared/mensajesOk.constants';

@Component({
  selector: 'app-crear-carrera',
  templateUrl: './crear-carrera.component.html',
  styleUrls: ['./crear-carrera.component.css']
})
export class CrearCarreraComponent {

  public errorNombreCarrera: string = "";

  public formCarrera= new FormGroup({
    'codigoCarrera': new FormControl(''),
    'nombreCarrera': new FormControl('', Validators.required),
    'totalCreditos': new FormControl('')
  })

  @ViewChild(FormGroupDirective) formRef!: FormGroupDirective;


  get codigoCarrera(){
    return this.formCarrera.get("codigoCarrera") as FormControl;
  }

  get nombreCarrera(){
    return this.formCarrera.get("nombreCarrera") as FormControl;
  }

  get totalCreditos(){
    return this.formCarrera.get("totalCreditos") as FormControl;
  }

  public totalCreditosInput:number = 0;

  public habilitarMaterias:boolean =false;

  public nombreColumnas:string[] = [
    'nombre',
    'nrCreditos',
    'acciones'
  ]

  constructor(
    private route:Router,
    private transversales:TransversalesService,
    private spinner:NgxSpinnerService,
    private carreraService:CarreraService
  ){
  }

  public dataSource = new MatTableDataSource<Materia>();

  public dataSourceAgreg = new MatTableDataSource<Materia>();

  public mensajesError = MensajesErrorConstantes;


  @ViewChild(MatSort) sort: MatSort = new MatSort;


  public formControles:FormGroup = new FormGroup({
    'nombreMateria': new FormControl('', Validators.required)
  })

  public addMateria(dataAdd:MatTableDataSource<Materia>, 
    dataDelete: MatTableDataSource<Materia>,
     materiaAct:Materia,
    eliminar:boolean){
    const data = dataAdd.data;
    data.push(materiaAct)
    const deleteData = dataDelete.data.filter(materiaD => materiaD.codigo !== materiaAct.codigo);
    dataAdd.data =data;
    dataDelete.data = deleteData;
    if(this.totalCreditos != null && materiaAct.ncreditos !== undefined){
      if(!eliminar){
        this.totalCreditos.setValue(String(Number(this.totalCreditos.value)+Number(materiaAct.ncreditos)))
      }else{
        this.totalCreditos.setValue(String(Number(this.totalCreditos.value)-Number(materiaAct.ncreditos)))
      }
    }
  }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSourceAgreg.sort = this.sort;
    this.iniciarMaterias();
    this.totalCreditos?.setValue(String(this.totalCreditosInput));
    this.totalCreditos?.disable();
    this.generarCodigo();
    this.codigoCarrera?.disable();
    this.sort.sort({id:'codigo',start:'asc', disableClear:true})
  }

  public crearCarreras(){
    this.spinner.show()
    if(this.dataSourceAgreg.data && this.dataSourceAgreg.data.length < 3){
      this.spinner.hide()
      this.generarMensaje(this.mensajesError.ERROR_CANTIDAD_MATERIAS, "error")
    }else{
      const carrera:Carrera = {
        codigoCarrera: this.codigoCarrera?.value,
        nombreCarrera: this.nombreCarrera?.value,
        nCreditos: this.totalCreditos?.value
      }
      this.carreraService.crearCarrera(carrera, this.dataSourceAgreg.data).subscribe({
        next: (v:RespuestaGeneral) =>{},
        error: (e) => {
            console.error(e);
            this.spinner.hide()
            this.generarMensaje(this.mensajesError.ERROR_GENERAL,"error");
        },
        complete: () => {
          this.spinner.hide();
          this.generarMensajeCrear(MensajesOk.MENSAJE_CONFIRMACION_CARRERA, "success")
        }
      })
    }
  }

  private iniciarMaterias(){
 
      this.transversales.getMaterias().subscribe({
        next: (v:RespuestaGeneral) => {
          this.dataSource = new MatTableDataSource<Materia>(v.data as Materia[]);
        },
        error: (e) =>{
          console.error(e);
          this.spinner.hide();
          this.generarMensaje(this.mensajesError.ERROR_GENERAL,"error");
        },
        complete: () =>{
          this.spinner.hide();
        }
      })
  }

  public generarCodigo(){
    this.spinner.show()
    this.carreraService.generarCodigo().subscribe({
      next: (v) => {
        this.codigoCarrera?.setValue(String(v.data));
      },error: (e) => {
        console.log(e)
        this.spinner.hide()
        this.generarMensaje(this.mensajesError.ERROR_GENERAL,"error");
      }, complete: () => {
        this.spinner.hide()
      }
    })
  }

  public habilitarZonaMaterias(){
    if(this.formCarrera.valid){
      this.habilitarMaterias = true;
    }
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

