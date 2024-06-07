import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioEstudianteComponent } from './pages/inicio-estudiante/inicio-estudiante.component';

const routes: Routes = [
  {
    path: '',
    component: InicioEstudianteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstudianteRoutingModule { }
