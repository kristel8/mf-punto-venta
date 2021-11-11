import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MerchantQuota } from 'src/app/entidades/merchant-quota';
import { QuotaMerchant } from 'src/app/entidades/quota-merchant';
import { QuotaHeaderExtendInput, QuotaHeaderInput, QuotaInput } from 'src/app/entidades/quotaInput';
import { TransactionQuota } from 'src/app/entidades/transaction-quota';
import { QuotaService } from 'src/app/servicios/quota.service';
import { DynamictableComponent } from 'src/app/shared/components/dynamictable/dynamictable.component';
import { PopupCommentComponent } from 'src/app/shared/components/popup-comment/popup-comment.component';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { Column } from 'src/app/shared/entities/column';
import { ConstantUtils } from 'src/app/shared/entities/constantUtils';
import { RegisterAudit } from 'src/app/shared/entities/registerAudit';
import { RequestUtils } from 'src/app/shared/entities/request-util';
import { RequestApproval } from 'src/app/shared/entities/requestApproval';
import { Role } from 'src/app/shared/entities/role';
import { Utils } from 'src/app/shared/entities/utils';
import { UtilsConstant } from 'src/app/shared/entities/utils-constant';
import { AuditService } from 'src/app/shared/services/audit.service';
import { RequestApprovalService } from 'src/app/shared/services/request-approval.service';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';
import { Testing } from 'src/app/utilitarios/testing';


enum StatusMerchant {
  Habilitado = "0",
  Histórico = "1",
  Deshabilitado = "2",
}

enum StatusQuotas {
  Habilitado = "0",
  Deshabilitado = "1",
}


@Component({
  selector: 'app-quotas-commerce-list',
  templateUrl: './quotas-commerce-list.component.html',
  styleUrls: ['./quotas-commerce-list.component.scss']
})

export class QuotasCommerceListComponent implements OnInit {
  registerAudit: RegisterAudit;

  showLoaderCupos = false;
  isValidAccessLevel: boolean = true;
  table: DynamictableComponent;
  totalPorcentaje: number = 0;
  totalList: number = 0;
  page: number[] = [1];
  size: number = 500;
  isQuotaProccess: boolean = true;
  isQuotaProgressBarProccess: boolean = false;
  styleMatCard: string;
  data: MerchantQuota[];
  animal: string;
  name: string;
  selectItems = [];
  showColumns: Column[];
  menuColumns: Column[];
  componenteDialog: string = this.utils.EDITAR_CUPO_COMERCIO;
  selectIdValue: string = this.utils.SELECT_MERCHANT_CUPO_ID;
  checkBox = this.utils.ENABLE_CHECKBOX;
  arrayOfTable = this.utils.ARRAY_OF_TABLE;
  clearFilter = this.utils.DISABLE_CLEAR_FILTER;
  checkBoxColor = this.utils.BLACK_COLOR;

  quotasDiario: QuotaMerchant[];
  quotasMensual: QuotaMerchant[];
  transactions: TransactionQuota[];

  isEliminationMode: boolean = false;

  constructor(
    private quotaService: QuotaService,
    public utils: Utils,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private router: Router,
    private requestUtil: RequestUtils,
    private auditService: AuditService,
    private tokenStorage: TokenStorageService,
    private reqAppService: RequestApprovalService,
    private testing: Testing
  ) {
    this.name = "";
    this.animal = "";
    this.styleMatCard = "";
    this.showColumns = this.testing.getShowColumnsTestinnForQuota();
    this.menuColumns = this.testing.getMenuColumnsTestingForQuota();
  }

  @ViewChild(DynamictableComponent, { static: false }) set dynamicTable(
    table: DynamictableComponent
  ) {
    this.table = table;
  }

  get setCheckBoxColor() {
    return this.sanitizer.bypassSecurityTrustStyle(
      `--checkboxcolor: ${this.checkBoxColor};`
    );
  }

  ngOnInit() {
    this.isValidAccessLevel = this.utils.validAccessLevelDelete(
      "mantenimientomc",
      "CupoxComercio"
    );
    //this.validAccessLevel();
    this.getQuota();
    this.registerAudit = new RegisterAudit(
      this.auditService,
      ConstantUtils.MODULE_POINT_OF_SALE_CONF,
      ConstantUtils.MODOPTION_QUOTA_MERCHANT,
      this.tokenStorage.getFullNameByUser(),
      "0",
      ConstantUtils.AUDIT_OPTION_TYPE_DELETE
    );
  }

