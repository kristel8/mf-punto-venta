import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
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
import { ApplicationService } from 'src/app/shared/services/application.service';
import { AuditService } from 'src/app/shared/services/audit.service';
import { RequestApprovalService } from 'src/app/shared/services/request-approval.service';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';
import { Testing } from 'src/app/utilitarios/testing';
import { QuotasCommerceUpdateComponent } from './quotas-commerce-update/quotas-commerce-update.component';

enum StatusQuotas {
  Habilitado = "0",
  Deshabilitado = "1"
}

@Component({
  selector: 'app-quotas-commerce-edit',
  templateUrl: './quotas-commerce-edit.component.html',
  styleUrls: ['./quotas-commerce-edit.component.scss']
})
export class QuotasCommerceEditComponent implements OnInit {


  registerAudit: RegisterAudit;

  merchant: MerchantQuota = {} as MerchantQuota;

  havePaginator = false;
  quotas: QuotaMerchant[];

  //componenteDialog: string = this.utils.EDITAR_CUPO_COMERCIO;
  selectIdValue: string = this.utils.SELECT_MERCHANT_CUPO_TRANSACTION_ID;
  checkBox = this.utils.ENABLE_CHECKBOX;
  arrayOfTable = this.utils.ARRAY_OF_TABLE;
  clearFilter = this.utils.DISABLE_CLEAR_FILTER;
  checkBoxColor = this.utils.BLACK_COLOR;
  animal: string = '';
  name: string = '';
  table: DynamictableComponent;

  quotasDiario: QuotaMerchant[];
  tableDiario: DynamictableComponent;
  showColumnsDiario: Column[];
  menuColumnsDiario: Column[];
  selectItemsDiario = [];

  quotasMensual: QuotaMerchant[];
  tableMensual: DynamictableComponent;
  showColumnsMensual: Column[];
  menuColumnsMensual: Column[];
  selectItemsMensual = [];

  selectItems = [];

  selectItems2:TransactionQuota[]=[];

  transactions: TransactionQuota[];
  showColumnsTransaction: Column[];
  menuColumnsTransaction: Column[];
  selectItemsTransaction = [];

  showData = false;
  showLoaderData = false;
  showError = false;

  //dialogRefDiario: any;
  dialogRefDiario: MatDialogRef<QuotasCommerceUpdateComponent>;
  isQuotaSaveProccess = false;
  isValidAccessLevel = false;
  isValidAccessLevelModify = false;

  originalQuotaHeaderExtendInput: any = {};

  quotasDiarioOriginal: QuotaMerchant[];
  constructor(
    public utils: Utils,
    private sanitizer: DomSanitizer,
    private quotaService: QuotaService,
    private tokenStorage: TokenStorageService,
    private reqAppService: RequestApprovalService,
    private auditService: AuditService,
    private router: Router,
    private requestUtil: RequestUtils,
    private testing: Testing,
    private dialog: MatDialog,
    private appService: ApplicationService) {

    this.merchant = this.quotaService.getMerchantLS();

    this.menuColumnsTransaction = this.testing.getMenuColumnsTestingForTransactionQuota();
    this.showColumnsTransaction = this.testing.getShowColumnsTestingForTransactionQuota();

    this.processMonedaSimbolo()
  }

