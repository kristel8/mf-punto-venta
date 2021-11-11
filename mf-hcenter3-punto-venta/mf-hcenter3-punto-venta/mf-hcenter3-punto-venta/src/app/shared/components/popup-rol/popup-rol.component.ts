import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs/internal/Observable';
import { RequestUtils } from '../../entities/request-util';
import { User } from '../../entities/user2';

@Component({
  selector: 'app-popup-rol',
  templateUrl: './popup-rol.component.html',
  styleUrls: ['./popup-rol.component.scss']
})
export class PopupRolComponent implements OnInit {
  title: string;
  body: any;
  service: any;
  function: any;
  parameter: any;
  returnValue: any;

  showCharge = false;

  totalMax: number = 5;
  listUserOfRol: User[] = [];
  questionDialog: string;
  constructor(
    public dialogRef: MatDialogRef<PopupRolComponent>,
    private requestUtil: RequestUtils,
    @Inject(MAT_DIALOG_DATA) questionDialog
  ) {
    this.questionDialog = questionDialog.question;
  }

  ngOnInit() {
    // this.dialogRef._containerInstance._config.data.title;
    // this.dialogRef._containerInstance._config.data.body;

    /*
    let user:User = new User();
    user.username = "dato1";
    this.body.listUser.push(user);
    let user2:User = new User();
    user2.username = "dato2";
    this.body.listUser.push(user2);
    let user3:User = new User();
    user3.username = "dato3";
    this.body.listUser.push(user3);

    let user4:User = new User();
    user4.username = "dato4";
    this.body.listUser.push(user4);*/

    this.totalMax =
      this.body.listUser.length > 5 ? 5 : this.body.listUser.length;
    let sentinel: number = 5;
    this.body.listUser.forEach((item) => {
      if (sentinel != 0) {
        sentinel--;
        this.listUserOfRol.push(item);
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close(this.returnValue);
  }

  callBack(): void {
    if (
      this.service != undefined &&
      this.function != undefined &&
      this.parameter != undefined
    ) {
      this.showCharge = true;
      (this.service[this.function](this.parameter) as Observable<
        any
      >).subscribe(
        (success) => {
          this.returnValue = {};
          this.returnValue.status = 200;
          this.returnValue.body = success;
          this.returnValue.parameter = this.parameter;
        },
        (error) => {
          console.log("Eliminar");
          console.log(JSON.stringify(error));

          this.returnValue = error;
        },
        () => {
          this.dialogRef.close(this.returnValue);
          this.showCharge = false;
        }
      );
    }
  }
}
