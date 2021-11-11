import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TerminalListComponent } from './terminal-list/terminal-list.component';
import { TerminalCreateComponent } from './terminal-create/terminal-create.component';
import { TerminalEditComponent } from './terminal-edit/terminal-edit.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TerminalListComponent,
    TerminalCreateComponent,
    TerminalEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MaterialModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TerminalModule { }
