import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    this.actualizarMensajeError();
  }

  public crearCarreras(){
    this.spinner.show()
    if(this.dataSourceAgreg.data && this.dataSourceAgreg.data.length < 3){
      this.spinner.hide()
      this.generarMensaje("La carrera debe tener al menos 3 o mas materias", "error", false)
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
            this.generarMensaje("Hubo un error en crear la materia, prueba mas tarde", "error", false)
            this.spinner.hide()
        },
        complete: () => {
          this.spinner.hide();
          this.generarMensaje("Se creo correctamente la carrera", "success", true)
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
          this.generarMensaje("Hubo un error en generar las materias, comunicate con el administrados",
           "error", false)
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
        this.generarMensaje("Hubo un error en generar el codigo, comunicate con el administrados",
         "error",false)
        this.spinner.hide()
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

  private actualizarMensajeError(){

    this.errorNombreCarrera = this.nombreCarrera.invalid ? "Se requiere un nombre de carrera" : "";

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