  processMonedaSimbolo() {
    const moneda = this.appService.getMonedaByAppLS(this.merchant.applicationId);
    if (moneda) {

      let menuDiario = this.testing.getMenuColumnsTestingForQuotaMerchantDiario();
      let showDiario = this.testing.getShowColumnsTestingForQuotaMerchantDiario();

      this.updateColumn(menuDiario, 'limitAmount', moneda.simbolo);
      this.updateColumn(showDiario, 'limitAmount', moneda.simbolo);
      this.updateColumn(menuDiario, 'limitAmountAcum', moneda.simbolo);
      this.updateColumn(showDiario, 'limitAmountAcum', moneda.simbolo);

      this.menuColumnsDiario = [...menuDiario];
      this.showColumnsDiario = [...showDiario];

      let menuMensual = this.testing.getMenuColumnsTestingForQuotaMerchantMensual();
      let showMensual = this.testing.getShowColumnsTestingForQuotaMerchantMensual();

      this.updateColumn(menuMensual, 'limitAmountMes', moneda.simbolo);
      this.updateColumn(showMensual, 'limitAmountMes', moneda.simbolo);
      this.updateColumn(menuMensual, 'limitAmountAcumMes', moneda.simbolo);
      this.updateColumn(showMensual, 'limitAmountAcumMes', moneda.simbolo);

      this.menuColumnsMensual = [...menuMensual];
      this.showColumnsMensual = [...showMensual];

    } else {

      this.menuColumnsDiario = this.testing.getMenuColumnsTestingForQuotaMerchantDiario();
      this.showColumnsDiario = this.testing.getShowColumnsTestingForQuotaMerchantMensual();
      this.menuColumnsMensual = this.testing.getMenuColumnsTestingForQuotaMerchantMensual();
      this.showColumnsMensual = this.testing.getShowColumnsTestingForQuotaMerchantMensual();
    }
  }

  validAccessLevel() {
    let role: Role[] = this.tokenStorage.getUser()['listRols'];
    let identifierModule: string = 'mantenimientomc';
    let procesoIndicatorArbolModule: string = 'CupoxComercio';
    let valModifid: string = '2';
    let valFullAccess: string = '3';
    if (
      role[0]
        .listModules
        .filter((item) => item.identifier.trim() == identifierModule)[0]
        .listArbolModulo
        .filter((item) => item.procesoIndicator.trim() == procesoIndicatorArbolModule
          && (item.processNivel == valModifid || item.processNivel == valFullAccess))
        .length > 0
    ) {
      this.isValidAccessLevel = false
    }
  }

  updateColumn(colums: Column[], filter: string, simbol: string) {
    const index01 = colums.findIndex(el => el.columnOfTable === filter);
    colums[index01].display = `${colums[index01].display} (${simbol})`;
    return colums;
  }

  ngOnInit() {
    //this.validAccessLevel();
    this.isValidAccessLevel = this.utils.validAccessLevelDelete('mantenimientomc', 'CupoxComercio');
    this.isValidAccessLevelModify = this.utils.validAccessLevel('mantenimientomc', 'CupoxComercio');
    this.loadCupos();
    //this.loadTransaction()
  }

