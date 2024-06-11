import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { DataDilaog } from 'src/app/interface/DataDialog.interface';

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrls: ['./bottom-sheet.component.css']
})
export class BottomSheetComponent {
  constructor(private _bottomSheetRef: MatBottomSheetRef<BottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data:DataDilaog
  ) {}

  public textoBotones:string[] = []

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.textoBotones = this.data.listData as string[];
  }

  onEvent(event: MouseEvent, contenido:string): void {
    switch(contenido){
      case "Corte 1":
        this._bottomSheetRef.dismiss('1');
        break;
      case 'Corte 2':
        this._bottomSheetRef.dismiss('2');
        break;
      case 'Corte 3':
        this._bottomSheetRef.dismiss('3');
        break;
    }
    event.preventDefault();
  }
}
