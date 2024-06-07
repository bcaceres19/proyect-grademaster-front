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

  onEvent(event: MouseEvent): void {
    this._bottomSheetRef.dismiss(true);
    event.preventDefault();
  }
}
