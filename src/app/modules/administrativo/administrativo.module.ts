import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrativoRoutingModule } from './administrativo-routing.module';
import { CrearEstudianteComponent } from './components/crear-estudiante/crear-estudiante.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {CloudinaryModule} from '@cloudinary/ng';
import { MatSelectModule } from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';

import { CrearDocenteComponent } from './components/crear-docente/crear-docente.component';
import { CrearCarreraComponent } from './components/crear-carrera/crear-carrera.component';
import { CrearMateriaComponent } from './components/crear-materia/crear-materia.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BuscarDocenteComponent } from './components/buscar-docente/buscar-docente.component';
import { VistaTarjetaComponent } from './components/vista-tarjeta/vista-tarjeta.component';


@NgModule({
    declarations: [
        CrearEstudianteComponent,
        InicioComponent,
        CrearDocenteComponent,
        CrearCarreraComponent,
        CrearMateriaComponent,
        BuscarDocenteComponent,
        VistaTarjetaComponent
    ],
    imports: [
        CommonModule,
        AdministrativoRoutingModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        CloudinaryModule,
        MatSelectModule,
        MatTableModule,
        MatPaginatorModule,
        MatTabsModule,
        MatDialogModule
    ]
})
export class AdministrativoModule { }
