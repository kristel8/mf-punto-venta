import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileCommerceListComponent } from './profile-commerce-list/profile-commerce-list.component';
import { ProfileCommerceCreateComponent } from './profile-commerce-create/profile-commerce-create.component';
import { ProfileCommerceEditComponent } from './profile-commerce-edit/profile-commerce-edit.component';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { NgMultiSelectDropDownModule } from 'src/app/shared/components/ng-multiselect-dropdown/src';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ProfileCommerceListComponent,
    ProfileCommerceCreateComponent,
    ProfileCommerceEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MaterialModule,
    NgMultiSelectDropDownModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProfileCommerceModule { }
