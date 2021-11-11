import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommerceListComponent } from './commerce-list/commerce-list.component';
import { CommerceEditComponent } from './commerce-edit/commerce-edit.component';
import { CommerceCreateComponent } from './commerce-create/commerce-create.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'src/app/shared/components/ng-multiselect-dropdown/src';



@NgModule({
  declarations: [
    CommerceListComponent,
    CommerceEditComponent,
    CommerceCreateComponent
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
  ],
  })
export class CommerceModule { }
