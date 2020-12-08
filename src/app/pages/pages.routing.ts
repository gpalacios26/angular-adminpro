import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { HospitalesComponent } from './mantenimientos/hospitales/hospitales.component';
import { MedicosComponent } from './mantenimientos/medicos/medicos.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        canActivate: [ AuthGuard ],
        children: [
            { path: '', component: DashboardComponent, data: { titulo: 'Dashboard' } },
            { path: 'main', component: DashboardComponent, data: { titulo: 'Dashboard' } },
            { path: 'progress', component: ProgressComponent, data: { titulo: 'Progress Bar' } },
            { path: 'grafica1', component: Grafica1Component, data: { titulo: 'Gráficas' } },
            { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas' } },
            { path: 'rxjs', component: RxjsComponent, data: { titulo: 'Rxjs' } },
            { path: 'perfil', component: PerfilComponent, data: { titulo: 'Perfil de Usuario' } },
            { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes de Cuenta' } },
            { path: 'usuarios', component: UsuariosComponent, data: { titulo: 'Usuarios' } },
            { path: 'hospitales', component: HospitalesComponent, data: { titulo: 'Hospitales' } },
            { path: 'medicos', component: MedicosComponent, data: { titulo: 'Médicos' } }
        ]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
