import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { InnerComponent } from 'src/app/entidades/inner-component';
import { DynamictableComponent } from 'src/app/shared/components/dynamictable/dynamictable.component';
import { PopupCommentComponent } from 'src/app/shared/components/popup-comment/popup-comment.component';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { Application } from 'src/app/shared/entities/application';
import { Column } from 'src/app/shared/entities/column';
import { ConstantUtils } from 'src/app/shared/entities/constantUtils';
import { MerchantProfile } from 'src/app/shared/entities/merchant-profile';
import { RegisterAudit } from 'src/app/shared/entities/registerAudit';
import { RequestRallied } from 'src/app/shared/entities/request-rallied';
import { RequestUtils } from 'src/app/shared/entities/request-util';
import { RequestApproval } from 'src/app/shared/entities/requestApproval';
import { Role } from 'src/app/shared/entities/role';
import { Utils } from 'src/app/shared/entities/utils';
import { UtilsConstant } from 'src/app/shared/entities/utils-constant';
import { AuditService } from 'src/app/shared/services/audit.service';
import { ProfileMerchantService } from 'src/app/shared/services/profileMerchant.service';
import { RequestApprovalService } from 'src/app/shared/services/request-approval.service';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';
import { Testing } from 'src/app/utilitarios/testing';

@Component({
  selector: 'app-profile-commerce-list',
  templateUrl: './profile-commerce-list.component.html',
  styleUrls: ['./profile-commerce-list.component.scss']
})
export class ProfileCommerceListComponent implements OnInit {



  registerAudit:RegisterAudit;

  isValidAccessLevel:boolean = true;

  isApplicationProccess:boolean = true;
  table: DynamictableComponent;

  styleMatCard: string;
  dataInput: MerchantProfile[];

  // dialog
  animal: string;
  name: string;

  dynamicHeight: number = 0;
  porcentajeFilling: number = 16.25;

  showColumns: Column[];
  menuColumns: Column[];
  componenteDialog: string = this.utils.EDITAR_PERFIL_COMERCIO;
  selectIdValue: string = this.utils.SELECT_CMPPROFILEID;
  checkBox = this.utils.ENABLE_CHECKBOX;
  arrayOfTable = this.utils.ARRAY_OF_TABLE;
  clearFilter = this.utils.DISABLE_CLEAR_FILTER;
  checkBoxColor = this.utils.BLACK_COLOR;
  selectItems = [];
  flagOrderSelectionItems = true;

  requestRallied = new RequestRallied();
  merchantCurrent: MerchantProfile;

  requestRalliedEditar: MerchantProfile[];
  mapMerchantProfileApp: Map<Application, InnerComponent>;

  isEliminationMode: boolean = false;

  constructor(
    public utils: Utils,
    private sanitizer: DomSanitizer,
    private testing: Testing,
    public dialog: MatDialog,
    private profileMerchantService: ProfileMerchantService,
    private reqAppService:RequestApprovalService,
    private tokenStorage: TokenStorageService,
    private auditService: AuditService,
    private requestUtil: RequestUtils,
    private router: Router) {
    this.showColumns = testing.getShowColumnsTestingForMerchantProfile();
    this.menuColumns = testing.getMenuColumnsTestingForMerchantProfile();
    this.name = '';
    this.animal = '';
    this.styleMatCard = '';
  }

  ngOnInit() {
    this.registerAudit = new RegisterAudit( this.auditService, ConstantUtils.MODULE_POINT_OF_SALE_CONF, ConstantUtils.MODOPTION_MERCHANT_PROFILE, this.tokenStorage.getFullNameByUser(), "0", ConstantUtils.AUDIT_OPTION_TYPE_DELETE);

    this.isValidAccessLevel = this.utils.validAccessLevelDelete('mantenimientomc', 'prototipo2');
    //this.validAccessLevel();
    this.setHeight(window.innerHeight);
    this.calculatePorcentaje();
    this.profileMerchantService.getAll().subscribe(
      dataInput => {
        this.isApplicationProccess = false;
        this.dataInput = dataInput;
      },
      error => {
        this.utils.verificarCodigoError(error, this.router);
      }
    );
  }

