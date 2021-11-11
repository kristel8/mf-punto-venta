import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MerchantChain } from 'src/app/entidades/merchant-chain';
import { MechantChainService } from 'src/app/servicios/mechant-chain.service';
import { DynamictableComponent } from 'src/app/shared/components/dynamictable/dynamictable.component';
import { PopupCommentComponent } from 'src/app/shared/components/popup-comment/popup-comment.component';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { Column } from 'src/app/shared/entities/column';
import { ConstantUtils } from 'src/app/shared/entities/constantUtils';
import { RegisterAudit } from 'src/app/shared/entities/registerAudit';
import { RequestRallied } from 'src/app/shared/entities/request-rallied';
import { RequestUtils } from 'src/app/shared/entities/request-util';
import { RequestApproval } from 'src/app/shared/entities/requestApproval';
import { Role } from 'src/app/shared/entities/role';
import { Utils } from 'src/app/shared/entities/utils';
import { UtilsConstant } from 'src/app/shared/entities/utils-constant';
import { AuditService } from 'src/app/shared/services/audit.service';
import { RequestApprovalService } from 'src/app/shared/services/request-approval.service';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';
import { Testing } from 'src/app/utilitarios/testing';

@Component({
  selector: 'app-chain-commerce-list',
  templateUrl: './chain-commerce-list.component.html',
  styleUrls: ['./chain-commerce-list.component.scss']
})
export class ChainCommerceListComponent implements OnInit {


  isValidAccessLevel:boolean = true;
  isApplicationProccess:boolean = true;

  registerAudit:RegisterAudit;

  styleMatCard: string;
  dataInput: MerchantChain[];

  // dialog
  animal: string;
  name: string;

  table: DynamictableComponent;

  showColumns: Column[];
  menuColumns: Column[];
  componenteDialog: string = this.utils.EDITAR_CADENA_COMERCIO;
  selectIdValue: string = this.utils.SELECT_CMCCHAINIDEDIT;
  checkBox = this.utils.ENABLE_CHECKBOX;
  arrayOfTable = this.utils.ARRAY_OF_TABLE;
  clearFilter = this.utils.DISABLE_CLEAR_FILTER;
  checkBoxColor = this.utils.BLACK_COLOR;
  deleteData = [];

  selectItems = [];

  requestRallied = new RequestRallied();

  requestRalliedEditar: MerchantChain[];

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  form: FormGroup;

  merchantCurrent: MerchantChain;

  isEliminationMode: boolean = false;


  constructor(
    private merchantChainService: MechantChainService,
    public dialog: MatDialog,
    private tokenStorage: TokenStorageService,
    public utils: Utils,
    private sanitizer: DomSanitizer,
    private reqAppService:RequestApprovalService,
    private auditService:AuditService,
    private testing: Testing,
    private requestUtil: RequestUtils,
    private router: Router
  ) {
    this.name = '';
    this.animal = '';

    this.styleMatCard = '';
    this.showColumns = this.testing.getShowColumnsTestinnForMerchantChain();
    this.menuColumns = this.testing.getMenuColumnsTestingForMerchantChain();
  }

  @ViewChild(DynamictableComponent, { static: false }) set dynamicTable(table: DynamictableComponent) {
    this.table = table;
  }

  ngOnInit() {

    this.registerAudit = new RegisterAudit( this.auditService, ConstantUtils.MODULE_POINT_OF_SALE_CONF, ConstantUtils.MODOPTION_MERCHANT_CHAIN, this.tokenStorage.getFullNameByUser(), "0", ConstantUtils.AUDIT_OPTION_TYPE_DELETE);
    this.isValidAccessLevel = this.utils.validAccessLevelDelete('mantenimientomc', 'mantCadenaCom');
    //this.validAccessLevel();
    this.merchantChainService.getAllMerchantChain().subscribe(
      dataInput => {
        this.isApplicationProccess = false;
        this.dataInput = dataInput;
        this.setHeight(window.innerHeight);
      },
      error => {
        console.log("Error en cadena de Comercio");
        // data de prueba en error.
        // this.dataInput = this.testing.getMerchanChainTestData();
        this.setHeight(window.innerHeight);
      }
    );

  }

  validAccessLevel(){
    let role:Role[] = this.tokenStorage.getUser()['listRols'];
    let identifierModule:string = 'mantenimientomc';
    let procesoIndicatorArbolModule:string = 'mantCadenaCom';
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

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setHeight(event.target.innerHeight);
  }

