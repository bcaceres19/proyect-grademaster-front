import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import { EstudianteRoutingModule } from './estudiante-routing.module';
import { InicioEstudianteComponent } from './pages/inicio-estudiante/inicio-estudiante.component';
import { BottomSheetComponent } from './components/bottom-sheet/bottom-sheet.component';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet'
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
@NgModule({
  declarations: [
    InicioEstudianteComponent,
    BottomSheetComponent
  ],
  imports: [
    CommonModule,
    EstudianteRoutingModule,
    MatTabsModule,
    MatTableModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatListModule
  ]
})
export class EstudianteModule { }