  deleteDiario() {
    if (this.selectItemsDiario.length > 0) {

      const dialogRef = this.dialog.open(PopupComponent, {
        width: '450px',
        disableClose: true,
        scrollStrategy: new NoopScrollStrategy()
      });
      dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_ELIMINAR;
      dialogRef.componentInstance.body = this.requestUtil.POPUP_BODY_ELIMINAR_QUOTA;
      dialogRef.componentInstance.notCallService = true;

      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          let quotaDel = this.selectItemsDiario[0] as QuotaMerchant;
          quotaDel.applicationId = this.merchant.applicationId;
          quotaDel.merchantId = this.merchant.merchantId;
          this.quotasDiario = this.quotasDiario.filter(el => !this.selectItemsDiario.includes(el));
          const mensualIds = this.selectItemsDiario.map(el => {
            return el.transactionId
          });
          this.quotasMensual = this.quotasMensual.filter(el => !mensualIds.includes(el.transactionId));


          const transactionsTemp = this.selectItemsDiario.map(el => {
            let transaction: TransactionQuota = {} as TransactionQuota;
            transaction.hasQuota = false;
            transaction.transactionDescription = el.transactionDescription;
            transaction.transactionId = el.transactionId;
            transaction.transactionName = el.transactionName;
            return transaction;
          })

          this.transactions = [...new Set([...this.transactions, ...transactionsTemp])];
          this.transactions.sort((a, b) => Number(a.transactionId) - Number(b.transactionId));
          this.selectItemsDiario = [];
        }
      })
    } else {
      const dialogRef = this.dialog.open(PopupComponent, {
        width: "450px",
        disableClose: true,
        scrollStrategy: new NoopScrollStrategy()
      });
      dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_ELIMINAR;
      dialogRef.componentInstance.body = this.requestUtil.POPUP_BODY_GENERIC_ERASE_DELETE;
      dialogRef.componentInstance.isEraseSelectDelete = true;
    }
  }

  deleteMensual() {
    if (this.selectItemsMensual.length > 0) {

      const dialogRef = this.dialog.open(PopupComponent, {
        width: '450px',
        disableClose: true,
        scrollStrategy: new NoopScrollStrategy()
      });
      dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_ELIMINAR;
      dialogRef.componentInstance.body = this.requestUtil.POPUP_BODY_ELIMINAR_QUOTA;
      dialogRef.componentInstance.notCallService = true;
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          let quotaDel = this.selectItemsMensual[0] as QuotaMerchant;
          quotaDel.applicationId = this.merchant.applicationId;
          quotaDel.merchantId = this.merchant.merchantId;
          this.quotasMensual = this.quotasMensual.filter(el => !this.selectItemsMensual.includes(el));
          const diarioIds: string[] = this.selectItemsMensual.map(el => {
            return el.transactionId;
          });
          this.quotasDiario = this.quotasDiario.filter(el => !diarioIds.includes(el.transactionId));

          const transactionsTemp = this.selectItemsMensual.map(el => {
            let transaction: TransactionQuota = {} as TransactionQuota;
            transaction.hasQuota = false;
            transaction.transactionDescription = el.transactionDescription;
            transaction.transactionId = el.transactionId;
            transaction.transactionName = el.transactionName;
            return transaction;
          })

          this.transactions = [...new Set([...this.transactions, ...transactionsTemp])];
          this.transactions.sort((a, b) => Number(a.transactionId) - Number(b.transactionId));
          this.selectItemsMensual = [];
        }
      });
    } else {
      const dialogRef = this.dialog.open(PopupComponent, {
        width: "450px",
        disableClose: true,
        scrollStrategy: new NoopScrollStrategy()
      });
      dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_ELIMINAR;
      dialogRef.componentInstance.body = this.requestUtil.POPUP_BODY_GENERIC_ERASE_DELETE;
      dialogRef.componentInstance.isEraseSelectDelete = true;
    }
  }
  processDataOutPut(data: any) {
    this.selectItems = data;
  }

  processDataOutPutDiario(data: any) {
    this.selectItemsDiario = data;
  }
  processDataOutPutMensual(data: any) {
    this.selectItemsMensual = data;
  }

  processDataOutPutTransaction(data: any) {
    this.selectItemsTransaction = data;
  }

  @ViewChild(DynamictableComponent, { static: false }) set dynamicTable(table: DynamictableComponent) {
    this.table = table;
  }

  @ViewChild(DynamictableComponent, { static: false }) set dynamicTableDiario(tableDiario: DynamictableComponent) {
    this.tableDiario = tableDiario;
  }

  @ViewChild(DynamictableComponent, { static: false }) set dynamicTableMensual(tableMensual: DynamictableComponent) {
    this.tableMensual = tableMensual;
  }

  loadCupos() {

    this.showLoaderData = true;
    this.quotaService.findQuotasByMerchantAndApp(this.merchant.merchantId, this.merchant.applicationId).subscribe(
      data => {

        const dataProcess = data.map(el1 => {
          const estadoDiario = Object.keys(StatusQuotas).find(el2 => StatusQuotas[el2] === el1.action);
          const estadoMensual = Object.keys(StatusQuotas).find(el2 => StatusQuotas[el2] === el1.actionMes);

          if (estadoDiario) {
            el1.action = estadoDiario
          }

          if (estadoMensual) {
            el1.actionMes = estadoMensual
          }

          return el1;
        })

        this.quotasDiario = dataProcess;
        this.quotasDiarioOriginal = [...dataProcess];

        this.quotasMensual = dataProcess;
        // console.log(this.quotas);
      },
      error => {
        this.showData = false;
        this.showLoaderData = false;
        this.showError = true;
      },
      () => {

        this.loadTransaction();
      }

    )
  }

  loadTransaction() {
    this.quotaService.findTransactionByMerchantAndApp(this.merchant.merchantId, this.merchant.applicationId).subscribe(
      data => {
        this.transactions = data.filter(el => !el.hasQuota);
        this.showData = true;
        this.showLoaderData = false;
        //this.transactions = data;
      },
      error => {
        this.showData = false;
        this.showError = true;
        this.showLoaderData = false;
      },
      () => {
        this.registerAudit = new RegisterAudit(this.auditService, ConstantUtils.MODULE_POINT_OF_SALE_CONF, ConstantUtils.MODOPTION_QUOTA_MERCHANT, this.tokenStorage.getFullNameByUser(), this.getDataInputs().merchantId, ConstantUtils.AUDIT_OPTION_TYPE_UPDATE);
        let resultFields: QuotaHeaderExtendInput = this.getDataInputs();
        this.originalQuotaHeaderExtendInput = JSON.parse(JSON.stringify(resultFields));
        this.registerAudit.setEntityOld = this.originalQuotaHeaderExtendInput;
      }
    )
  }

  addCupos() {
    if (this.selectItemsTransaction.length > 0) {
      const listSelect = this.selectItemsTransaction as TransactionQuota[];
      const saveQuotas: QuotaMerchant[] = listSelect.map(el => {
        const quota: QuotaMerchant = {} as QuotaMerchant;
        quota.transactionId = el.transactionId;
        quota.action = '0';
        quota.actionMes = '0';
        quota.limitAmount = 0;
        quota.limitAmountMes = 0;
        quota.limitTimes = 0;
        quota.limitTimesMes = 0;
        quota.merchantId = this.merchant.merchantId;
        quota.applicationId = this.merchant.applicationId;

        quota.transactionDescription = el.transactionDescription;
        quota.transactionName = el.transactionName;
        //quota.limitAmountDolar = 0;
        //quota.limitAmountDolarMes = 0;
        return quota;
      });

      const dataProcess = saveQuotas.map(el1 => {
        const estadoDiario = Object.keys(StatusQuotas).find(el2 => StatusQuotas[el2] === el1.action);
        const estadoMensual = Object.keys(StatusQuotas).find(el2 => StatusQuotas[el2] === el1.actionMes);

        if (estadoDiario) {
          el1.action = estadoDiario
        }

        if (estadoMensual) {
          el1.actionMes = estadoMensual
        }

        return el1;
      })
      this.transactions = this.transactions.filter(el => !listSelect.includes(el));
      this.quotasDiario = [...new Set([...this.quotasDiario, ...dataProcess])];
      this.quotasMensual = [...new Set([...this.quotasMensual, ...dataProcess])];

      this.selectItemsTransaction = [];
    } else {
      const dialogRef = this.dialog.open(PopupComponent, {
        width: "450px",
        disableClose: true,
        scrollStrategy: new NoopScrollStrategy()
      });
      dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_AGREGAR;
      dialogRef.componentInstance.body = this.requestUtil.POPUP_BODY_GENERIC_ADD;
      dialogRef.componentInstance.isEraseSelectDelete = true;
    }
  }

  clickRowDiario(data: any) {

    const matdialogConfig = new MatDialogConfig();
    matdialogConfig.autoFocus = true;
    matdialogConfig.scrollStrategy = new NoopScrollStrategy();
    const dataDiario = data as QuotaMerchant;
    const titulo = `Configurar Cupo por Comercio Diario: ${dataDiario.transactionName}`;
    matdialogConfig.data = {
      data: dataDiario,
      title: titulo,
      periodo: 'diario'
    };

    this.dialogRefDiario = this.dialog.open(QuotasCommerceUpdateComponent, matdialogConfig)
    this.dialogRefDiario.afterClosed().subscribe(
      result => {
        if (result) {
          const updatesQupos = result as QuotaMerchant[];
          let elIndex = this.quotasDiario.findIndex(el => el.transactionId === dataDiario.transactionId);

          const estadoDiario = Object.keys(StatusQuotas).find(el2 => StatusQuotas[el2] === updatesQupos[0].action);
          dataDiario.action = estadoDiario;
          dataDiario.limitAmount = updatesQupos[0].limitAmount;
          dataDiario.limitTimes = updatesQupos[0].limitTimes;
          dataDiario.limitAmountDolar = updatesQupos[0].limitAmountDolar;
          this.quotasDiario[elIndex] = dataDiario;
          this.quotasDiario = [...this.quotasDiario];
        }
      }
    )
  }

  clickRowMensual(data: any) {
    const matdialogConfig = new MatDialogConfig();
    matdialogConfig.autoFocus = true;
    matdialogConfig.scrollStrategy = new NoopScrollStrategy();
    const dataMensual = data as QuotaMerchant;
    const titulo = `Configurar Cupo por Comercio Mensual: ${dataMensual.transactionName}`
    matdialogConfig.data = {
      data: dataMensual,
      title: titulo,
      periodo: 'mensual'
    };

    this.dialogRefDiario = this.dialog.open(QuotasCommerceUpdateComponent, matdialogConfig)
    this.dialogRefDiario.afterClosed().subscribe(
      result => {

        if (result) {
          const updatesQupos = result as QuotaMerchant[];
          let elIndex = this.quotasMensual.findIndex(el => el.transactionId === dataMensual.transactionId);

          const estadoMensual = Object.keys(StatusQuotas).find(el2 => StatusQuotas[el2] === updatesQupos[0].actionMes);
          dataMensual.actionMes = estadoMensual;
          dataMensual.limitAmountMes = updatesQupos[0].limitAmountMes;
          dataMensual.limitTimesMes = updatesQupos[0].limitTimesMes;
          dataMensual.limitAmountDolarMes = updatesQupos[0].limitAmountDolarMes;
          this.quotasMensual[elIndex] = dataMensual;
          this.quotasMensual = [...this.quotasMensual];
        }
      }
    )
  }
  get setCheckBoxColor() {
    return this.sanitizer.bypassSecurityTrustStyle(
      `--checkboxcolor: ${this.checkBoxColor};`
    );
  }

  getDataInputs(): QuotaHeaderInput {
    const saveQuotas: QuotaInput[] = [];
    this.quotasDiario.forEach(el => {
      const quota: QuotaInput = {} as QuotaInput;
      quota.action = StatusQuotas[el.action];
      quota.actionMes = StatusQuotas[el.actionMes];
      quota.transactionId = el.transactionId;
      quota.limitAmount = el.limitAmount;
      quota.limitTimes = el.limitTimes;
      quota.limitAmountMes = el.limitAmountMes;
      quota.limitTimesMes = el.limitTimesMes;
      const dataMensual = this.quotasMensual.find(el2 => el2.transactionId === el.transactionId);
      if (dataMensual) {
        //quota.actionMes = dataMensual.actionMes;
        quota.actionMes = StatusQuotas[dataMensual.actionMes];
        quota.limitAmountMes = dataMensual.limitAmountMes;
        quota.limitTimesMes = dataMensual.limitTimesMes;
      }
      saveQuotas.push(quota);
    });

    const headerQuota: QuotaHeaderInput = {} as QuotaHeaderInput;
    headerQuota.applicationId = this.merchant.applicationId;
    headerQuota.merchantId = this.merchant.merchantId;
    headerQuota.quotas = saveQuotas;

    return headerQuota;
  }

  sendToRequest(comment: string, sendToRequest: number, appSelection: string) {
    let fields: QuotaHeaderExtendInput = this.getDataInputs();
    fields.transactions = this.transactions.filter((item) => this.quotasDiario.filter((item2) => item2.transactionId == item.transactionId).length == 0);
    fields.quotasDiario = this.quotasDiario;
    fields.quotasMensual = this.quotasMensual;

    let tempRA: RequestApproval = { operationType: 0, moduleType: 0, content: "", commentreq: "", coduserreq: "" };
    tempRA.operationType = sendToRequest;
    tempRA.moduleType = UtilsConstant.TM_REQUEST_MANT_QUOTA_MERCHANT;
    tempRA.content = JSON.stringify(fields);
    tempRA.coduserreq = this.tokenStorage.getUser()["id"];
    tempRA.commentreq = comment;
    tempRA.appcurrent = appSelection;

    this.reqAppService.save(tempRA).subscribe(
      (data:RequestApproval) => {
        console.log("exitoso");

        this.registerAudit.setEntityCurrent = this.getDataInputs();
        this.registerAudit.setEntityOld = this.originalQuotaHeaderExtendInput;
        this.registerAudit.setEntityId = "-1";
        this.registerAudit.setIdManc = data.raid;
        this.registerAudit.saveCurrentAudit(Utils.AUDIT_MANCOMUNED_TYPE);

        this.isQuotaSaveProccess = false;
        this.router.navigateByUrl('/config-red/cupo-comercio');
      }, (error) => {
        console.log("Error > Request Approval");
        this.isQuotaSaveProccess = false;
      });
  }

  guardar() {


    console.log("guardar");
    this.registerAudit = new RegisterAudit(this.auditService, ConstantUtils.MODULE_POINT_OF_SALE_CONF, ConstantUtils.MODOPTION_QUOTA_MERCHANT, this.tokenStorage.getFullNameByUser(), this.getDataInputs().merchantId, ConstantUtils.AUDIT_OPTION_TYPE_UPDATE);

    const headerQuota: QuotaHeaderInput = this.getDataInputs();
    if (headerQuota.quotas.length > 0) {

      this.isQuotaSaveProccess = true;

      if (this.tokenStorage.isMancomuned(UtilsConstant.TM_REQUEST_MANT_QUOTA_MERCHANT)) {
        const dialogRef = this.dialog.open(PopupComponent, {
          width: '450px',
          disableClose: true,
        });
        dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_AGREGAR;
        dialogRef.componentInstance.body = this.requestUtil.POPUP_BODY_ADD_QUOTA;
        dialogRef.componentInstance.call = true;
        dialogRef.afterClosed().subscribe(result => {
          console.log(result);
          this.isQuotaSaveProccess = false;
          if (result) {
        const dialogRef = this.dialog.open(PopupCommentComponent, {
          width: "800px",
          disableClose: false,
        });
        dialogRef.componentInstance.title = UtilsConstant.MSG_POPUP_TITLE_CONTENT;
        dialogRef.componentInstance.body = UtilsConstant.MSG_POPUP_COMMENT_CONTENT;
        dialogRef.componentInstance.module = this;
        dialogRef.componentInstance.typeProccess = UtilsConstant.TYPE_REQUEST_EDIT;
        dialogRef.afterClosed().subscribe((result) => {
          // cancel poppup button : true

          this.isQuotaSaveProccess = false;

        });


        }
      });

      } else {

        const dialogRef = this.dialog.open(PopupComponent, {
          width: '450px',
          disableClose: true,
        });

        dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_AGREGAR;
        dialogRef.componentInstance.body = this.requestUtil.POPUP_BODY_ADD_QUOTA;
        dialogRef.componentInstance.service = this.quotaService;
        dialogRef.componentInstance.function = 'saveQuotas';
        dialogRef.componentInstance.parameter = headerQuota;

        dialogRef.afterClosed().subscribe(result => {
          if (result != undefined && result.status != undefined && result.status === 200) {
            this.registerAudit.setEntityCurrent = this.getDataInputs();
            this.registerAudit.setEntityOld = this.originalQuotaHeaderExtendInput;
            this.registerAudit.saveCurrentAudit();

            this.isQuotaSaveProccess = false;
            this.router.navigateByUrl('/config-red/cupo-comercio');
          };
          this.isQuotaSaveProccess = false;
        })
      }


    } else {
      const dialogRef = this.dialog.open(PopupComponent, {
        width: "450px",
        disableClose: true,
        scrollStrategy: new NoopScrollStrategy()
      });
      dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_AGREGAR;
      dialogRef.componentInstance.body = this.requestUtil.POPUP_BODY_GENERIC_ADD;
      dialogRef.componentInstance.isEraseSelectDelete = true;
    }

  }

  // guardar() {
  //   const headerQuota: QuotaHeaderInput = this.getDataInputs();
  //   if (headerQuota.quotas.length > 0) {

  //     if (JSON.stringify(this.quotasDiario) === JSON.stringify(this.quotasDiarioOriginal)) {
  //       const dialogRef = this.dialog.open(PopupComponent, {
  //         width: "450px",
  //         disableClose: true,
  //         scrollStrategy: new NoopScrollStrategy()
  //       });
  //       dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_AGREGAR;
  //       dialogRef.componentInstance.body = this.requestUtil.POPUP_BODY_GENERIC_CHANGES;
  //       dialogRef.componentInstance.isEraseSelectDelete = true;
  //     } else {
  //       this.isQuotaSaveProccess = true;

  //       if (this.tokenStorage.isMancomuned(UtilsConstant.TM_REQUEST_MANT_QUOTA_MERCHANT)) {

  //         const dialogRef = this.dialog.open(PopupCommentComponent, {
  //           width: "800px",
  //           disableClose: false,
  //         });
  //         dialogRef.componentInstance.title = UtilsConstant.MSG_POPUP_TITLE_CONTENT;
  //         dialogRef.componentInstance.body = UtilsConstant.MSG_POPUP_COMMENT_CONTENT;
  //         dialogRef.componentInstance.module = this;
  //         dialogRef.componentInstance.typeProccess = UtilsConstant.TYPE_REQUEST_EDIT;
  //         dialogRef.afterClosed().subscribe((result) => {
  //           // cancel poppup button : true
  //           if (result) {
  //             this.isQuotaSaveProccess = false;
  //           }
  //         });

  //       } else {

  //         const dialogRef = this.dialog.open(PopupComponent, {
  //           width: '450px',
  //           disableClose: true,
  //         });

  //         dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_AGREGAR;
  //         dialogRef.componentInstance.body = this.requestUtil.POPUP_BODY_ADD_QUOTA;
  //         dialogRef.componentInstance.service = this.quotaService;
  //         dialogRef.componentInstance.function = 'saveQuotas';
  //         dialogRef.componentInstance.parameter = headerQuota;

  //         dialogRef.afterClosed().subscribe(result => {
  //           if (result != undefined && result.status != undefined && result.status === 200) {
  //             this.registerAudit.setEntityCurrent = this.getDataInputs();
  //             this.registerAudit.saveCurrentAudit();

  //             this.isQuotaSaveProccess = false;
  //             this.router.navigateByUrl('/config-red/cupo-comercio');
  //           };
  //           this.isQuotaSaveProccess = false;
  //         })
  //       }

  //     }
  //   } else {
  //     const dialogRef = this.dialog.open(PopupComponent, {
  //       width: "450px",
  //       disableClose: true,
  //       scrollStrategy: new NoopScrollStrategy()
  //     });
  //     dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_AGREGAR;
  //     dialogRef.componentInstance.body = this.requestUtil.POPUP_BODY_GENERIC_ADD;
  //     dialogRef.componentInstance.isEraseSelectDelete = true;
  //   }

  // }

  popupDelete(): void {
    this.registerAudit = new RegisterAudit(this.auditService, ConstantUtils.MODULE_POINT_OF_SALE_CONF, ConstantUtils.MODOPTION_QUOTA_MERCHANT, this.tokenStorage.getFullNameByUser(), this.getDataInputs().merchantId, ConstantUtils.AUDIT_OPTION_TYPE_DELETE);
    this.selectItems.push(this.merchant);
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
          this.router.navigateByUrl('/config-red/cupo-comercio');
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
          this.originalQuotaHeaderExtendInput = JSON.parse(JSON.stringify(resultFields));
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
              this.registerAudit.setEntityOld = this.originalQuotaHeaderExtendInput;
              currentAudit.saveCurrentAudit();
              this.router.navigateByUrl('/config-red/cupo-comercio');

              this.selectItems = [];
            } else {
              this.utils.verificarCodigoError(result, this.router);
            }
          });
        }
      );
  }

}
