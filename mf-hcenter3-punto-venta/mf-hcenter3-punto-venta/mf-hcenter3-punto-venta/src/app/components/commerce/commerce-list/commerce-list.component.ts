import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Merchant } from 'src/app/entidades/merchant';
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
import { MerchantService } from 'src/app/shared/services/merchant.service';
import { RequestApprovalService } from 'src/app/shared/services/request-approval.service';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';
import { Testing } from 'src/app/utilitarios/testing';
import { CommerceCreateComponent } from '../commerce-create/commerce-create.component';

@Component({
  selector: 'app-commerce-list',
  templateUrl: './commerce-list.component.html',
  styleUrls: ['./commerce-list.component.scss']
})
export class CommerceListComponent implements OnInit {

  isValidAccessLevel: boolean = true;

  styleMatCard: string;
  dataInput: Merchant[] = [];

  totalPorcentaje: number = 0;
  totalList: number = 0;

  //INFO: Datos de Configuracion RequestService Reactive
  page: number[] = [1];
  size: number = 500;
  //size:number = 1000;

  table: DynamictableComponent;
  isMerchartProccess: boolean = true;
  isMerchartProgressBarProccess: boolean = false;

  registerAudit: RegisterAudit;

  // dialog
  animal: string;
  name: string;

  showColumns: Column[];
  menuColumns: Column[];
  componenteDialog: string = this.utils.EDITAR_COMERCIO;
  selectIdValue: string = this.utils.SELECT_CMRMERCHANTID;
  checkBox = this.utils.ENABLE_CHECKBOX;
  arrayOfTable = this.utils.ARRAY_OF_TABLE;
  clearFilter = this.utils.DISABLE_CLEAR_FILTER;
  checkBoxColor = this.utils.BLACK_COLOR;
  deleteData = [];
  selectItems = [];

  requestRallied = new RequestRallied();
  requestRalliedEditar: Merchant[];

  // para eliminar
  form: FormGroup;

  isEliminationMode: boolean = false;
  // @ViewChild("table", { static: false }) table: DynamictableComponent;
  @ViewChild(DynamictableComponent, { static: false }) set dynamicTable(
    table: DynamictableComponent
  ) {

    this.table = table;
  }
  constructor(
    private merchantService: MerchantService,
    public utils: Utils,
    private testing: Testing,
    private tokenStorage: TokenStorageService,
    private reqAppService: RequestApprovalService,
    public dialog: MatDialog,
    private requestUtil: RequestUtils,
    private sanitizer: DomSanitizer,
    private auditService: AuditService,
    private router: Router
  ) {
    this.name = "";
    this.animal = "";
    this.styleMatCard = "";
    this.showColumns = this.testing.getShowColumnsTestingForMerchant();
    this.menuColumns = this.testing.getMenuColumnsTestingForMerchant();
  }



  get setCheckBoxColor() {
    return this.sanitizer.bypassSecurityTrustStyle(
      `--checkboxcolor: ${this.checkBoxColor};`
    );
  }

  ngOnInit() {
    this.registerAudit = new RegisterAudit(
      this.auditService,
      ConstantUtils.MODULE_POINT_OF_SALE_CONF,
      ConstantUtils.MODOPTION_MERCHANT,
      this.tokenStorage.getFullNameByUser(),
      "0",
      ConstantUtils.AUDIT_OPTION_TYPE_DELETE
    );
    this.isValidAccessLevel = this.utils.validAccessLevelDelete(
      "mantenimientomc",
      "comercio"
    );
    //this.validAccessLevel();
    this.getComercios();
  }

  validAccessLevel() {
    let role: Role[] = this.tokenStorage.getUser()["listRols"];
    let identifierModule: string = "mantenimientomc";
    let procesoIndicatorArbolModule: string = "comercio";
    let valModifid: string = "2";
    let valFullAccess: string = "3";

    if (
      role[0].listModules
        .filter((item) => item.identifier.trim() == identifierModule)[0]
        .listArbolModulo.filter(
          (item) =>
            item.procesoIndicator.trim() == procesoIndicatorArbolModule &&
            (item.processNivel == valModifid ||
              item.processNivel == valFullAccess)
        ).length > 0
    ) {
      this.isValidAccessLevel = false;
    }
  }

  getComercios() {
    let pages: number[] = [];
    let pagesThread: number[] = [];

    this.merchantService.getAllMerchantsPage(this.page, 5).subscribe(
      (response) => {
        let numero: number = +JSON.stringify(response["totalElements"]);
        this.totalList = numero;
        //let numCiclo:number = +numero;
        numero = numero / this.size;
        pages.push(0); //INFO: Flag para primer conjunto de datos.
        //for(let i = 1;i <= numero;i++){pages.push(i);}
        for (let i = 1; i <= numero; i++) {
          pagesThread.push(i);
        }
      },
      (error) => {
        console.log("error nuevo llamado");
      },
      () => {
        this.merchantService.getAllMerchantsPage(pages, this.size).subscribe(
          (response) => {
            this.isMerchartProccess = false;
            this.isMerchartProgressBarProccess = true;
            this.dataInput = this.dataInput.concat(response["content"]);
            this.totalPorcentaje =
              (this.dataInput.length / this.totalList) * 100;
          },
          (error) => {
            console.log("error nuevo llamado");
          },
          () => {
            this.dataInput = this.dataInput
              .filter((item: Merchant) => item.cmrMerchantId != null) //INFO: Se filtran Terminales Sin Comercio
              .sort((a, b) => b.cmrMerchantId.localeCompare(a.cmrMerchantId)); //INFO: Se ordena por Comercio
            this.merchantService
              .getAllMerchantsPageThread(pagesThread, this.size)
              .subscribe(
                (response) => {
                  this.isMerchartProccess = false;
                  this.dataInput = this.dataInput.concat(response["content"]);
                  this.totalPorcentaje =
                    (this.dataInput.length / this.totalList) * 100;
                },
                (error) => {
                  console.log("error nuevo llamado");
                },
                () => {
                  this.isMerchartProgressBarProccess = false;
                  this.dataInput = this.dataInput
                    .filter((item: Merchant) => item.cmrMerchantId != null) //INFO: Se filtran Terminales Sin Comercio
                    .sort((a, b) =>
                      b.cmrMerchantId.localeCompare(a.cmrMerchantId)
                    ); //INFO: Se ordena por Comercio*/
                  console.log(this.dataInput);
                }
              );
          }
        );
      }
    );
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.setHeight(event.target.innerHeight);
  }

  setHeight(height: number) {
    if (this.dataInput != undefined && this.dataInput != null) {
      this.styleMatCard = 0.86 * height + "px";
    }
  }