  setHeight(height: number) {
    if (this.dataInput != undefined && this.dataInput != null) {
      this.styleMatCard = (0.86 * height) + 'px';
    }
  }

  getShowColumn(evento: any) {
    console.log(evento);
  }

  processDataOutPut(data: any) {
    this.selectItems = data;
  }

  sendToRequest(comment:string, typeProccess:number, appSelection:string){
    let merchantChain: MerchantChain = this.selectItems[0];

    let tempRA:RequestApproval = { operationType:0, moduleType:0, content:"",	commentreq:"",coduserreq:""};
    tempRA.operationType = typeProccess;
    tempRA.moduleType = UtilsConstant.TM_REQUEST_MANT_MERCHANT_CHAIN;
    tempRA.content = JSON.stringify(merchantChain);
    tempRA.coduserreq = this.tokenStorage.getUser()["id"];
    tempRA.commentreq = comment;
    tempRA.appcurrent = appSelection;

    this.reqAppService.save(tempRA).subscribe(
      (data:RequestApproval)=>{
        console.log("exitoso");

        this.registerAudit.setEntityOld = this.selectItems[0];
        this.registerAudit.setIdManc = data.raid;
        this.registerAudit.saveCurrentAudit(Utils.AUDIT_MANCOMUNED_TYPE);

        this.isEliminationMode = false;

      },(error)=>console.log("Error > Request Approval"));

  }

  // popupEliminar(): void {

  //   if(this.selectItems.length > 0){

  //     if(true){

  //       const dialogRef = this.dialog.open(PopupComponent, {
  //         width: '450px',
  //         disableClose: true,
  //       });
  //       dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_ELIMINAR;
  //       dialogRef.componentInstance.body = this.requestUtil.POPUP_BODY_ELIMINAR_PROFILE;
  //       dialogRef.componentInstance.call = true;
  //       dialogRef.componentInstance.parameter = this.selectItems[0].cmpprofileId;
  //       dialogRef.afterClosed().subscribe(result => {
  //         if (result) {
  //         const dialogRef = this.dialog.open(PopupCommentComponent, {
  //           width: "800px",
  //           disableClose: false,
  //         });
  //         dialogRef.componentInstance.title = UtilsConstant.MSG_POPUP_TITLE_CONTENT;
  //         dialogRef.componentInstance.body = UtilsConstant.MSG_POPUP_COMMENT_CONTENT;
  //         dialogRef.componentInstance.module = this;
  //         dialogRef.componentInstance.typeProccess = UtilsConstant.TYPE_REQUEST_DELETE;
  //         dialogRef.afterClosed().subscribe((result) => {
  //           // console.log("datos");
  //         });
  //       } else {
  //         dialogRef.close();
  //       }
  //       })

  //     } else {

  //       const dialogRef = this.dialog.open(PopupComponent, {
  //         width: '500px',
  //         disableClose: true,
  //       });
  //       dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_ELIMINAR;
  //       dialogRef.componentInstance.body = this.requestUtil.POPUP_BODY_ELIMINAR_MERCHANT_CHAIN;
  //       dialogRef.componentInstance.service = this.merchantChainService;
  //       dialogRef.componentInstance.function = 'deleteById';
  //       dialogRef.componentInstance.parameter = this.selectItems[0].cmcchainID;
  //       dialogRef.afterClosed().subscribe(result => {
  //         console.log("retorno");
  //         if (result != undefined && result.status != undefined && result.status === 200) {
  //           //alert(result.body.message);
  //           this.registerAudit.setEntityOld = this.selectItems[0];
  //           this.registerAudit.saveCurrentAudit();
  //           this.borrarDelDataSource(this.selectItems);
  //           this.selectItems = [];
  //         } else {
  //           console.log("Errors");
  //           this.utils.verificarCodigoError(result, this.router);
  //           alert('No se pudo eliminar'); // cuando exista el componente de mensajes de error remplazar
  //         }
  //       });

  //     }
  //   } else {
  //     const dialogRef = this.dialog.open(PopupComponent, {
  //       width: '500px',
  //       disableClose: true,
  //     });
  //     dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_ELIMINAR;
  //     dialogRef.componentInstance.body = this.requestUtil.POPUP_BODY_GENERIC_ERASE_DELETE;
  //     dialogRef.componentInstance.isEraseSelectDelete = true;
  //   }



  // }

