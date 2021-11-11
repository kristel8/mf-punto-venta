import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChainCommerceModule } from './components/chain-commerce/chain-commerce.module';
import { CommerceModule } from './components/commerce/commerce.module';
import { ProfileCommerceModule } from './components/profile-commerce/profile-commerce.module';
import { QuotasCommerceModule } from './components/quotas-commerce/quotas-commerce.module';
import { TerminalModule } from './components/terminal/terminal.module';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { ComponentsModule } from './shared/components/components.module';
import { authInterceptorProviders } from './shared/interceptors/auth-interceptor';
import { tokenInterceptorProviders } from './shared/interceptors/auth.interceptors';
import { MaterialModule } from './shared/material/material.module';

@NgModule({
  declarations: [
    AppComponent,
    EmptyRouteComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    MaterialModule,
    HttpClientModule,
    ComponentsModule,
    ProfileCommerceModule,
    CommerceModule,
    TerminalModule,
    QuotasCommerceModule,
    ChainCommerceModule
  ],
  providers: [
    authInterceptorProviders,
    tokenInterceptorProviders,
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
