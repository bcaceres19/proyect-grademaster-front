import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'docentes',
    component: MenuComponent,
    children: [
      {
        path:'',
        loadChildren: () => import('../app/modules/docente/docente.module').then(m => m.DocenteModule) //Se añade en el modulo principal
      }
    ]
  },
  {
    path: 'estudiantes',
    component: MenuComponent,
    children: [
      {
        path:'',
        loadChildren: () => import('../app/modules/estudiante/estudiante.module').then(m => m.EstudianteModule) //Se añade en el modulo principal
      }
    ]
  },
  {
    path: 'administrativos',
    component: MenuComponent,
    children: [
      {
        path:'',
        loadChildren: () => import('../app/modules/administrativo/administrativo.module').then(m => m.AdministrativoModule) //Se añade en el modulo principal
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
