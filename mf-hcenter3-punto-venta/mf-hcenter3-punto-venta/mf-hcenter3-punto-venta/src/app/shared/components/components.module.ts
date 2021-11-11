import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamictableComponent } from './dynamictable/dynamictable.component';
import { PopupManageColumnsComponent } from './popup-manage-columns/popup-manage-columns.component';
import { PopupLinkComponent } from './popup-link/popup-link.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PopupComponent } from './popup/popup.component';
import { PopupCommentComponent } from './popup-comment/popup-comment.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DragDropModule} from '@angular/cdk/drag-drop';
import { PopupListComponent } from './popup-list/popup-list.component';
import { PopupRolComponent } from './popup-rol/popup-rol.component';



@NgModule({
  declarations: [
    DynamictableComponent,
    PopupManageColumnsComponent,
    PopupCommentComponent,
    PopupComponent,
    PopupListComponent,
    PopupLinkComponent,
    PopupRolComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    DragDropModule
  ],
  exports: [
    DynamictableComponent,
    PopupCommentComponent,
    PopupManageColumnsComponent,
    PopupComponent,
    PopupLinkComponent,
    PopupRolComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class ComponentsModule { }
