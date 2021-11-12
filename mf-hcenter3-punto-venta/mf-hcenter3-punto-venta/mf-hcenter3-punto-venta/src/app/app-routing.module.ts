import { APP_BASE_HREF, CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChainCommerceCreateComponent } from './components/chain-commerce/chain-commerce-create/chain-commerce-create.component';
import { ChainCommerceEditComponent } from './components/chain-commerce/chain-commerce-edit/chain-commerce-edit.component';
import { ChainCommerceListComponent } from './components/chain-commerce/chain-commerce-list/chain-commerce-list.component';
import { CommerceCreateComponent } from './components/commerce/commerce-create/commerce-create.component';
import { CommerceEditComponent } from './components/commerce/commerce-edit/commerce-edit.component';
import { CommerceListComponent } from './components/commerce/commerce-list/commerce-list.component';
import { ProfileCommerceCreateComponent } from './components/profile-commerce/profile-commerce-create/profile-commerce-create.component';
import { ProfileCommerceEditComponent } from './components/profile-commerce/profile-commerce-edit/profile-commerce-edit.component';
import { ProfileCommerceListComponent } from './components/profile-commerce/profile-commerce-list/profile-commerce-list.component';
import { QuotasCommerceCreateComponent } from './components/quotas-commerce/quotas-commerce-create/quotas-commerce-create.component';
import { QuotasCommerceEditComponent } from './components/quotas-commerce/quotas-commerce-edit/quotas-commerce-edit.component';
import { QuotasCommerceListComponent } from './components/quotas-commerce/quotas-commerce-list/quotas-commerce-list.component';
import { TerminalCreateComponent } from './components/terminal/terminal-create/terminal-create.component';
import { TerminalEditComponent } from './components/terminal/terminal-edit/terminal-edit.component';
import { TerminalListComponent } from './components/terminal/terminal-list/terminal-list.component';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { ActiveGuardGuard } from './shared/guards/active-guard.guard';

const routes: Routes = [
  { path: 'config-red/perfil-comercio', component: ProfileCommerceListComponent, canActivate: [ActiveGuardGuard]},
  { path: 'config-red/perfil-comercio/crear-perfil', component: ProfileCommerceCreateComponent, canActivate: [ActiveGuardGuard]},
  { path: 'config-red/perfil-comercio/editar-perfil', component: ProfileCommerceEditComponent, canActivate: [ActiveGuardGuard]},
  { path: 'config-red/comercio', component: CommerceListComponent, canActivate: [ActiveGuardGuard]},
  { path: 'config-red/comercio/crear-comercio', component: CommerceCreateComponent, canActivate: [ActiveGuardGuard]},
  { path: 'config-red/comercio/editar-comercio/:cmrMerchantId', component: CommerceEditComponent, canActivate: [ActiveGuardGuard]},
  { path: 'config-red/terminal', component: TerminalListComponent, canActivate: [ActiveGuardGuard]},
  { path: 'config-red/terminal/crear-terminal', component: TerminalCreateComponent, canActivate: [ActiveGuardGuard]},
  { path: 'config-red/terminal/editar-terminal', component: TerminalEditComponent, canActivate: [ActiveGuardGuard]},
  { path: 'config-red/cadena-comercio', component: ChainCommerceListComponent, canActivate: [ActiveGuardGuard]},
  { path: 'config-red/cadena-comercio/crear-cadena', component: ChainCommerceCreateComponent, canActivate: [ActiveGuardGuard]},
  { path: 'config-red/cadena-comercio/editar-cadena', component: ChainCommerceEditComponent, canActivate: [ActiveGuardGuard]},
  { path: 'config-red/cupo-comercio', component: QuotasCommerceListComponent, canActivate: [ActiveGuardGuard]},
  { path: 'config-red/cupo-comercio/crear-cupo', component: QuotasCommerceCreateComponent, canActivate: [ActiveGuardGuard]},
  { path: 'config-red/cupo-comercio/editar-cupo', component: QuotasCommerceEditComponent, canActivate: [ActiveGuardGuard]},
  { path: '**', component: EmptyRouteComponent }

];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),

  ],
  exports: [
    RouterModule
  ],
  providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
})
export class AppRoutingModule { }
