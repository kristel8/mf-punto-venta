import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotasCommerceListComponent } from './quotas-commerce-list/quotas-commerce-list.component';
import { QuotasCommerceCreateComponent } from './quotas-commerce-create/quotas-commerce-create.component';
import { QuotasCommerceEditComponent } from './quotas-commerce-edit/quotas-commerce-edit.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { QuotasCommerceUpdateComponent } from './quotas-commerce-edit/quotas-commerce-update/quotas-commerce-update.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'src/app/shared/components/ng-multiselect-dropdown/src';



@NgModule({
  declarations: [
    QuotasCommerceListComponent,
    QuotasCommerceCreateComponent,
    QuotasCommerceEditComponent,
    QuotasCommerceUpdateComponent
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
export class QuotasCommerceModule { }
