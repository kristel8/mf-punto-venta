import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChainCommerceListComponent } from './chain-commerce-list/chain-commerce-list.component';
import { ChainCommerceEditComponent } from './chain-commerce-edit/chain-commerce-edit.component';
import { ChainCommerceCreateComponent } from './chain-commerce-create/chain-commerce-create.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'src/app/shared/components/ng-multiselect-dropdown/src';



@NgModule({
  declarations: [
    ChainCommerceListComponent,
    ChainCommerceEditComponent,
    ChainCommerceCreateComponent
  ],
  imports: [
    RouterModule,
    MatIconModule,
    MaterialModule,
    NgMultiSelectDropDownModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule

  ]
})
export class ChainCommerceModule { }