  openDialogNuevo(): void {
    const dialogRef = this.dialog.open(CommerceCreateComponent, {
      width: "1300px",
      height: "680px",
      disableClose: true,
      data: {
        name: this.name,
        animal: this.animal,
        crudType: "create",
        idMerchan: "0",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      this.animal = result;
    });
  }

  processDataOutPut(data: any) {
    this.selectItems = data;
  }

  getShowColumn(data: any) {}

  sendToRequest(comment: string, sendToRequest: number, appSelection: string) {
    let fields: Merchant[] = this.selectItems;

    let tempRA: RequestApproval = {
      operationType: 0,
      moduleType: 0,
      content: "",
      commentreq: "",
      coduserreq: "",
    };
    tempRA.operationType = sendToRequest;
    tempRA.moduleType = UtilsConstant.TM_REQUEST_MERCHANT;
    tempRA.content = JSON.stringify(fields);
    tempRA.coduserreq = this.tokenStorage.getUser()["id"];
    tempRA.commentreq = comment;
    tempRA.appcurrent = appSelection;

    this.reqAppService.save(tempRA).subscribe(
      (data: RequestApproval) => {
        console.log("exitoso");

        this.registerAudit.setEntityId = (
          this.selectItems[0] as Merchant
        ).cmrMerchantId;
        this.registerAudit.setEntityOld = this.selectItems[0];
        this.registerAudit.setIdManc = data.raid;
        this.registerAudit.saveCurrentAudit(Utils.AUDIT_MANCOMUNED_TYPE);
        this.isEliminationMode = false;
      },
      (error) => console.log("Error > Request Approval")
    );

    this.router.navigateByUrl("/config-red/comercio");
  }

  popupEliminar(): void {
    if (this.selectItems.length > 0) {

      console.log(this.selectItems[0]);
      //cmrMerchantId

      this.merchantService.validationMerchTerminal(this.selectItems[0].cmrMerchantId).subscribe(exist => {
        if(!exist){
          if (this.tokenStorage.isMancomuned(UtilsConstant.TM_REQUEST_MERCHANT)) {
            const dialogRef = this.dialog.open(PopupComponent, {
              width: "450px",
              disableClose: true,
            });
            dialogRef.componentInstance.title =
              this.requestUtil.POPUP_TITLE_ELIMINAR;
            dialogRef.componentInstance.body =
              this.requestUtil.POPUP_BODY_ELIMINAR_MERCHANT;
            dialogRef.componentInstance.call = true;
            dialogRef.componentInstance.parameter =
              this.selectItems[0].cmpprofileId;
            dialogRef.afterClosed().subscribe((result) => {
              if (result) {
                const dialogRef = this.dialog.open(PopupCommentComponent, {
                  width: "800px",
                  disableClose: false,
                });
                dialogRef.componentInstance.title =
                  UtilsConstant.MSG_POPUP_TITLE_CONTENT;
                dialogRef.componentInstance.body =
                  UtilsConstant.MSG_POPUP_COMMENT_CONTENT;
                dialogRef.componentInstance.module = this;
                dialogRef.componentInstance.typeProccess =
                  UtilsConstant.TYPE_REQUEST_DELETE;
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
              width: "450px",
              disableClose: true,
            });
            dialogRef.componentInstance.title =
              this.requestUtil.POPUP_TITLE_ELIMINAR;
            dialogRef.componentInstance.body =
              this.requestUtil.POPUP_BODY_ELIMINAR_MERCHANT;
            dialogRef.componentInstance.service = this.merchantService;
            dialogRef.componentInstance.function = "deleteMany";
            dialogRef.componentInstance.parameter = this.selectItems;
            dialogRef.afterClosed().subscribe((result) => {
              if (
                result != undefined &&
                result.status != undefined &&
                result.status === 200
              ) {
                //alert(result.body.message);
                //this.borrarDelDataSource(result.body.parameter);
                this.registerAudit.setEntityId = (
                  this.selectItems[0] as Merchant
                ).cmrMerchantId;
                this.registerAudit.setEntityOld = this.selectItems[0];
                this.registerAudit.saveCurrentAudit();

                this.borrarDelDataSource(this.selectItems);

                this.isEliminationMode = false;
              } else {
                this.utils.verificarCodigoError(result, this.router);
                alert("No se pudo eliminar"); // cuando exista el componente de mensajes de error remplazar
              }
            });
          }
        }else{
          const dialogRef = this.dialog.open(PopupComponent, {
            width: '450px',
            disableClose: true,
          });
          dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_ELIMINAR;
          dialogRef.componentInstance.body = "El comercio tiene terminales asociados.";
          dialogRef.componentInstance.isEraseSelectDelete = true;
          dialogRef.afterClosed().subscribe(result => {
          });
        }
      });

    } else {
      const dialogRef = this.dialog.open(PopupComponent, {
        width: "450px",
        disableClose: true,
      });
      dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_ELIMINAR;
      dialogRef.componentInstance.body =
        this.requestUtil.POPUP_BODY_GENERIC_ERASE_DELETE;
      dialogRef.componentInstance.isEraseSelectDelete = true;
    }
  }

  borrarDelDataSource(retirarDelDataSource: Merchant[]) {
    retirarDelDataSource.forEach((object) => {
      const index = this.dataInput.indexOf(object);
      this.dataInput.splice(index, 1);
      this.table.dataTable = this.dataInput;
      this.table.refreshData();
    });
  }

  reloadPage() {
    window.location.reload();
  }

  toggleEliminationMode($event) {
    console.log("elimination mode: ", $event);
    this.isEliminationMode = $event;
  }

  toggleEliminationModeTable() {
    //this.table.eliminationMode = false;
    this.isEliminationMode = false;
  }
}
