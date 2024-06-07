import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { InspeccionarNotasComponent } from './components/inspeccionar-notas/inspeccionar-notas.component';

const routes: Routes = [
  {
    path: '',
    component: InicioComponent
  },
  {
    path: 'asignarNotas',
    component:InspeccionarNotasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocenteRoutingModule { }
