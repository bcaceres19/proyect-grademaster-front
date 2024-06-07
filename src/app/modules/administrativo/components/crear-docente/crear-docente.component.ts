import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { Estado } from '../../interface/estado.interface';
import { Genero } from 'src/app/interface/genero.interface';
import { TransversalesService } from 'src/app/services/transversales.service';
import {  NgxSpinnerService } from 'ngx-spinner';
import { RespuestaGeneralData } from 'src/app/interface/RespuestaDataGeneral.interface';
import { Docente } from '../../interface/docente.interface';
import { DocenteService } from '../../services/docente.service';
import { CloudinaryService } from '../../services/cloudinary.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-docente',
  templateUrl: './crear-docente.component.html',
  styleUrls: ['./crear-docente.component.css']
})
export class CrearDocenteComponent {


  @ViewChild(FormGroupDirective) formRef!: FormGroupDirective;

  estados:Estado[] = [];

  generos:Genero[] = [];

  public mensajesError:string[] = [
    "Se requiere un nombre",
    "Se requiere al menos un apellido",
    "Se requiere el correo personal del docente",
    "Se requiere la cedula",
    "Se requiere el telefono",
    "Se requiere la edad",
    "Se requiere colocar un estado",
    "Se requiere colocar el genero",
    "Se requiere que se coloque un formato de email valido",
    "La cedula no puede tener mas  de 10 caracteres",
    "El telefono no puede tener mas de 10 digitos",
    "La edad no puede tener mas de dos digitos",
    "La edad de tener al menos un digitos"
  ];

  public file:File[] = [];

  formCrearDocente:FormGroup = new FormGroup({
    'nombres': new FormControl('', Validators.required),
    'apellidos': new FormControl('', Validators.required),
    'codigoDocente': new FormControl('', [Validators.required,Validators.minLength(1)]),
    'edad': new FormControl('',[ Validators.required, Validators.minLength(1), Validators.maxLength(2)]),
    'telefono': new FormControl('', [Validators.required, Validators.maxLength(10)]),
    'correoPersonal': new FormControl('', [Validators.required, Validators.email]),
    'correoDocente': new FormControl('', Validators.required),
    'genero': new FormControl('', Validators.required),
    'estado': new FormControl('', Validators.required),
    'cedula': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
    'imagen': new FormControl('', Validators.required)
  });

  get cedula(){
    return this.formCrearDocente.get('cedula') as FormControl;
  }

  get estado(){
    return this.formCrearDocente.get('estado')as FormControl;
  }

  get genero(){
    return this.formCrearDocente.get('genero')as FormControl;
  }

  get correoDocente(){
    return this.formCrearDocente.get('correoDocente')as FormControl;
  }

  get correoPersonal() {
    return this.formCrearDocente.get('correoPersonal')as FormControl;
  }

  get telefono(){
    return this.formCrearDocente.get('telefono')as FormControl;
  }

  get edad(){
    return this.formCrearDocente.get('edad')as FormControl;
  }

  get codigoDocente(){
    return this.formCrearDocente.get('codigoDocente')as FormControl;
  }

  get nombres(){
    return this.formCrearDocente.get('nombres')as FormControl;
  }

  get apellidos(){
    return this.formCrearDocente.get('apellidos')as FormControl;
  }

  get imagen(){
    return this.formCrearDocente.get('imagen')as FormControl;
  }

  constructor(
    private cloudService:CloudinaryService,
    private spinner:NgxSpinnerService,
    private docenteService:DocenteService,
    private transversales:TransversalesService,
    private route:Router
  ){}

  ngOnInit(): void {
    this.spinner.show()
    this.llenarData()
    this.codigoDocente?.disable();
    this.correoDocente?.disable();
  }

  private llenarData(){
    this.spinner.show()
    this.transversales.getDataGeneral(false).subscribe({
      next: (v:RespuestaGeneralData) =>{
        this.generos = v.generos?.data as Genero[]
        this.estados = v.estados?.data as Estado[]        
      },
      error: (e) => {
        console.log(e);
        this.spinner.hide()
      },
      complete: () => {
        this.spinner.hide()
      }
    })
  }

  public crearDocente(){
    const data = new FormData();
    if(this.imagen?.value){
      data.append('file', this.imagen.value);
      data.append('upload_preset', 'imagenes-usuarios');
      data.append('cloud_name', 'dduffgima');
      this.spinner.show();
      this.cloudService.upload(data).subscribe({
        next: (v) => {
          const urlSecure = v.secure_url;
          const estadoDto:Estado = {
            id: this.estado!.value ? Number.parseInt(this.estado!.value) : null,
            nombre:null
          }
          const crearEstudianteDto:Docente = this.generarDocente(urlSecure, estadoDto);
          this.docenteService.crearDocente(crearEstudianteDto).subscribe({
              error: (e) => {
                console.log(e);
                this.spinner.hide()
              },
              complete: () => {
                this.spinner.hide()
                this.generarMensaje("Se creo correctamente el docente, ¿Quieres crear otro?", "success")
              }
          })
        },
        error: (e) => {
          console.log(e);
          this.spinner.hide();
        }
      })
    }
  }

  public generarCodigo(){
    this.spinner.show()
    console.log(this.generarDocente());
    this.docenteService.generarCodigo(this.generarDocente()).subscribe({
      next: (v) => {
        this.codigoDocente?.setValue(v.data + "");
        console.log(this.nombres.invalid);
        console.log(this.apellidos.invalid);
        console.log(this.codigoDocente.value === '');
      },error: (e) => {
        console.log(e)
        this.spinner.hide()
      }, complete: () => {
        this.spinner.hide()
      }
    })
  }

  public generarCorreo(){
    this.spinner.show()
    this.docenteService.generarCorreo(this.generarDocente()).subscribe({
      next: (v) => {
        this.correoDocente?.setValue(v.data+"");
      
      },error: (e) => {
        console.log(e)
        this.spinner.hide()
      }, complete: () => {
        this.spinner.hide()
      }
    })
  }

  public subirArchivo(evento:any){
    const file = evento.target.files[0];
    if (file) {
        this.imagen?.setValue(file);
    }
  }

  
  private generarDocente(urlImg?:string, estadoDto?:Estado):Docente{
    return  {
      codigoDocente: this.codigoDocente!.value,
      correoUniversitario: this.correoDocente!.value,
      edad: this.edad!.value,
      telefono: this.telefono!.value,
      apellidos: this.apellidos!.value,
      nombres: this.nombres!.value,
      correoPersonal: this.correoPersonal!.value,
      genero: this.genero!.value,
      urlImagen: urlImg,
      estadoEntityFk: estadoDto,
      cedulaDocente: this.cedula!.value
    }
  }


  private generarMensaje(mensaje:string, icono:SweetAlertIcon){
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

  public volver(){
    this.route.navigate(["/administrativos"])
  }

}
