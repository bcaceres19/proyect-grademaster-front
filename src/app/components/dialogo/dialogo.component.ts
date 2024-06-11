import { Component, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataDilaog } from 'src/app/interface/DataDialog.interface';
import { EstudianteMateria } from 'src/app/interface/estudianteMateria.interface';
import { MateriaDocente } from 'src/app/interface/materiaDocente.interface';
import { RespuestaGeneral } from 'src/app/interface/respuesta-general.interface';
import { Materia } from 'src/app/modules/administrativo/interface/materia.interface';
import { Notas } from 'src/app/modules/docente/interface/notas.interface';
import { NotasGet } from 'src/app/modules/docente/interface/notasGet.interface';
import { TransversalesService } from 'src/app/services/transversales.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-dialogo',
  templateUrl: './dialogo.component.html',
  styleUrls: ['./dialogo.component.css']
})
export class DialogoComponent {

  public errorCantidad:string = "";

  public cantidad:string = "";

  public errorNota:string = "Se digito un numero mayor a 5, porfavor, cambialo";

  public dataSource = new MatTableDataSource<Materia>();

  public dataSourceAgreg = new MatTableDataSource<Materia>();

  public dataSourceNota = new MatTableDataSource<Object>();

  public formNotas = new FormGroup({})

  public nuevosDatos:boolean = false;

  public nombreColumnas:string[] = [
    'nombre',
    'acciones'
  ]

  public columnasNotas:string[] = []

  constructor(
    public dialogRef:MatDialogRef<DialogoComponent>,
    @Inject(MAT_DIALOG_DATA) public data:DataDilaog,
    private transversalesService:TransversalesService,
    private spinner:NgxSpinnerService
  ){}

  ngOnInit(): void {
    this.spinner.show()
    if(this.data.tipoVentana === "DOCENTE"){
      this.transversalesService.getMateriasDocente(String(this.data.data)).subscribe({
        next: (v:RespuestaGeneral) =>{
          const materiaDocente:MateriaDocente = v.data as MateriaDocente;
          this.dataSource = new MatTableDataSource<Materia>(materiaDocente.materiasNoAsignadas)
          this.dataSourceAgreg = new MatTableDataSource<Materia>(materiaDocente.materiasAsignadas)
        },
        error: (e) =>{
          console.error(e);
          this.spinner.hide()
        },
        complete: () => this.spinner.hide()
      })
    }else if(this.data.tipoVentana === "NOTAS_ESTUDIANTE"){
      console.log(this.data.listData);
      this.transversalesService.allNotasMateriaDocente(String(this.data.listData[0]), String(this.data.listData[1]), String(this.data.data), String(this.data.listData[2])).subscribe({
        next:(v:RespuestaGeneral) =>{
          let nombre:string ="";
          const notas:NotasGet[] = v.data as NotasGet[];
          let totalNotas:number = 0.0;
          for(const nota of notas){
            this.formNotas.addControl(`${nota.nombreCampo}`, new FormControl(nota.valorNota))
            this.formNotas.addControl(`porcentaje-${nota.nombreCampo}`, new FormControl(nota.porcentajeNota))
            this.formNotas.addControl(`codigo-${nota.nombreCampo}`, new FormControl(nota.codigoNota))
            this.columnasNotas.push(`${nota.nombreCampo}`)
            totalNotas+=((nota.valorNota*(nota.porcentajeNota/100)))
          }
          nombre = "Total: 100%"
          this.columnasNotas.push(nombre)
          this.formNotas.addControl(nombre, new FormControl(''))
          this.formNotas.get(nombre)?.setValue(totalNotas)
          this.formNotas.get(nombre)?.disable();
          this.dataSourceNota = new MatTableDataSource<Object>([{}])
        },
        error:(e)=>{
          console.error(e);
          this.spinner.hide()
        },
        complete:()=>{
          this.spinner.hide()
        }
      })
    }else if(this.data.tipoVentana === "ESTUDIANTE"){
      this.transversalesService.getMateriasEstudiante(String(this.data.data['codigoCarrera']),String(this.data.data['codigoEstudiante'])).subscribe({
        next: (v:RespuestaGeneral) => {
          const materiaEstudiante:EstudianteMateria = v.data as EstudianteMateria;
          this.dataSource = new MatTableDataSource<Materia>(materiaEstudiante.materiasNoAsignadas);
          this.dataSourceAgreg = new MatTableDataSource<Materia>(materiaEstudiante.materiasAsignadas);
        },
        error: (e) => {
          console.error(e);
          this.spinner.hide()
        },
        complete: () => this.spinner.hide()
      })
    }else{
      this.spinner.hide()
    }
  }


  public notaTotal(){
    let totalNotas:number = 0.0;
    for(const columna of this.columnasNotas){
        if(columna !== "Total: 100%"){
          const valor:number = this.formNotas.get(columna)?.value!
          if(valor > 5.0){
            this.generarMensaje("Uno de los valores de los campos, es mayor a 5, porfavor, cambialos", "error")
            break;
          }
          const porcentaje:number = this.formNotas.get(`porcentaje-${columna}`)?.value!
          totalNotas+=(valor*(porcentaje/100))
        }else{
          this.formNotas.get(String(columna))?.setValue(totalNotas)
        }
    }
  }

  private generarMensaje(mensaje:string, icono:SweetAlertIcon){
    Swal.fire({
      text: mensaje,
      icon: icono,
      showCancelButton: false
    })
  }

  public onClickOk(): any{
    if(this.data.tipoVentana === "DOCENTE" || this.data.tipoVentana === "ESTUDIANTE"){
      let objeto = {
        nuevo: this.nuevosDatos,
        dataAsig: this.dataSourceAgreg.data,
        dataNoAsig: this.dataSource.data
      }
      return objeto
    }else if(this.data.tipoVentana === "NOTAS_ESTUDIANTE"){
      let notas:Notas[] = []
      for(const columna of this.columnasNotas){
        if(columna !== "Total: 100%"){
          const valor:number = this.formNotas.get(columna)?.value!
          const codigo:string = this.formNotas.get(`codigo-${columna}`)?.value!
          let nota:Notas = {
            codigo:codigo,
            valorNota: valor
          }
          notas.push(nota)
        }
      }
      return notas;
    }
    else{
      return this.cantidad;
    }
  }

  public addMateria(dataAdd:MatTableDataSource<Materia>, 
    dataDelete: MatTableDataSource<Materia>,
     materiaAct:Materia){
    const data = dataAdd.data;
    data.push(materiaAct)
    const deleteData = dataDelete.data.filter(materiaD => materiaD.codigo !== materiaAct.codigo);
    dataAdd.data =data;
    dataDelete.data = deleteData;
    this.nuevosDatos = true;
  }
}