  invalidDeleteMessagePopup(message: string) {
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '450px',
      disableClose: true,
    });
    dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_ELIMINAR;
    dialogRef.componentInstance.body = message;
    dialogRef.componentInstance.isEraseSelectDelete = true;
  }



  async popupEliminar(): Promise<void> {
    ///////////////////////////
    if (this.selectItems.length == 0) {
      this.invalidDeleteMessagePopup(this.requestUtil.POPUP_BODY_GENERIC_ERASE_DELETE);
      return;
    }
    const resLeg = await this.merchantChainService.checkAssociates(this.selectItems).toPromise();

    if (this.selectItems.length > 1) {
      if(resLeg.message === "0") {
        this.isApplicationProccess = false;
        this.invalidDeleteMessagePopup(this.requestUtil.POPUP_BODY_ELIMINAR_INVALIDO_MUCHOS);
        return;
      }
    } else {
      if(resLeg.message === "0") {
        this.isApplicationProccess = false;
        this.invalidDeleteMessagePopup(this.requestUtil.POPUP_BODY_ELIMINAR_INVALIDO_UNITARIO);
        return;
      }
    }
    ///////////////////

    if(this.selectItems.length > 0){

      if(this.tokenStorage.isMancomuned(UtilsConstant.TM_REQUEST_MANT_MERCHANT_CHAIN)){

        const dialogRefManc = this.dialog.open(PopupComponent, {
          width: '450px',
          disableClose: true,
        });
        dialogRefManc.componentInstance.title = this.requestUtil.POPUP_TITLE_ELIMINAR;
        dialogRefManc.componentInstance.body = this.requestUtil.POPUP_BODY_ELIMINAR_MERCHANT_CHAIN;
        // dialogRefManc.componentInstance.isEraseSelectDelete = true;
        dialogRefManc.componentInstance.call = true;

        dialogRefManc.afterClosed().subscribe((result) => {

          if (result) {
            const dialogRefMancModal = this.dialog.open(PopupCommentComponent, {
              width: "800px",
              disableClose: false,
            });
            dialogRefMancModal.componentInstance.title = UtilsConstant.MSG_POPUP_TITLE_CONTENT;
            dialogRefMancModal.componentInstance.body = UtilsConstant.MSG_POPUP_COMMENT_CONTENT;
            dialogRefMancModal.componentInstance.module = this;
            dialogRefMancModal.componentInstance.typeProccess = UtilsConstant.TYPE_REQUEST_DELETE;
            dialogRefMancModal.afterClosed().subscribe((result) => {
              if(!result) {
                this.table.refreshData();
                this.table.cleanFormInputsFilters();
              }
            });
          }


        });

      } else {

        const dialogRef = this.dialog.open(PopupComponent, {
          width: '500px',
          disableClose: true,
        });
        dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_ELIMINAR;
        dialogRef.componentInstance.body = this.requestUtil.POPUP_BODY_ELIMINAR_MERCHANT_CHAIN;
        dialogRef.componentInstance.service = this.merchantChainService;
        dialogRef.componentInstance.function = 'deleteById';
        dialogRef.componentInstance.parameter = this.selectItems[0].cmcchainID;
        dialogRef.afterClosed().subscribe(result => {
          console.log("retorno");
          if (result != undefined && result.status != undefined && result.status === 200) {
            //alert(result.body.message);
            this.registerAudit.setEntityOld = this.selectItems[0];
            this.registerAudit.saveCurrentAudit();
            this.borrarDelDataSource(this.selectItems);
            this.isEliminationMode = false;
          } else {
            console.log("Errors");
            this.utils.verificarCodigoError(result, this.router);
            alert('No se pudo eliminar'); // cuando exista el componente de mensajes de error remplazar
          }
        });

      }
    } else {
      const dialogRef = this.dialog.open(PopupComponent, {
        width: '500px',
        disableClose: true,
      });
      dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_ELIMINAR;
      dialogRef.componentInstance.body = this.requestUtil.POPUP_BODY_GENERIC_ERASE_DELETE;
      dialogRef.componentInstance.isEraseSelectDelete = true;
    }



  }

  borrarDelDataSource(retirarDelDataSource: MerchantChain[]) {
    retirarDelDataSource.forEach(
      object => {
        if (object.cmcassociatedQuantity == 0) {
          const index = this.dataInput.indexOf(object);
          this.dataInput.splice(index, 1);
          this.table.dataTable = this.dataInput;
          this.table.refreshData();
        }
      }
    );
  }

  get setCheckBoxColor() {
    return this.sanitizer.bypassSecurityTrustStyle(
      `--checkboxcolor: ${this.checkBoxColor};`
    );
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
