import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrearEstudianteComponent } from './components/crear-estudiante/crear-estudiante.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { CrearDocenteComponent } from './components/crear-docente/crear-docente.component';
import { CrearCarreraComponent } from './components/crear-carrera/crear-carrera.component';
import { CrearMateriaComponent } from './components/crear-materia/crear-materia.component';
import { BuscarDocenteComponent } from './components/buscar-docente/buscar-docente.component';
import { BuscarEstudianteComponent } from './components/buscar-estudiante/buscar-estudiante.component';

const routes: Routes = [
  {
    path: '',
    component: InicioComponent
  },
  {
    path: 'crearEstudiante',
    component: CrearEstudianteComponent
  },
  {
    path: 'buscarEstudiante',
    component: BuscarEstudianteComponent
  },
  {
    path: 'crearDocente',
    component:CrearDocenteComponent
  },
  {
    path: 'buscarDocente',
    component:BuscarDocenteComponent
  },
  {
    path: 'crearCarrera',
    component:CrearCarreraComponent
  },
  {
    path: 'crearMateria',
    component: CrearMateriaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrativoRoutingModule { }
