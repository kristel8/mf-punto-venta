import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Role } from '../../entities/role';
import { UtilsConstant } from '../../entities/utils-constant';
import { TokenStorageService } from '../../services/token-storage.service';


@Component({
  selector: 'app-popup',
  templateUrl: './popup-comment.component.html',
  styleUrls: ['./popup-comment.component.scss']
})
export class PopupCommentComponent implements OnInit {

  comment:string = "";

  title: string;
  body: string;
  returnValue: any;
  module: any;
  typeProccess: number;
  writeOnlyComment:boolean = true;
  deleteMany:boolean = false;
  selections: any[];
  appList:any[] = [];
  selectApp:string = "";
  isAppEraseFlag:boolean = false;
  isApprovalFlow:boolean = false;

  defineContanst = UtilsConstant;

  constructor(
    public dialogRef: MatDialogRef<PopupCommentComponent>,
    private tokenUser:TokenStorageService) { }

  ngOnInit() {

    this.isAppEraseFlag = false;

    this.appList = JSON.parse(localStorage.getItem("apps"));

    let appUserRol:string = (Array.from(this.tokenUser.getUser()["listRols"]) as Role[])[0].application;

    if(appUserRol != '0')
      this.appList = this.appList.filter((item)=>item.capApplicationID.trim() == appUserRol);
  }

  onNoClick(): void {
    this.dialogRef.close(true);
  }

  callBack(): void {
    if(this.isAppErase() && this.writeOnlyComment){
      this.isAppEraseFlag = true;
    } else {
      if(this.writeOnlyComment && !this.deleteMany){
        this.module.sendToRequest(this.comment, this.typeProccess, this.selectApp);
      } else {
        this.module.sendManyToRequest(this.comment, this.typeProccess, this.selectApp, this.selections);
      }
      this.dialogRef.close();
    }
  }

  isAppErase():boolean{
    return this.selectApp.trim() == '' && !this.isApprovalFlow ? true : false;
  }
}
