import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ProformaDashComponent } from './proforma-dash/proforma-dash.component';
import { HistoricoComponent } from './historico/historico.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'cotizacion', component: ProformaDashComponent },
  { path: 'historico', component: HistoricoComponent },
];
