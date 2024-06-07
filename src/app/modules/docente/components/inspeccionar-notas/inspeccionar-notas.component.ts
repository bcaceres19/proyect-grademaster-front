import { Component } from '@angular/core';
import { DocenteService } from '../../services/docente.service';
import { MatTableDataSource } from '@angular/material/table';
import { Estudiante } from '../../interface/estudiante.interface';
import { RespuestaGeneral } from 'src/app/interface/respuesta-general.interface';
import { Materia } from 'src/app/modules/administrativo/interface/materia.interface';
import { Notas } from '../../interface/notas.interface';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { NotaService } from '../../services/nota.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CrearNota } from '../../interface/crearNota.interface';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { DialogoComponent } from 'src/app/components/dialogo/dialogo.component';
import { NotaMateria } from '../../interface/notaMateria.interface';
import { SemestreService } from 'src/app/modules/administrativo/services/semestre.service';
import { Semestre } from 'src/app/modules/administrativo/interface/semestre.interface';

@Component({
  selector: 'app-inspeccionar-notas',
  templateUrl: './inspeccionar-notas.component.html',
  styleUrls: ['./inspeccionar-notas.component.css']
})
export class InspeccionarNotasComponent {

  public agregraNotas:boolean = false;

  public dataSource = new MatTableDataSource<Estudiante>();

  public dataSourceCrearNotas = new MatTableDataSource<Notas>([]);

  public codigoMateriaSelec:string  = "";

  private codigoDocente:string = "";

  private codigoSemestre:string = "";

  public nombreColumnas:string[] = [
    'codigo',
    'nombres',
    'apellidos',
    'acciones'
  ]

  public nombreColumnasCrearNotas:string[] = [
    'codigo',
    'porcentaje',
    'acciones'
  ]

  public formNotas = new FormGroup({
    'notas': new FormArray([])
  })

  get notas(){
    return this.formNotas.get('notas') as FormArray;
  }

  public materiasAsignadas:Materia[] = []

  constructor(private docenteService:DocenteService,
    private notaService:NotaService,
    private spinner:NgxSpinnerService,
    private matDialog:MatDialog,
    private semestreService:SemestreService
  ){}

