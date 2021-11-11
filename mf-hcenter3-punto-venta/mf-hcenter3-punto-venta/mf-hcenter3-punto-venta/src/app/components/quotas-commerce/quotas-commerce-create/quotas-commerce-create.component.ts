import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Merchant } from 'src/app/entidades/merchant';
import { MerchantQuota, ApplicationMerchant } from 'src/app/entidades/merchant-quota';
import { QuotaMerchant } from 'src/app/entidades/quota-merchant';
import { QuotaHeaderInput, QuotaInput, QuotaHeaderExtendInput } from 'src/app/entidades/quotaInput';
import { TransactionQuota } from 'src/app/entidades/transaction-quota';
import { QuotaService } from 'src/app/servicios/quota.service';
import { DynamictableComponent } from 'src/app/shared/components/dynamictable/dynamictable.component';
import { PopupCommentComponent } from 'src/app/shared/components/popup-comment/popup-comment.component';
import { PopupListComponent } from 'src/app/shared/components/popup-list/popup-list.component';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { Column } from 'src/app/shared/entities/column';
import { ConstantUtils } from 'src/app/shared/entities/constantUtils';
import { GenericFilter } from 'src/app/shared/entities/genericFilter';
import { HelperMessage } from 'src/app/shared/entities/helperMessage';
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
import { QuotasCommerceUpdateComponent } from '../quotas-commerce-edit/quotas-commerce-update/quotas-commerce-update.component';

enum StatusQuotas {
  Habilitado = "0",
  Deshabilitado = "1"
}


@Component({
  selector: 'app-quotas-commerce-create',
  templateUrl: './quotas-commerce-create.component.html',
  styleUrls: ['./quotas-commerce-create.component.scss']
})
export class QuotasCommerceCreateComponent implements OnInit {


  registerAudit: RegisterAudit;

  MSG_NONE: string = 'none';
  MSG_COMERCIO: string = 'comercio';
  MSG_APLICACION: string = 'aplicacion';
  MSG_TRANSACCION: string = 'transaccion';
  MSG_LIMIT_LOCAL: string = 'limit_local';

  merchant: MerchantQuota = {} as MerchantQuota;
  havePaginator = false;
  quotas: QuotaMerchant[];
  showColumns: Column[];
  menuColumns: Column[];
  //componenteDialog: string = this.utils.EDITAR_CUPO_COMERCIO;
  selectIdValue: string = this.utils.SELECT_MERCHANT_CUPO_TRANSACTION_ID;
  checkBox = this.utils.ENABLE_CHECKBOX;
  arrayOfTable = this.utils.ARRAY_OF_TABLE;
  clearFilter = this.utils.DISABLE_CLEAR_FILTER;
  checkBoxColor = this.utils.BLACK_COLOR;
  animal: string = '';
  name: string = '';
  table: DynamictableComponent;

  errors: HelperMessage[] = [];
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

  transactions: TransactionQuota[];
  showColumnsTransaction: Column[];
  menuColumnsTransaction: Column[];
  selectItemsTransaction = [];

  showData = false;
  showLoaderData = false;
  showError = false;

  //dialogRefDiario: any;
  dialogRefDiario: MatDialogRef<QuotasCommerceUpdateComponent>;

  merchantSelect: GenericFilter = undefined;
  merchantSelectBack: Merchant[] = [];

  aplications: ApplicationMerchant[] = [];
  aplicationSelect: ApplicationMerchant = {} as ApplicationMerchant;

  form: FormGroup;
  isQuotaSaveProccess = false;
  showLoaderData1 = false;