  validAccessLevel(){
    let role:Role[] = this.tokenStorage.getUser()['listRols'];
    let identifierModule:string = 'mantenimientomc';
    let procesoIndicatorArbolModule:string = 'prototipo2';
    let valModifid:string = '2';
    let valFullAccess:string = '3';

    if(
      role[0]
        .listModules
        .filter((item)=>item.identifier.trim()==identifierModule)[0]
        .listArbolModulo
        .filter((item)=>item.procesoIndicator.trim() == procesoIndicatorArbolModule
                        && ( item.processNivel == valModifid || item.processNivel == valFullAccess ))
        .length > 0
      ){
        this.isValidAccessLevel = false;
      }
  }

  @ViewChild(DynamictableComponent, { static: false }) set dynamicTable(table: DynamictableComponent) {
    this.table = table;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setHeight(event.target.innerHeight);
  }

  calculatePorcentaje() {
    if (window.innerHeight >= 600 && window.innerHeight < 700) {
      this.porcentajeFilling = (100 - ((window.innerHeight / 800) * 100)) - 1;
    }
    if (window.innerHeight >= 700 && window.innerHeight <= 800) {
      this.porcentajeFilling = (100 - ((window.innerHeight / 800) * 100)) - 2;
    }
  }

  setHeight(height: number) {
    if (this.dataInput != undefined && this.dataInput != null) {
      this.styleMatCard = (0.886 * height) + 'px';
    }
  }

  processDataOutPut(data: any) {
    console.log("data pickDataCheck",data);
    this.selectItems = data;
    this.profileMerchantService.getById(data[0].cmpprofileId).subscribe(profile => {
      this.selectItems[0].listMerchantProfileApplication = profile.listMerchantProfileApplication;
    });
  }

  sendToRequest(comment:string, sendToRequest:number, appSelection:string){
    let fields: MerchantProfile[] = this.selectItems;

    let tempRA:RequestApproval = { operationType:0, moduleType:0, content:"",	commentreq:"",coduserreq:""};
    tempRA.operationType = sendToRequest;
    tempRA.moduleType = UtilsConstant.TM_REQUEST_PROFILER_MERCHANT;
    tempRA.content = JSON.stringify(fields);
    tempRA.coduserreq = this.tokenStorage.getUser()["id"];
    tempRA.commentreq = comment;
    tempRA.appcurrent = appSelection;

    this.reqAppService.save(tempRA).subscribe(
      (data:RequestApproval)=>{
        console.log("exitoso");
        let curretnMerchantProfile: MerchantProfile;

        this.profileMerchantService.getById(this.selectItems[0].cmpprofileId).subscribe(
          succes => { curretnMerchantProfile = succes as MerchantProfile; this.initVarProfile() },
          error => console.log("Error al Cargar MerchantProfile",error),
          () => {
            this.registerAudit.setEntityOld = curretnMerchantProfile;
            this.registerAudit.setEntityId =  curretnMerchantProfile.cmpprofileId;
            this.registerAudit.setIdManc = data.raid;
            this.registerAudit.saveCurrentAudit(Utils.AUDIT_MANCOMUNED_TYPE);
            this.isEliminationMode = false;
          }
        );

      },(error)=>console.log("Error > Request Approval"));
  }

