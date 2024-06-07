import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Administrativo } from 'src/app/interface/administrativo.interface';
import { Docente } from 'src/app/interface/docente.interface';
import { Estudiante } from 'src/app/interface/estudiante.interface';
import { Login } from 'src/app/interface/login.interface';
import { LoginService } from 'src/app/services/login.service';
import { MensajesErrorConstantes } from 'src/app/shared/mensajesError.constants';
import { UserRoles } from 'src/app/shared/user.enum';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  formLogin = new FormGroup({
    'codigo': new FormControl('', Validators.required),
    'cedula': new FormControl('', Validators.required)
  })

  ngOnInit(): void {
    this.spinner.show()
  }

  ngAfterViewInit(): void{
    this.spinner.hide()
  }

  constructor(private  loginService:LoginService, private router:Router, private spinner:NgxSpinnerService){}

  get codigo(){
    return this.formLogin.get('codigo');
  }

  get cedula(){
    return this.formLogin.get('cedula');
  }

  public loginUsuario(){
    const codigoValue = this.codigo?.value;
    const cedulaValue = this.cedula?.value;
    if(codigoValue && cedulaValue){
      this.spinner.show();
      this.loginService.loginUsuario(codigoValue, cedulaValue).subscribe({
        next: (v) => {
          if(v.estado === 'OK'){
            const login:Login = v.data as Login;
            console.log(login.rol)
            switch(login.rol){
              case UserRoles.ESTUDIANTE:
                const estudiante:Estudiante = login.data as Estudiante;
                if(estudiante.cedulaEstudiante && estudiante.codigoEstudiante){
                  this.crearSession(estudiante.cedulaEstudiante, estudiante.codigoEstudiante,  UserRoles.ESTUDIANTE);
                  this.router.navigate(["/estudiantes"]);
                }
                break;
              case UserRoles.DOCENTE:
                const docente:Docente = login.data as Docente;
                if(docente.cedulaDocente && docente.codigoDocente){
                  this.crearSession(docente.cedulaDocente, docente.codigoDocente,  UserRoles.DOCENTE);
                  this.router.navigate(["/docentes"]);
                }
              break;
              case UserRoles.ADMINISTRATIVO:
                const administrativo:Administrativo = login.data as Administrativo;
                if(administrativo.cedulaAdministrativo && administrativo.codigoAdministrativo){
                  this.crearSession(administrativo.cedulaAdministrativo, administrativo.codigoAdministrativo,  UserRoles.ADMINISTRATIVO);
                  this.router.navigate(["/administrativos"]);
                }
              break;
              default:
                this.generarAlerta(MensajesErrorConstantes.ERROR_GENERAL);
                break;
            }
          }
        },
        error: () => {
          this.generarAlerta(MensajesErrorConstantes.ERROR_FORMULARIO_LOGIN);
          this.spinner.hide()
        },
        complete: () => {
          this.spinner.hide()
        }
      })
    }else{
      this.generarAlerta(MensajesErrorConstantes.ERROR_GENERAL);
    }
  }

  private generarAlerta(textoAlerta:string){
    Swal.fire({
      text:textoAlerta,
      icon:"error"
    })
  }

  private crearSession(cedula:string, codigo:string, rol:string){
    sessionStorage.setItem('codigo', codigo);
    sessionStorage.setItem('cedula',cedula);
    sessionStorage.setItem('rol', rol);
  }

}