  isValidAccessLevel: boolean = true;
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
    private fb: FormBuilder,
    private appService: ApplicationService) {

    this.menuColumnsDiario = this.testing.getMenuColumnsTestingForQuotaMerchantDiario();
    this.showColumnsDiario = this.testing.getShowColumnsTestingForQuotaMerchantDiario();

    this.menuColumnsMensual = this.testing.getMenuColumnsTestingForQuotaMerchantMensual();
    this.showColumnsMensual = this.testing.getShowColumnsTestingForQuotaMerchantMensual();

    this.menuColumnsTransaction = this.testing.getMenuColumnsTestingForTransactionQuota();
    this.showColumnsTransaction = this.testing.getShowColumnsTestingForTransactionQuota();

    this.form = this.fb.group({
      merchantName: ['', [Validators.required]],
      applicationId: ['', [Validators.required]],
      merchantId: [''],
      profileId: [''],
    });

  }

  ngOnInit() {
    this.registerAudit = new RegisterAudit(this.auditService, ConstantUtils.MODULE_POINT_OF_SALE_CONF, ConstantUtils.MODOPTION_QUOTA_MERCHANT, this.tokenStorage.getFullNameByUser(), "0", ConstantUtils.AUDIT_OPTION_TYPE_CREATE);
    //this.loadCupos();
    //this.loadTransaction()
    this.validAccessLevel();
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

    this.merchant.applicationId = this.form.value['applicationId'];
    this.processMonedaSimbolo();
    this.showLoaderData = true;
    this.showData = false;
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

    }
  }

  updateColumn(colums: Column[], filter: string, simbol: string) {
    const index01 = colums.findIndex(el => el.columnOfTable === filter);
    colums[index01].display = `${colums[index01].display} (${simbol})`;
    return colums;
  }

  loadTransaction() {
    this.quotaService.findTransactionByMerchantAndApp(this.merchant.merchantId, this.merchant.applicationId).subscribe(
      data => {
        console.log(data);
        this.transactions = data.filter(el => !el.hasQuota);
        this.showData = true;
        this.showLoaderData = false;
        //this.transactions = data;
      },
      error => {
        this.showData = false;
        this.showError = true;
        this.showLoaderData = false;
      }
    )
  }

  addCupos() {
    if (this.selectItemsTransaction.length > 0) {
      const listSelect = this.selectItemsTransaction as TransactionQuota[];
      const saveQuotas: QuotaMerchant[] = listSelect.map(el => {

        console.log(el);

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
        quota.limitAmountDolar = 0;
        quota.limitAmountDolarMes = 0;
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
    const titulo = `Configurar Cupo por Comercio Diario: ${dataDiario.transactionName}`
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
    const titulo = `Configurar Cupo por Comercio Mensual: ${dataMensual.transactionName}`;
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

  popupMerchant(): void {
    const dialogRef = this.dialog.open(PopupListComponent, {
      width: '1000px',
      disableClose: true,
    });
    dialogRef.componentInstance.title = "Comercio";
    dialogRef.componentInstance.module = this;
    dialogRef.componentInstance.checkBox = this.utils.DISABLE_CHECKBOX;
    dialogRef.componentInstance.deleteMany = this.utils.DISABLE_CHECKBOX;
    dialogRef.componentInstance.merchantSelection = this.merchantSelectBack;
    dialogRef.componentInstance.componenteDialog = this.utils.EDITAR_POPCOMERCIO;
    dialogRef.componentInstance.uniqueSelect =true;
    dialogRef.componentInstance.checkBox =true;
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  load(comercio: GenericFilter) {
    this.merchantSelect = comercio;
    this.merchant.merchantId = comercio.id;
    this.merchant.merchantName = comercio.name;
    this.merchant.profileId = comercio.profilerId;
    this.form.controls['merchantName'].setValue(comercio.name);
    this.form.controls['merchantId'].setValue(comercio.id);
    this.form.controls['profileId'].setValue(comercio.profilerId);
    this.form.controls['applicationId'].setValue('');
    this.aplications = [];
    this.quotaService.findAppsByMerchant(this.merchant.merchantId).subscribe(
      data => {
        this.aplications = data;
      }
    )
  }

  loadBack(comercio: Merchant[]) {
    this.merchantSelectBack = comercio;
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
        this.registerAudit.setEntityId = '-1';
        this.registerAudit.setIdManc = data.raid;
        this.registerAudit.saveCurrentAudit(Utils.AUDIT_MANCOMUNED_TYPE);

        this.isQuotaSaveProccess = false;
        this.router.navigateByUrl('/config-red/cupo-comercio');
      }, (error) => {
        console.log("Error > Request Approval");
        this.isQuotaSaveProccess = false;
      });


  }

  getMessage(keyMessage: string): string {
    return this.errors.filter(
      (item: HelperMessage) =>
        item.name == keyMessage).length > 0 ? this.errors.filter((item: HelperMessage) => item.name == keyMessage
        )[0].message : this.MSG_NONE;
  }

  validatedForm(): boolean {
    this.errors = [];

    console.log('errors validate');
    //console.log(this.fieldsContenido.getRawValue()['dmrMerchantName']);



    console.log(this.merchant);
    console.log(this.quotasDiario);
    console.log(this.quotasMensual);
    console.log(this.transactions);
    console.log(this.form.getRawValue()["merchantName"]);
    if (this.form.getRawValue()["merchantName"] == undefined || this.form.getRawValue()["merchantName"] == '') {
      this.errors.push({ name: this.MSG_COMERCIO, message: "El campo Comercio se encuentra vacío" });
    }

    if (this.form.getRawValue()["applicationId"] == undefined || this.form.getRawValue()["applicationId"] == '') {
      this.errors.push({ name: this.MSG_APLICACION, message: "Seleccione una Aplicación" });
    }

    // if (this.quotasDiario === undefined) {
    //   this.errors.push({ name: this.MSG_TRANSACCION, message: "Seleccione una Transacción" });
    // }


    /*if (this.merchant) {
      this.errors.push({ name: this.MSG_COMERCIO, message: "El campo Comercio se encuentra vacío" });
    }*/

    console.log(this.errors);

    return this.errors.length == 0 ? true : false;
    //return false;
  }

  guardar() {

    if(this.validatedForm()){
    console.log(this.merchant);

    if(this.quotasDiario){
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
            this.isQuotaSaveProccess = false;
            console.log(result);
            if (result) {

          const dialogRef = this.dialog.open(PopupCommentComponent, {
            width: "800px",
            disableClose: false,
          });
          dialogRef.componentInstance.title = UtilsConstant.MSG_POPUP_TITLE_CONTENT;
          dialogRef.componentInstance.body = UtilsConstant.MSG_POPUP_COMMENT_CONTENT;
          dialogRef.componentInstance.module = this;
          dialogRef.componentInstance.typeProccess = UtilsConstant.TYPE_REQUEST_CREATE;
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
              this.registerAudit.saveCurrentAudit();
              this.isQuotaSaveProccess = false;
              this.router.navigateByUrl('/config-red/cupo-comercio');
            }
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
    }else{
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
}
}
