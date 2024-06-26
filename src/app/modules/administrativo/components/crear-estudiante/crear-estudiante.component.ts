import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { CloudinaryService } from '../../services/cloudinary.service';
import { Carrera } from '../../interface/carrera.interface';
import { Estudiante } from '../../interface/estudiante.interface';
import { Estado } from '../../interface/estado.interface';
import { EstudianteService } from '../../services/estudiante.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TransversalesService } from 'src/app/services/transversales.service';
import { Genero } from 'src/app/interface/genero.interface';
import { RespuestaGeneralData } from 'src/app/interface/RespuestaDataGeneral.interface';
import { MensajesErrorConstantes } from 'src/app/shared/mensajesError.constants';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Router } from '@angular/router';
import { MensajesOk } from 'src/app/shared/mensajesOk.constants';

@Component({
  selector: 'app-crear-estudiante',
  templateUrl: './crear-estudiante.component.html',
  styleUrls: ['./crear-estudiante.component.css']
})
export class CrearEstudianteComponent {

  public carreras:Carrera[] = []

  public estados:Estado[] = []

  public generos:Genero[] = []

  public file:File[] = [];

  @ViewChild(FormGroupDirective) formRef!: FormGroupDirective;

  public mensajesError = MensajesErrorConstantes;

  public codigoEstudiante:string = "";

  public correoEstudiante:string = "";

  formCrearEstudiante = new FormGroup({
    'nombres': new FormControl('', Validators.required),
    'apellidos': new FormControl('', Validators.required),
    'codigoUniversitario': new FormControl('',[Validators.required,Validators.minLength(1)]),
    'edad': new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(2)]),
    'telefono': new FormControl('', [Validators.required, Validators.maxLength(10)]),
    'correoPersonal': new FormControl('',  [Validators.required, Validators.email]),
    'correoUniversitario': new FormControl('', [Validators.required,Validators.minLength(1)]),
    'genero': new FormControl('', Validators.required),
    'carrera': new FormControl('', Validators.required),
    'estado': new FormControl('', Validators.required),
    'cedula': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
    'imagen': new FormControl('', Validators.required)
  })

  get cedula(){
    return this.formCrearEstudiante.get('cedula') as FormControl;
  }

  get estado(){
    return this.formCrearEstudiante.get('estado')as FormControl;
  }

  get carrera(){
    return this.formCrearEstudiante.get('carrera')as FormControl;
  }

  get genero(){
    return this.formCrearEstudiante.get('genero')as FormControl;
  }

  get correoUniversitario(){
    return this.formCrearEstudiante.get('correoUniversitario')as FormControl;
  }

  get correoPersonal() {
    return this.formCrearEstudiante.get('correoPersonal')as FormControl;
  }

  get telefono(){
    return this.formCrearEstudiante.get('telefono')as FormControl;
  }

  get edad(){
    return this.formCrearEstudiante.get('edad')as FormControl;
  }

  get codigoUniversitario(){
    return this.formCrearEstudiante.get('codigoUniversitario')as FormControl;
  }

  get nombres(){
    return this.formCrearEstudiante.get('nombres')as FormControl;
  }

  get apellidos(){
    return this.formCrearEstudiante.get('apellidos')as FormControl;
  }

  get imagen(){
    return this.formCrearEstudiante.get('imagen')as FormControl;
  }

  constructor(private cloudService:CloudinaryService,
     private estudianteService:EstudianteService,
     private spinner:NgxSpinnerService,
    private transversales:TransversalesService,
    private route:Router
  ){}

  ngOnInit(): void {
    this.spinner.show()
    this.llenarData()
    this.codigoUniversitario?.disable();
    this.correoUniversitario?.disable();
  }  

  private llenarData(){
    this.spinner.show()
    this.transversales.getDataGeneral(true).subscribe({
      next: (v:RespuestaGeneralData) =>{
        this.generos = v.generos?.data as Genero[]
        this.estados = v.estados?.data as Estado[]
        this.carreras = v.carreras?.data as Carrera[]
      },
      error: (e) => {
        console.log(e);
        this.spinner.hide()
        this.generarMensaje(this.mensajesError.ERROR_GENERAL,"error");
      },
      complete: () => {
        this.spinner.hide()
      }
    })
  }

  crearEstudiante(){
    const data = new FormData();
    if(this.imagen?.value){
      data.append('file', this.imagen.value);
      data.append('upload_preset', 'imagenes-usuarios');
      data.append('cloud_name', 'dduffgima');
      this.spinner.show();
      this.cloudService.upload(data).subscribe({
        next: (v) => {
          const urlSecure = v.secure_url;
          const carreraDto:Carrera = {
            codigoCarrera: this.carrera!.value
          }
          const estadoDto:Estado = {
            id: this.estado!.value ? Number.parseInt(this.estado!.value) : null,
            nombre:null
          }

          const crearEstudianteDto:Estudiante = this.generarEstudiante(urlSecure, carreraDto, estadoDto);
          this.estudianteService.crearEstudiante(crearEstudianteDto).subscribe({
              error: (e) => {
                console.log(e);
                this.spinner.hide()
                this.generarMensaje(this.mensajesError.ERROR_GENERAL,"error");
              },
              complete: () => {
                this.spinner.hide()
                this.generarMensajeCrear(MensajesOk.MENSAJE_CONFIRMACION_ESTUDIANTE, "success")
              }
          })
        },
        error: (e) => {
          console.log(e);
          this.spinner.hide();
          this.generarMensaje(this.mensajesError.ERROR_GENERAL,"error");
        }
      })
    }
  }

  subirArchivo(event:any){
    const file = event.target.files[0];
    if (file) {
        this.imagen?.setValue(file);
    }
  }

  private generarEstudiante(urlImg?:string, carreraDto?:Carrera, estadoDto?:Estado):Estudiante{
    return  {
      codigoEstudiante: this.codigoUniversitario!.value,
      correoUniversitario: this.correoUniversitario!.value,
      edad: this.edad!.value,
      telefono: this.telefono!.value,
      apellidos: this.apellidos!.value,
      nombres: this.nombres!.value,
      correoPersonal: this.correoPersonal!.value,
      genero: this.genero!.value,
      codigoImagen: urlImg,
      codigoCarreraEntityFk: carreraDto,
      estadoEntityFk: estadoDto,
      cedulaEstudiante: this.cedula!.value
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


  generarCodigo(){
    this.spinner.show()
    this.estudianteService.generarCodigo(this.generarEstudiante()).subscribe({
      next: (v) => {
        const contenido:string = String(v.data);
        if(contenido === 'ERROR'){
          this.spinner.hide()
          this.generarMensaje(this.mensajesError.ERROR_CODIGO_EXISTENTE, "error");
        }else{
          this.codigoEstudiante = v.data + "";
        }
      },error: (e) => {
        console.log(e)
        this.spinner.hide()
        this.generarMensaje(this.mensajesError.ERROR_GENERAL,"error");
      }, complete: () => {
        this.spinner.hide()
      }
    })
  }

  generarCorreo(){
    this.spinner.show()
    this.estudianteService.generarCorreo(this.generarEstudiante()).subscribe({
      next: (v) => {
        this.correoEstudiante =  v.data + "";
      },error: (e) => {
        console.log(e)
        this.spinner.hide()
        this.generarMensaje(this.mensajesError.ERROR_GENERAL,"error");
      }, complete: () => {
        this.spinner.hide()
      }
    })
  }

}
