import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from '../../components/bottom-sheet/bottom-sheet.component';
import { MateriasHoras } from 'src/app/modules/docente/interface/materiasHoras.interface';
import { TransversalesService } from 'src/app/services/transversales.service';
import { EstudianteService } from '../../services/estudiante.service';
import { RespuestaGeneral } from 'src/app/interface/respuesta-general.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { NotasSemestreDto } from '../../interface/notasSemestreDto.interface';
import { NotasEstudiante } from '../../interface/notasEstudianteDto.interface';
import { MatTableDataSource } from '@angular/material/table';
import { NotasTablas } from '../../interface/notasTablas.interface';
import { NotaMateria } from 'src/app/modules/docente/interface/notaMateria.interface';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { MensajesErrorConstantes } from 'src/app/shared/mensajesError.constants';

@Component({
  selector: 'app-inicio-estudiante',
  templateUrl: './inicio-estudiante.component.html',
  styleUrls: ['./inicio-estudiante.component.css']
})
export class InicioEstudianteComponent {
  public nombreColumnas: string[] = [
    'corteUno',
    'corteDos',
    'corteTres',
    'notaFinal'
  ];

  public cabeceras:string[] = []

  public cabecerasNotasImg:string[] = []

  public columnasNotas: string[] = []

  public materias:string[] = [];

  public verNotasCortes:boolean = false

  public cortes:string[] = [
    'Corte 1',
    'Corte 2',
    'Corte 3'
  ]

  public cabecerasNotas:string[] = []

  public mostrarNotas:boolean = false;

  public materiasAsignadas: MateriasHoras[] = [];

  public dataSource = new MatTableDataSource<NotasTablas>();

  public mensajesError = MensajesErrorConstantes;

  public dataSourceNotas = new MatTableDataSource<any>();


  public codigoEstudiante!:string;

  public formSelects = new FormGroup({
    selectMaterias: new FormControl('')
  })

  get selectMaterias(){
    return this.formSelects.get('selectMaterias') as FormControl
  }

  constructor(
    private bottomSheet:MatBottomSheet,
    private estudianteService:EstudianteService,
    private spinner:NgxSpinnerService,
  ){}

  ngOnInit(): void {
      this.spinner.show()
      this.codigoEstudiante = sessionStorage.getItem('codigo')!;
      this.estudianteService.getMateriasEstudiantes(this.codigoEstudiante).subscribe({
        next: (v:RespuestaGeneral) =>{ 
          this.materiasAsignadas = v.data as MateriasHoras[]
        },
        error: (e) => {
          console.error(e);
          this.generarMensaje(this.mensajesError.ERROR_GENERAL, "error")
          this.spinner.hide()
        },
        complete: () => {
          this.selectMaterias.setValue(this.materiasAsignadas[0].codigo)
          this.notasCortes(this.materiasAsignadas[0].codigo)
          this.spinner.hide()
        }
      })
  }

  public notasCortes(codigoMateria:string){
    this.spinner.show()
    this.estudianteService.getCortesEstudiante(this.codigoEstudiante, codigoMateria).subscribe({
      next: (v:RespuestaGeneral) => {
        const notaSemestre: NotasSemestreDto = v.data as NotasSemestreDto
        const notasCortes:NotasEstudiante[] =notaSemestre.notasEstudianteDtos
        const notasTablas:NotasTablas[] = []
        for(const infoNotas of notasCortes){
          this.cabeceras.push(`Corte ${infoNotas.numeroCorte} - ${infoNotas.porcentajeCorte}%`); 
          this.cabecerasNotasImg.push(`Proximacion ${infoNotas.numeroCorte} - ${infoNotas.porcentajeCorte}%`)
        }
        const notaTabla:NotasTablas = {
          corteUno: String(notasCortes[0].notaCorte)!,
          corteUnoImg: String(notasCortes[0].notaImaginaria)!,
          corteDos: String(notasCortes[1].notaCorte)!,
          corteDosImg: String(notasCortes[1].notaImaginaria)!,
          corteTres: String(notasCortes[2].notaCorte)!,
          corteTresImg: String(notasCortes[2].notaImaginaria)!,
          notaFinal: String(notaSemestre.notaFinalSemestre),
          notaFinalImg: String(notaSemestre.notaFinalSemestreImaginaria)
        }
        notasTablas.push(notaTabla)
        this.dataSource = new MatTableDataSource<NotasTablas>(notasTablas);
      },
      error: (e) => {
        console.error(e);
        this.generarMensaje(this.mensajesError.ERROR_GENERAL, "error")
        this.spinner.hide()
      },
      complete: () => {
        this.cabeceras.push('Definitiva - 100%')
        this.cabecerasNotasImg.push(`Definitiva - 100%`)
        this.spinner.hide()
      }
    })
  }

  openSheet(){
    this.bottomSheet.open(BottomSheetComponent,{
      data: {
        listData: this.cortes
      }
    });
    this.bottomSheet._openedBottomSheetRef?.afterDismissed().subscribe((data) => {
      this.cabecerasNotas = []
      let existeNota:boolean = true;
      if(data == undefined){
        this.verNotasCortes  = false;
      }else{
        this.spinner.show()
        this.estudianteService.getNotasCortes(Number(data),this.codigoEstudiante, this.selectMaterias.value).subscribe({
          next:(v:RespuestaGeneral) => {
            let index = 1;
            let data:any = {}
            const objeto:NotaMateria[] = v.data as NotaMateria[]
            if(objeto.length === 0){
              this.generarMensaje(this.mensajesError.ERROR_NOTAS_CORTE,'error');
              existeNota = false;
            }else{
              for(const nt of objeto){
                let texto = `Nota ${index} - ${nt.codigoNotaEntityFk?.porcentajeNota}%`;
                index++;
                this.cabecerasNotas.push(texto)
                data[texto] = nt.valorNota
              }
              this.dataSourceNotas = new MatTableDataSource<any>([data])
            }
          },
          error: (e) =>{
             console.error(e)
             this.generarMensaje(this.mensajesError.ERROR_GENERAL, "error")
             this.spinner.hide()
            },
          complete: () => {
            if(existeNota){
              this.verNotasCortes = true;
            }else{
              this.verNotasCortes = false;
            }
            this.spinner.hide()
          }
        })
      }
    })
  }

  private generarMensaje(mensaje:string, icono:SweetAlertIcon){
    Swal.fire({
      text: mensaje,
      icon: icono,
      showCancelButton: false,
      allowOutsideClick: false
    });
  }

}
