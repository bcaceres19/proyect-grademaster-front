import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomSheetComponent } from '../../components/bottom-sheet/bottom-sheet.component';

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

  public columnasNotas: string[] = []

  public materias:string[] = [];

  public mostrarNotas:boolean = false;

  constructor(private bottomSheet:MatBottomSheet){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }

  openSheet(){
    this.bottomSheet.open(BottomSheetComponent,{
      data: {
        listData: this.materias
      }
    });
    this.bottomSheet._openedBottomSheetRef?.afterDismissed().subscribe((data) => {
      this.mostrarNotas = data
    })
  }


}