  popupDelete(): void {
    if(this.selectItems.length > 0){
      console.log(this.selectItems);
      if(this.selectItems[0].cmpassociatedQuantity>0){
        const dialogRef = this.dialog.open(PopupComponent, {
          width: '450px',
          disableClose: true,
        });
        dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_ELIMINAR;
        dialogRef.componentInstance.body = this.requestUtil.POPUP_BODY_GENERIC_ERASE_DELETE_ASOCIADOS;
        dialogRef.componentInstance.isEraseSelectDelete = true;
      }else{
      if(this.tokenStorage.isMancomuned(UtilsConstant.TM_REQUEST_PROFILER_MERCHANT)){


        const dialogRef = this.dialog.open(PopupComponent, {
          width: '450px',
          disableClose: true,
        });
        dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_ELIMINAR;
        dialogRef.componentInstance.body = this.requestUtil.POPUP_BODY_ELIMINAR_PROFILE;
        dialogRef.componentInstance.call = true;
        dialogRef.componentInstance.parameter = this.selectItems[0].cmpprofileId;
        dialogRef.afterClosed().subscribe(result => {
          console.log(result);
          if (result) {

            const dialogRef = this.dialog.open(PopupCommentComponent, {
              width: "800px",
              disableClose: false,
            });
            dialogRef.componentInstance.title = UtilsConstant.MSG_POPUP_TITLE_CONTENT;
            dialogRef.componentInstance.body = UtilsConstant.MSG_POPUP_COMMENT_CONTENT;
            dialogRef.componentInstance.module = this;
            dialogRef.componentInstance.typeProccess = UtilsConstant.TYPE_REQUEST_DELETE;
            dialogRef.afterClosed().subscribe((result) => {
              if(!result) {
                this.table.refreshData();
                this.table.cleanFormInputsFilters();
              }
            });
          } else {
             dialogRef.close();
          }
        });



      } else {

        const dialogRef = this.dialog.open(PopupComponent, {
          width: '450px',
          disableClose: true,
        });
        dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_ELIMINAR;
        dialogRef.componentInstance.body = this.requestUtil.POPUP_BODY_ELIMINAR_PROFILE;
        dialogRef.componentInstance.service = this.profileMerchantService;
        dialogRef.componentInstance.function = 'deleteByID';
        dialogRef.componentInstance.parameter = this.selectItems[0].cmpprofileId;
        dialogRef.afterClosed().subscribe(result => {
          if (result != undefined && result.status != undefined && result.status === 200) {
            //alert(result.body.message);
            //this.borrarDelDataSource(result.body.parameter);
            this.loadAdicionalParameter(this.selectItems[0].cmpprofileId);
            this.borrarDelDataSource(this.selectItems);
            this.isEliminationMode = false;
          } else {
            this.utils.verificarCodigoError(result, this.router);
          }
        });
      }
    }

    } else {
      const dialogRef = this.dialog.open(PopupComponent, {
        width: '450px',
        disableClose: true,
      });
      dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_ELIMINAR;
      dialogRef.componentInstance.body = this.requestUtil.POPUP_BODY_GENERIC_ERASE_DELETE;
      dialogRef.componentInstance.isEraseSelectDelete = true;
    }
  }

  borrarDelDataSource(retirarDelDataSource: MerchantProfile[]) {
    retirarDelDataSource.forEach(
      object => {
        const index = this.dataInput.indexOf(object);
        this.dataInput.splice(index, 1);
        this.table.dataTable = this.dataInput;
        this.table.refreshData();
      }
      );
    }

  get setCheckBoxColor() {
    return this.sanitizer.bypassSecurityTrustStyle(
      `--checkboxcolor: ${this.checkBoxColor};`
      );
  }

  loadAdicionalParameter(profilerId:string){

    this.initVarProfile();
    this.registerAudit.setEntityOld =  this.selectItems[0];
    this.registerAudit.setEntityId =   this.selectItems[0].cmpprofileId;
    this.registerAudit.saveCurrentAudit();

    // let curretnMerchantProfile: MerchantProfile;

    // this.profileMerchantService.getById(profilerId).subscribe(
    //   succes => { curretnMerchantProfile = succes as MerchantProfile; this.initVarProfile() },
    //   error => console.log("Error al Cargar MerchantProfile",error),
    //   () => {
    //     this.registerAudit.setEntityOld = curretnMerchantProfile;
    //     this.registerAudit.setEntityId =  curretnMerchantProfile.cmpprofileId;
    //     this.registerAudit.saveCurrentAudit();
    //   }
    // );
  }

  initVarProfile() {
    this.mapMerchantProfileApp = new Map<Application, InnerComponent>();
  }

  toggleEliminationMode($event){
    console.log("elimination mode: ", $event);
    this.isEliminationMode = $event;
  }

  toggleEliminationModeTable() {
    this.table.eliminationMode = false;
    this.isEliminationMode = false;
  }
}
