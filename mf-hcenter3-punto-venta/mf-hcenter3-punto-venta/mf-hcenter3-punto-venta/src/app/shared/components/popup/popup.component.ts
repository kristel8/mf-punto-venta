import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Utils } from '../../entities/utils';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  title: string;
  body: string;
  service: any;
  function: any;
  parameter: any;
  returnValue: any;
  call:any;

  isEraseSelectDelete: boolean = false;

  message: string = '';

  showCharge = false;
  showError = false;
  aceptarInVacio = false;

  notCallService: boolean;

  constructor(
    public utils: Utils,
    public dialogRef: MatDialogRef<PopupComponent>) { }

  ngOnInit() {
    // this.dialogRef._containerInstance._config.data.title;
    // this.dialogRef._containerInstance._config.data.body;

    //NOTA: Esto es una variacion al momento de eliminar y no se a indicado registro a eliminar.
    if (this.isEraseSelectDelete == true) { this.showCharge = false; this.showError = true; this.aceptarInVacio = true; }
  }

  onNoClick(): void {
    console.log('close');
    this.dialogRef.close(this.returnValue);
  }

  callBack(): void {
    this.message = '';
    if(!this.call){
      if (this.service != undefined && this.function != undefined && this.parameter != undefined) {
        this.showCharge = true;
        (this.service[this.function](this.parameter) as Observable<any>).subscribe(
          (success) => {
            this.returnValue = {};
            this.returnValue.status = 200;
            this.returnValue.body = success;
            this.returnValue.parameter = this.parameter;
          },
          (error) => {
            this.message = error.error['message'];
            this.showCharge = false;
            this.showError = true;
            this.utils.alertDanger(error);
          },
          () => { this.dialogRef.close(this.returnValue); this.showCharge = false; this.showError = false; },
        );
      } else if (this.notCallService) {
        this.dialogRef.close(this.notCallService)
      }
    }else{
      console.log("hola");
      this.returnValue = true;
      this.dialogRef.close(this.returnValue); this.showCharge = false; this.showError = false;
    }
  }
}
