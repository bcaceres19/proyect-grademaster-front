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
import { Router } from '@angular/router';
import { MateriasHoras } from '../../interface/materiasHoras.interface';
import { catchError, map, switchMap, tap } from 'rxjs';
import { GenerarNuevoCorte } from '../../interface/generarNuevoCorte.interface';

@Component({
  selector: 'app-inspeccionar-notas',
  templateUrl: './inspeccionar-notas.component.html',
  styleUrls: ['./inspeccionar-notas.component.css'],
})
export class InspeccionarNotasComponent {
  public agregraNotas: boolean = false;

  public dataSource = new MatTableDataSource<Estudiante>();

  public dataSourceCrearNotas = new MatTableDataSource<Notas>([]);

  public codigoMateriaSelec: string = '';

  private codigoDocente: string = '';

  private codigoSemestre: string = '';

  public cantidadCreditos:string = '';

  public horaInicio:string = '';

  public horaFin:string = '';

  public corteSelect:number = 0;

  public nombreColumnas: string[] = [
    'codigo',
    'nombres',
    'apellidos',
    'acciones',
  ];

  public nombreColumnasCrearNotas: string[] = [
    'codigo',
    'porcentaje',
    'acciones',
  ];

  public formNotas = new FormGroup({
    notas: new FormArray([]),
  });

  public formSelects = new FormGroup({
    selectMaterias: new FormControl(''),
    selectCortes: new FormControl('')
  })

  get selectMaterias(){
    return this.formSelects.get('selectMaterias') as FormControl
  }

  get selectCortes(){
    return this.formSelects.get('selectCortes') as FormControl
  }

  get notas() {
    return this.formNotas.get('notas') as FormArray;
  }

  public materiasAsignadas: MateriasHoras[] = [];

  public cortes:string[] = [
    '1',
    '2',
    '3'
  ]

  constructor(
    private docenteService: DocenteService,
    private notaService: NotaService,
    private spinner: NgxSpinnerService,
    private route:Router,
    private matDialog: MatDialog,
    private semestreService: SemestreService
  ) {}

  public addNota() {
    const notasVacias: Notas[] = this.dataSourceCrearNotas.data;
    const formNota = new FormGroup({
      codigo: new FormControl(''),
      porcentaje: new FormControl(''),
    });
    this.spinner.show();
    this.notaService.generarCodigo().subscribe({
      next: (v: RespuestaGeneral) => {
        formNota.get('codigo')?.setValue(String(v.data));
      },
      error: (e) => {
        console.error(e);
      },
      complete: () => {
        formNota.get('codigo')?.disable();
        this.notas.push(formNota);
        notasVacias.push({
          indice: notasVacias.length,
        });
        this.dataSourceCrearNotas = new MatTableDataSource<Notas>(
          notasVacias as Notas[]
        );
        this.spinner.hide();
      },
    });
  }

  public eliminarNota(indice: number) {
    this.spinner.show();

    // Filtrar las notas eliminadas
    const notasAgreg: Notas[] = this.dataSourceCrearNotas.data;
    const notasElim: Notas[] = notasAgreg.filter(
      (notaD) => notaD.indice !== indice
    );

    // Actualizar el dataSource de la tabla
    this.dataSourceCrearNotas = new MatTableDataSource<Notas>(notasElim);
    this.spinner.hide();
  }

  public guardarNotas() {
    this.spinner.show();
    const notasAgreg: Notas[] = this.dataSourceCrearNotas.data;
    const notasSave: CrearNota[] = [];
    let numeroNota: number = 1;
    for (const nota of notasAgreg) {
      if (nota.indice !== undefined) {
        const contenidoNotas = this.notas.controls[nota.indice];
        const notaSave: CrearNota = {
          codigoNota: contenidoNotas.get('codigo')?.value,
          porcentajeNota: contenidoNotas.get('porcentaje')?.value,
          nrNota: numeroNota,
          materiaEntityFk: {
            codigo: this.codigoMateriaSelec,
          },
          docenteEntityFk: {
            codigoDocente: this.codigoDocente,
          },
        };
        notasSave.push(notaSave);
        numeroNota++;
      }
    }
    this.notaService.guaradarNotas(notasSave).subscribe({
      next: (v) => {},
      error: (e) => {
        console.error(e);
        this.spinner.hide();
      },
      complete: () => {
        this.generarMensaje(
          'Se agregaron las notas de la materia correctamente',
          'success',
          true,false
        );
        this.getAllEstudiantesMateria();
      },
    });
  }

  public seleccionarMater(codigo: string) {
    this.codigoMateriaSelec = codigo;
  }

  ngOnInit(): void {
    this.spinner.show();
    const codigoDocente: string | null = sessionStorage?.getItem('codigo');
    this.codigoDocente = codigoDocente as string;
    this.getUltimoSemestre()
    .pipe(
      switchMap(() => this.getAllMateriasDocente()),
      switchMap(() => this.checkNotasExistencia()),
      switchMap(existenNotas => existenNotas ? this.getAllEstudiantesDocenteMateria() : []),
      switchMap(() => this.getUltimoCorteMateria())
    )
    .subscribe({
      complete: () => {
        this.agregraNotas = true;
        this.spinner.hide();
      },
      error: (e) => {
        console.error(e);
        this.spinner.hide();
      }
    });
  }

  getUltimoSemestre() {
    return this.semestreService.getUltimoSemestre().pipe(
      tap((v: RespuestaGeneral) => {
        this.codigoSemestre = (v.data as Semestre).codigoSemestre!;
      }),
      catchError(e => {
        console.error(e);
        return [];
      })
    );
  }
  