  validAccessLevel() {
    let role: Role[] = this.tokenStorage.getUser()["listRols"];
    let identifierModule: string = "mantenimientomc";
    let procesoIndicatorArbolModule: string = "CupoxComercio";
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

  getQuota() {
    this.showLoaderCupos = true;
    this.quotaService.getAllMerchantQuotas().subscribe(
      (data) => {
        this.showLoaderCupos = false;
        this.data = data;
        data.map((el) => {
          const estado: string = Object.keys(StatusMerchant).find(
            (el1) => StatusMerchant[el1] === el.status
          );
          if (estado) {
            //el.status = estado;
          }
          return el;
        });
        console.log(this.data);
      },
      (error) => {
        this.showLoaderCupos = false;
      }
    );
  }

  processDataOutPut(data: any) {
    this.selectItems = data;
  }

  loadCupos(
    comment: string,
    sendToRequest: number,
    appSelection: string,
    fields: QuotaHeaderExtendInput
  ) {
    this.quotaService
      .findQuotasByMerchantAndApp(fields.merchantId, fields.applicationId)
      .subscribe(
        (data) => {
          const dataProcess = data.map((el1) => {
            const estadoDiario = Object.keys(StatusQuotas).find(
              (el2) => StatusQuotas[el2] === el1.action
            );
            const estadoMensual = Object.keys(StatusQuotas).find(
              (el2) => StatusQuotas[el2] === el1.actionMes
            );

            if (estadoDiario) {
              el1.action = estadoDiario;
            }

            if (estadoMensual) {
              el1.actionMes = estadoMensual;
            }

            return el1;
          });

          this.quotasDiario = dataProcess;
          this.quotasMensual = dataProcess;
        },
        (error) => console.log("Error Servicio de Cupos"),
        () => this.loadTransaction(comment, sendToRequest, appSelection, fields)
      );
  }

  loadTransaction(
    comment: string,
    sendToRequest: number,
    appSelection: string,
    fields: QuotaHeaderExtendInput
  ) {
    this.quotaService
      .findTransactionByMerchantAndApp(fields.merchantId, fields.applicationId)
      .subscribe(
        (data) => {
          this.transactions = data.filter((el) => !el.hasQuota);
        },
        (error) => console.log("Error Cargando Transacción"),
        () =>
          this.proccessToRequest(comment, sendToRequest, appSelection, fields)
      );
  }

  proccessToRequest(
    comment: string,
    sendToRequest: number,
    appSelection: string,
    fields: QuotaHeaderExtendInput
  ) {
    fields.transactions = this.transactions.filter(
      (item) =>
        this.quotasDiario.filter(
          (item2) => item2.transactionId == item.transactionId
        ).length == 0
    );
    fields.quotasDiario = this.quotasDiario;
    fields.quotasMensual = this.quotasMensual;

    let tempRA: RequestApproval = {
      operationType: 0,
      moduleType: 0,
      content: "",
      commentreq: "",
      coduserreq: "",
    };
    tempRA.operationType = sendToRequest;
    tempRA.moduleType = UtilsConstant.TM_REQUEST_MANT_QUOTA_MERCHANT;
    tempRA.content = JSON.stringify(fields);
    tempRA.coduserreq = this.tokenStorage.getUser()["id"];
    tempRA.commentreq = comment;
    tempRA.appcurrent = appSelection;

    this.reqAppService.save(tempRA).subscribe(
      (data: RequestApproval) => {
        console.log("exitoso");

        let resultFields: QuotaHeaderExtendInput = this.getDataInputs();
        resultFields.merchantId = fields.merchantId;
        resultFields.applicationId = fields.applicationId;
        resultFields.quotasDiario = this.quotasDiario;
        resultFields.quotasMensual = this.quotasMensual;

        this.registerAudit.setEntityOld = resultFields;
        this.registerAudit.setEntityId = resultFields.merchantId;
        this.registerAudit.setIdManc = data.raid;
        this.registerAudit.saveCurrentAudit(Utils.AUDIT_MANCOMUNED_TYPE);
        this.isEliminationMode = false;
      },
      (error) => console.log("Error > Request Approval")
    );
  }

  sendToRequest(comment: string, sendToRequest: number, appSelection: string) {
    let fields: QuotaHeaderExtendInput = (
      this.selectItems as QuotaHeaderInput[]
    )[0];
    this.loadCupos(comment, sendToRequest, appSelection, fields);
  }

  popupDelete(): void {
    if (this.selectItems.length > 0) {

      if(this.tokenStorage.isMancomuned(UtilsConstant.TM_REQUEST_MANT_QUOTA_MERCHANT)){

        const dialogRef = this.dialog.open(PopupComponent, {
          width: '450px',
          disableClose: true,
        });
        dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_ELIMINAR;
        dialogRef.componentInstance.body = this.requestUtil.POPUP_BODY_ELIMINAR_CUPO;
        dialogRef.componentInstance.call = true;
        dialogRef.componentInstance.parameter = this.selectItems[0].cmpprofileId;
        dialogRef.afterClosed().subscribe(result => {

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
        this.loadCuposAudit(this.registerAudit, this.selectItems);
      }
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

  loadCuposAudit(currentAudit: RegisterAudit, selectItems: any[]) {
    let fields: QuotaHeaderExtendInput = (selectItems as QuotaHeaderInput[])[0];

    this.quotaService
      .findQuotasByMerchantAndApp(fields.merchantId, fields.applicationId)
      .subscribe(
        (data) => {
          const dataProcess = data.map((el1) => {
            const estadoDiario = Object.keys(StatusQuotas).find(
              (el2) => StatusQuotas[el2] === el1.action
            );
            const estadoMensual = Object.keys(StatusQuotas).find(
              (el2) => StatusQuotas[el2] === el1.actionMes
            );

            if (estadoDiario) {
              el1.action = estadoDiario;
            }

            if (estadoMensual) {
              el1.actionMes = estadoMensual;
            }

            return el1;
          });

          this.quotasDiario = dataProcess;
          this.quotasMensual = dataProcess;
        },
        (error) => console.log("Error Servicio de Cupos", error),
        () => {
          let resultFields: QuotaHeaderExtendInput = this.getDataInputs();
          resultFields.merchantId = fields.merchantId;
          resultFields.applicationId = fields.applicationId;
          resultFields.quotasDiario = this.quotasDiario;
          resultFields.quotasMensual = this.quotasMensual;

          currentAudit.setEntityOld = resultFields;
          currentAudit.setEntityId = resultFields.merchantId;
          // currentAudit.debug();
          // currentAudit.saveCurrentAudit();

          const dialogRef = this.dialog.open(PopupComponent, {
            width: "450px",
            disableClose: true,
          });
          dialogRef.componentInstance.title =
            this.requestUtil.POPUP_TITLE_ELIMINAR;
          dialogRef.componentInstance.body =
            this.requestUtil.POPUP_BODY_ELIMINAR_MERCHANT_CUPO;
          dialogRef.componentInstance.service = this.quotaService;
          dialogRef.componentInstance.function = "deleteQuotas";
          dialogRef.componentInstance.parameter = this.selectItems[0];
          dialogRef.afterClosed().subscribe((result) => {
            if (
              result != undefined &&
              result.status != undefined &&
              result.status === 200
            ) {
              // this.registerAudit.setEntityOld = this.selectItems[0];
              // this.registerAudit.setEntityId = this.selectItems[0].merchantId;
              // this.registerAudit.saveCurrentAudit();

              // this.loadCuposAudit(this.registerAudit, this.selectItems);
              currentAudit.saveCurrentAudit();

              this.data = this.data.filter(
                (el) => !this.selectItems.includes(el)
              );
              this.selectItems = [];
              this.isEliminationMode = false;
            } else {
              this.utils.verificarCodigoError(result, this.router);
            }
          });
        }
      );
  }

  getDataInputs(): QuotaHeaderInput {
    const saveQuotas: QuotaInput[] = [];
    this.quotasDiario.forEach((el) => {
      const quota: QuotaInput = {} as QuotaInput;
      quota.action = StatusQuotas[el.action];
      quota.actionMes = StatusQuotas[el.actionMes];
      quota.transactionId = el.transactionId;
      quota.limitAmount = el.limitAmount;
      quota.limitTimes = el.limitTimes;
      quota.limitAmountMes = el.limitAmountMes;
      quota.limitTimesMes = el.limitTimesMes;
      const dataMensual = this.quotasMensual.find(
        (el2) => el2.transactionId === el.transactionId
      );
      if (dataMensual) {
        //quota.actionMes = dataMensual.actionMes;
        quota.actionMes = StatusQuotas[dataMensual.actionMes];
        quota.limitAmountMes = dataMensual.limitAmountMes;
        quota.limitTimesMes = dataMensual.limitTimesMes;
      }
      saveQuotas.push(quota);
    });

    const headerQuota: QuotaHeaderInput = {} as QuotaHeaderInput;
    headerQuota.quotas = saveQuotas;

    return headerQuota;
  }

  toggleEliminationMode($event) {
    console.log("elimination mode: ", $event);
    this.isEliminationMode = $event;
  }

  toggleEliminationModeTable() {
    this.table.eliminationMode = false;
    this.isEliminationMode = false;
  }
}
