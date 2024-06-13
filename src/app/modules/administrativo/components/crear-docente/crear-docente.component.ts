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
import { MensajesErrorConstantes } from 'src/app/shared/mensajesError.constants';
import { MensajesOk } from 'src/app/shared/mensajesOk.constants';

@Component({
  selector: 'app-crear-docente',
  templateUrl: './crear-docente.component.html',
  styleUrls: ['./crear-docente.component.css']
})
export class CrearDocenteComponent {


  @ViewChild(FormGroupDirective) formRef!: FormGroupDirective;

  estados:Estado[] = [];

  generos:Genero[] = [];

  public file:File[] = [];

  formCrearDocente:FormGroup = new FormGroup({
    'nombres': new FormControl('', Validators.required),
    'apellidos': new FormControl('', Validators.required),
    'codigoDocente': new FormControl('', [Validators.required,Validators.minLength(1)]),
    'edad': new FormControl('',[ Validators.required, Validators.minLength(1), Validators.maxLength(2)]),
    'telefono': new FormControl('', [Validators.required, Validators.maxLength(10)]),
    'correoPersonal': new FormControl('', [Validators.required, Validators.email]),
    'correoDocente': new FormControl('', [Validators.required, Validators.minLength(1)]),
    'genero': new FormControl('', Validators.required),
    'estado': new FormControl('', Validators.required),
    'cedula': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
    'imagen': new FormControl('', Validators.required)
  });

  public mensajesError = MensajesErrorConstantes;

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
        this.generarMensaje(this.mensajesError.ERROR_GENERAL,"error");
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
                this.generarMensaje(this.mensajesError.ERROR_GENERAL,"error");
              },
              complete: () => {
                this.spinner.hide()
                this.generarMensajeCrear(MensajesOk.MENSAJE_CONFIRMACION_DOCENTE, "success")
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

  public generarCodigo(){
    this.spinner.show()
    this.docenteService.generarCodigo(this.generarDocente()).subscribe({
      next: (v) => {
        const contenido:string = String(v.data);
        if(contenido === 'ERROR'){
          this.spinner.hide()
          this.generarMensaje(this.mensajesError.ERROR_CODIGO_EXISTENTE, "error");
        }else{
          this.codigoDocente?.setValue(v.data + "");
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

  public generarCorreo(){
    this.spinner.show()
    this.docenteService.generarCorreo(this.generarDocente()).subscribe({
      next: (v) => {
        this.correoDocente?.setValue(v.data+"");
      },error: (e) => {
        console.log(e)
        this.spinner.hide()
        this.generarMensaje(this.mensajesError.ERROR_GENERAL,"error");
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