  getAllMateriasDocente() {
    return this.docenteService.getAllMateriasDocente(this.codigoDocente).pipe(
      tap((v: RespuestaGeneral) => {
        this.materiasAsignadas = v.data as MateriasHoras[];
        if (this.materiasAsignadas.length !== 0) {
          const materiaSelec: MateriasHoras = this.materiasAsignadas[0];
          this.selectMaterias.setValue(materiaSelec.nombre);
          this.codigoMateriaSelec = materiaSelec.codigo;
          this.cantidadCreditos = materiaSelec.nrCreditos;
          this.horaInicio = String(materiaSelec.horaInicio);
          this.horaFin = String(materiaSelec.horaFin);
        } else {
          this.spinner.hide();
          this.generarMensaje('El docente no tiene materias para notas, espera al que el administrador te coloque una materia', "info", false, true);
        }
      }),
      catchError(e => {
        console.error(e);
        return [];
      })
    );
  }
  
  checkNotasExistencia() {
    return this.notaService.existenciaNotas(this.codigoDocente, this.codigoMateriaSelec).pipe(
      map((v: RespuestaGeneral) => v.data as Boolean),
      catchError(e => {
        console.error(e);
        return [false];
      })
    );
  }
  
  getAllEstudiantesDocenteMateria() {
    return this.docenteService.getAllEstudiantesDocenteMateria(this.codigoDocente, this.codigoMateriaSelec).pipe(
      tap((v: RespuestaGeneral) => {
        this.dataSource = new MatTableDataSource<Estudiante>(v.data as Estudiante[]);
      }),
      catchError(e => {
        console.error(e);
        return [];
      })
    );
  }
  
  getUltimoCorteMateria() {
    return this.notaService.ultimoCorteMateria(this.codigoMateriaSelec).pipe(
      tap((v: RespuestaGeneral) => {
        this.selectCortes.setValue(String(v.data));
        this.corteSelect = Number(v.data)
      }),
      catchError(e => {
        console.error(e);
        return [];
      })
    );
  }

  public seleccionarCorte(){
    
    if(this.corteSelect < this.selectCortes.value){
      this.generarMensajeCorte("¿Quieres generar otro corte? Si lo pasas el anterior corte sera inhabilitado", "info")
    }else{

    }

  }

  private getAllEstudiantesMateria() {
    this.spinner.show();
    this.docenteService
      .getAllEstudiantesDocenteMateria(
        this.codigoDocente,
        this.codigoMateriaSelec
      )
      .subscribe({
        next: (v: RespuestaGeneral) => {
          this.dataSource = new MatTableDataSource<Estudiante>(
            v.data as Estudiante[]
          );
        },
        error: (e) => {
          console.error(e);
        },
        complete: () => {
          this.agregraNotas = true;
          this.spinner.hide();
        },
      });
  }

  private generarMensajeCorte(
    mensaje: string,
    icono: SweetAlertIcon
  ){
    Swal.fire({
      text: mensaje,
      icon: icono,
      showCancelButton: true,
      allowOutsideClick: false
    }).then((resultado) => {
      if(resultado.isConfirmed){
        this.spinner.show()
        const nuevoCorte:GenerarNuevoCorte = {
          codigoMateria: this.codigoMateriaSelec,
          numeroCorteNuevo: this.selectCortes.value
        }
        this.notaService.generarNuevoCorte(nuevoCorte).subscribe({
          next: (v:RespuestaGeneral) => {},
          error: (e) => {
            console.error(e);
            this.spinner.hide()
          },
          complete: () => {
            this.spinner.hide()
          }
        })
      }else if(resultado.dismiss?.toString() === 'cancel'){
        this.selectCortes.setValue(this.corteSelect)
      }
    })
  }

  private generarMensaje(
    mensaje: string,
    icono: SweetAlertIcon,
    abrirAsignarNotas: boolean,
    pasarPantalla: boolean
  ) {
    Swal.fire({
      text: mensaje,
      icon: icono,
      showCancelButton: false,
    }).then((resultado) => {
      if (
        (resultado.isConfirmed || resultado.isDismissed) &&
        abrirAsignarNotas
      ) {
        this.agregraNotas = abrirAsignarNotas;
      }
      if(pasarPantalla){
        this.route.navigate(['/docentes'])  
      }
    });
  }

  public abrirDialogo(codigoEstudiante: string) {
    this.matDialog
      .open(DialogoComponent, {
        data: {
          titulo: 'Registrar Notas Estudiante',
          tipoVentana: 'NOTAS_ESTUDIANTE',
          data: codigoEstudiante,
          listData: [this.codigoDocente, this.codigoMateriaSelec, this.selectCortes.value],
        },
      })
      .beforeClosed()
      .subscribe((resultado) => {
        if (resultado) {
          let notas: Notas[] = resultado;
          let notaMaterias: NotaMateria[] = [];
          this.spinner.show();
          for (const nota of notas) {
            let notaMateria: NotaMateria = {
              codigoEstudianteEntityFk: {
                codigoEstudiante: codigoEstudiante,
              },
              codigoMateriaEntityFk: {
                codigo: this.codigoMateriaSelec,
              },
              codigoSemestreEntityFk: {
                codigoSemestre: this.codigoSemestre,
              },
              codigoNotaEntityFk: {
                codigoNota: nota.codigo,
              },
              valorNota: nota.valorNota,
            };
            notaMaterias.push(notaMateria);
          }
          this.notaService.guardarNotasEstudiante(notaMaterias).subscribe({
            next: (v: RespuestaGeneral) => {},
            error: (e) => {
              console.error(e);
              this.spinner.hide();
            },
            complete: () => {
              this.generarMensaje(
                'Se asignaron correctamente las notas',
                'success',
                false,false
              );
              this.spinner.hide();
            },
          });
        }
      });
  }
}
