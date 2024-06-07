import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocenteRoutingModule } from './docente-routing.module';
import { InicioComponent } from './components/inicio/inicio.component';
import { InspeccionarNotasComponent } from './components/inspeccionar-notas/inspeccionar-notas.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {MatMenuModule} from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    InicioComponent,
    InspeccionarNotasComponent
  ],
  imports: [
    CommonModule,
    DocenteRoutingModule,
    ScrollingModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTabsModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule
  ]
})
export class DocenteModule { }