  public addNota(){
    const notasVacias:Notas[] = this.dataSourceCrearNotas.data;
    const formNota = new FormGroup({
      'codigo': new FormControl(''),
      'porcentaje': new FormControl('')
    })
    this.spinner.show()
    this.notaService.generarCodigo().subscribe({
      next:(v:RespuestaGeneral) => {
        formNota.get('codigo')?.setValue(String(v.data));
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {
        formNota.get('codigo')?.disable()
        this.notas.push(formNota);
        notasVacias.push({
          indice:notasVacias.length
        })
        this.dataSourceCrearNotas = new MatTableDataSource<Notas>(notasVacias as Notas[])
        this.spinner.hide()
      }
    })
  }

  public eliminarNota(indice:number){
    this.spinner.show();

    // Filtrar las notas eliminadas
    const notasAgreg: Notas[] = this.dataSourceCrearNotas.data;
    const notasElim: Notas[] = notasAgreg.filter(notaD => notaD.indice !== indice);

    // Actualizar el dataSource de la tabla
    this.dataSourceCrearNotas = new MatTableDataSource<Notas>(notasElim);
    this.spinner.hide();
  }

  public guardarNotas(){
    this.spinner.show()
    const notasAgreg:Notas[] = this.dataSourceCrearNotas.data;
    const notasSave:CrearNota[] = [];
    let numeroNota:number = 1;
    for(const nota of notasAgreg){
      if(nota.indice !== undefined){
        const contenidoNotas = this.notas.controls[nota.indice]
        const notaSave:CrearNota = {
            codigoNota: contenidoNotas.get('codigo')?.value,
            porcentajeNota: contenidoNotas.get('porcentaje')?.value,
            nrNota: numeroNota,
            materiaEntityFk: {
              codigo: this.codigoMateriaSelec
            },
            docenteEntityFk: {
              codigoDocente:this.codigoDocente
            }
        }
        notasSave.push(notaSave)
        numeroNota++
      }
    }
    this.notaService.guaradarNotas(notasSave).subscribe({
      next:(v)=>{},
      error:(e)=> {
        console.error(e);
        this.spinner.hide()
      },
      complete:()=> {
        this.generarMensaje("Se agregaron las notas de la materia correctamente", "success", true)
        this.getAllEstudiantesMateria()
      }
    })    
  }
  
  public seleccionarMater(codigo:string){
    this.codigoMateriaSelec = codigo;
  }

  ngOnInit(): void {
    this.spinner.show()
    const codigoDocente:string | null = sessionStorage?.getItem("codigo")
    this.codigoDocente = codigoDocente as string; 
    this.semestreService.getUltimoSemestre().subscribe({
      next: (v:RespuestaGeneral) => {
          this.codigoSemestre = (v.data as Semestre).codigoSemestre!
      },
      complete:() => {
        if(codigoDocente != null){
          this.docenteService.getAllMateriasDocente(codigoDocente).subscribe({
            next:(v:RespuestaGeneral) => {
              this.materiasAsignadas = v.data as Materia[]
            },
            error: (e) => {
              console.error(e);
            },complete:() => {
              this.codigoMateriaSelec = this.materiasAsignadas[0].codigo as string
              let existenNotas:Boolean = false;
              this.notaService.existenciaNotas(this.codigoDocente, this.codigoMateriaSelec).subscribe({
                next: (v: RespuestaGeneral) => {
                  existenNotas = v.data as Boolean;
                },
                error:(e) =>{
                  console.error(e);
                },
                complete:() =>{
                  if(existenNotas){
                    this.docenteService.getAllEstudiantesDocenteMateria(codigoDocente, this.codigoMateriaSelec).subscribe({
                      next:(v:RespuestaGeneral) => {
                        this.dataSource = new MatTableDataSource<Estudiante>(v.data as Estudiante[])
                      },
                      error:(e)=>{
                        console.error(e);
                      },
                      complete: () => {
                        this.agregraNotas = true;
                        this.spinner.hide()
                      }
                    })  
                  }else{
                    this.spinner.hide()
                    this.generarMensaje("El docente no tiene notas disponibles para esta materia, se abrira una zona para diligenciar las respectivas notas", "info", false)
                  }
                }
              })
          }
          })
        }
      }
    })
    
  }

  private getAllEstudiantesMateria(){
    this.spinner.show()
    this.docenteService.getAllEstudiantesDocenteMateria(this.codigoDocente, this.codigoMateriaSelec).subscribe({
      next:(v:RespuestaGeneral) => {
        this.dataSource = new MatTableDataSource<Estudiante>(v.data as Estudiante[])
      },
      error:(e)=>{
        console.error(e);
      },
      complete: () => {
        this.agregraNotas = true;
        this.spinner.hide()
      }
    })  
  }

  private generarMensaje(mensaje:string, icono:SweetAlertIcon, abrirAsignarNotas:boolean){
    Swal.fire({
      text: mensaje,
      icon: icono,
      showCancelButton: false
    }).then((resultado) => {
      if((resultado.isConfirmed || resultado.isDismissed) && abrirAsignarNotas){
        this.agregraNotas = abrirAsignarNotas;
      }
    });
  }

  public abrirDialogo(codigoEstudiante:string){
    this.matDialog.open(DialogoComponent, {
      data:{
        titulo: "Registrar Notas Estudiante",
        tipoVentana: "NOTAS_ESTUDIANTE",
        data: codigoEstudiante,
        listData: [
          this.codigoDocente,
          this.codigoMateriaSelec
        ]
      }
    }).beforeClosed().subscribe((resultado) => {
        if(resultado){
          let notas:Notas[] = resultado;
          let notaMaterias:NotaMateria[] = [];
          this.spinner.show()
          for(const nota of notas){
            let notaMateria:NotaMateria = {
              codigoEstudianteEntityFk: {
                codigoEstudiante: codigoEstudiante
              },
              codigoMateriaEntityFk:{
                codigo: this.codigoMateriaSelec
              },
              codigoSemestreEntityFk: {
                codigoSemestre: this.codigoSemestre
              },
              codigoNotaEntityFk:{
                codigoNota:nota.codigo
              },
              valorNota: nota.valorNota
            }
            notaMaterias.push(notaMateria);
          }
          this.notaService.guardarNotasEstudiante(notaMaterias).subscribe({
            next:(v: RespuestaGeneral) => {},
            error:(e) => {
              console.error(e)
              this.spinner.hide()
            },
            complete:() => {
              this.generarMensaje("Se asignaron correctamente las notas", "success", false)
              this.spinner.hide()
            }
          })
        }
      
    })
  }

}
