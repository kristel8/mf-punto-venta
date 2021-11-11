import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ChangeType } from 'src/app/entidades/ChangeType';
import { InnerComponent } from 'src/app/entidades/inner-component';

import { PopupCommentComponent } from 'src/app/shared/components/popup-comment/popup-comment.component';
import { Application } from 'src/app/shared/entities/application';
import { Column } from 'src/app/shared/entities/column';
import { ConstantUtils } from 'src/app/shared/entities/constantUtils';
import { HelperMessage } from 'src/app/shared/entities/helperMessage';
import { MerchantProfile } from 'src/app/shared/entities/merchant-profile';
import { RegisterAudit } from 'src/app/shared/entities/registerAudit';
import { RequestApproval } from 'src/app/shared/entities/requestApproval';
import { Role } from 'src/app/shared/entities/role';
import { TxListField } from 'src/app/shared/entities/tx-list-field';
import { Utils } from 'src/app/shared/entities/utils';
import { UtilsConstant } from 'src/app/shared/entities/utils-constant';
import { ApplicationService } from 'src/app/shared/services/application.service';
import { AuditService } from 'src/app/shared/services/audit.service';
import { ListFieldService } from 'src/app/shared/services/list-field.service';
import { ProfileMerchantService } from 'src/app/shared/services/profileMerchant.service';
import { RequestApprovalService } from 'src/app/shared/services/request-approval.service';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Testing } from 'src/app/utilitarios/testing';

@Component({
  selector: 'app-profile-commerce-create',
  templateUrl: './profile-commerce-create.component.html',
  styleUrls: ['./profile-commerce-create.component.scss']
})
export class ProfileCommerceCreateComponent implements OnInit {

  registerAudit: RegisterAudit;

  MSG_NONE: string = "none";
  MSG_NAME: string = "name";
  MSG_APPLICATION: string = "application";
  MSG_HORARIO_ATENCION: string = "HorarioAtencion";
  MSG_MONTO_MINIMO: string = "montoMinimo";

  errors: HelperMessage[] = [];

  isValidAccessLevel: boolean = true;
  //isValidAccessLevel: boolean = false;
  isMerchantProfileSaveProccess: boolean = false;

  form: FormGroup;
  formInvalid = false;
  isSuccessful = true;
  mapMerchantProfileApp: Map<Application, InnerComponent>;
  listaAplicacion: Application[];
  listPadreAplicacion: number[] = [];
  checkBoxColor = this.utils.BLACK_COLOR;
  selection: SelectionModel<any>;

  listComboBoxDigitacionTarjeta: TxListField[];
  listComboBoxTipoCierre: TxListField[];
  listComboBoxTransaccionDefecto: TxListField[];
  listComboBoxIngresoTarjeta: TxListField[];

  listComboBoxHoraAtencion: string[] = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
  ];
  listComboBoxMinutoAtencion: string[] = ["0000", "1500", "3000", "4500"];

  showColumns: Column[];
  menuColumns: Column[];
  selectIdValue: string = this.utils.SELECT_ID_TRANSACTION_TYPE;
  checkBox = this.utils.ENABLE_CHECKBOX;
  arrayOfTable = [200];
  clearFilter = this.utils.DISABLE_CLEAR_FILTER;
  havePaginator = false;
  flagOrderSelectionItems = true;
  showErrorSave = false;
  msgErrorSave = "Error al crear perfil de comercio";
  typeChanges: ChangeType[];
  limitCharacter = {
    nombrePerfil: 15,
  };

  isPerfilComercioLoad = false;
  dropdownSettings = {};
  selectedItems = [];
  constructor(
    private profileMerchantService: ProfileMerchantService,
    private tokenStorage: TokenStorageService,
    private appService: ApplicationService,
    private reqAppService: RequestApprovalService,
    private auditService: AuditService,
    private dialog: MatDialog,
    public utils: Utils,
    private router: Router,
    private sanitizer: DomSanitizer,
    private transaction: TransactionService,
    private listField: ListFieldService,
    private testing: Testing
  ) {
    this.showColumns = this.testing.getShowColumnsTestinnForTransactionType();
    this.menuColumns = this.testing.getMenuColumnsTestinnForTransactionType();
  }

  ngOnInit() {
    this.registerAudit = new RegisterAudit(
      this.auditService,
      ConstantUtils.MODULE_POINT_OF_SALE_CONF,
      ConstantUtils.MODOPTION_MERCHANT_PROFILE,
      this.tokenStorage.getFullNameByUser(),
      "0",
      ConstantUtils.AUDIT_OPTION_TYPE_CREATE
    );

    this.isPerfilComercioLoad = true;
    this.validAccessLevel();
    this.initSelection();
    this.initMapProfileApp();
    this.getApplication();
    this.initChangeTypes();
    this.initForm();
    this.initComboBox();
    4;
    this.dropdownSettings = {
      singleSelection: false,
      idField: "capApplicationID",
      textField: "dapApplicationName",
      selectAllText: "Seleccionar todos",
      unSelectAllText: "Deselecionar todos",
      itemsShowLimit: 3,
      allowSearchFilter: true,
      searchPlaceholderText: "Buscar",
    };
  }

  validAccessLevel() {
    let role: Role[] = this.tokenStorage.getUser()["listRols"];
    let identifierModule: string = "mantenimientomc";
    let procesoIndicatorArbolModule: string = "prototipo2";
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

  initForm() {
    this.form = new FormGroup({
      cmpprofileId: new FormControl(null, Validators.required),
      cmpModifyUser: new FormControl(this.tokenStorage.getUser().id),
    });
  }

  initSelection() {
    this.selection = new SelectionModel<any>(true, []);
    this.selection.isSelected = this.isChecked.bind(this);
  }

  initMapProfileApp() {
    this.mapMerchantProfileApp = new Map<Application, InnerComponent>();
  }

  initComboBox() {
    this.listField.getField("digitaciontarjeta").subscribe(
      (success) => (this.listComboBoxDigitacionTarjeta = success),
      (error) => console.log(error),
      () => this.verificarFlag()
    );

    this.listField.getField("tipocierrecomercio").subscribe(
      (success) => (this.listComboBoxTipoCierre = success),
      (error) => console.log(error),
      () => this.verificarFlag()
    );

    this.listField.getField("TrxDefault").subscribe(
      (success) => (this.listComboBoxTransaccionDefecto = success),
      (error) => console.log(error),
      () => this.verificarFlag()
    );

    this.listField.getField("TipoIngresoTarjetaConfirm").subscribe(
      (success) => (this.listComboBoxIngresoTarjeta = success),
      (error) => console.log(error),
      () => this.verificarFlag()
    );
  }

  initTransactionByApp(appID: string) {
    this.transaction.getTransactionByApp(appID).subscribe();
  }

  verificarFlag() {
    if (
      this.listComboBoxIngresoTarjeta !== undefined &&
      this.listComboBoxTransaccionDefecto !== undefined &&
      this.listComboBoxTipoCierre !== undefined &&
      this.listComboBoxDigitacionTarjeta !== undefined &&
      this.listaAplicacion !== undefined
    ) {
      this.isSuccessful = false;
    }
  }

  sendToRequest(comment: string, sendToRequest: number, appSelection: string) {
    let fields: MerchantProfile = this.getMerchantProfileApplication();

    let tempRA: RequestApproval = {
      operationType: 0,
      moduleType: 0,
      content: "",
      commentreq: "",
      coduserreq: "",
    };
    tempRA.operationType = sendToRequest;
    tempRA.moduleType = UtilsConstant.TM_REQUEST_PROFILER_MERCHANT;
    tempRA.content = JSON.stringify(fields);
    tempRA.coduserreq = this.tokenStorage.getUser()["id"];
    tempRA.commentreq = comment;
    tempRA.appcurrent = appSelection;

    this.reqAppService.save(tempRA).subscribe(
      (data: RequestApproval) => {
        console.log("exitoso");

        let nerchantProfile: MerchantProfile;
        nerchantProfile = this.getMerchantProfileApplication();

        this.registerAudit.setEntityCurrent = nerchantProfile;
        this.registerAudit.setEntityId = nerchantProfile.cmpprofileId;
        this.registerAudit.setIdManc = data.raid;
        this.registerAudit.saveCurrentAudit(Utils.AUDIT_MANCOMUNED_TYPE);
      },
      (error) => console.log("Error > Request Approval")
    );

    this.isMerchantProfileSaveProccess = false;
    this.showErrorSave = false;
    this.router.navigate(["/config-red/perfil-comercio"]);
  }


  async onSubmit(f: NgForm) {
    console.log(this.mapMerchantProfileApp);
    let nerchantProfile: MerchantProfile;
    nerchantProfile = this.getMerchantProfileApplication();
    //console.log("test", nerchantProfile);

    let resLeg = {
      message: "1"
    }
    if (nerchantProfile.cmpprofileId != null) {
      resLeg = await this.profileMerchantService.checkDuplicates(nerchantProfile).toPromise();
    }

    if(resLeg.message === "0") {
      this.utils.toastDanger('Ya existe un perfil con este nombre: ' + nerchantProfile.cmpprofileId);
    }

    if (this.validatedForm(nerchantProfile) && resLeg.message=="1") {
      if (f.invalid) {
        this.formInvalid = true;
      } else if (this.verificarAppSelec()) {
        //else {

        this.isMerchantProfileSaveProccess = true;
        this.showErrorSave = false;

        if (
          this.tokenStorage.isMancomuned(
            UtilsConstant.TM_REQUEST_PROFILER_MERCHANT
          )
        ) {
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
            UtilsConstant.TYPE_REQUEST_CREATE;
          dialogRef.afterClosed().subscribe((result) => {
            // cancel poppup button : true
            if (result) {
              this.isMerchantProfileSaveProccess = false;
            }
          });
        } else {
          this.profileMerchantService.create(nerchantProfile).subscribe(
            (success) => {
              this.isMerchantProfileSaveProccess = false;
              this.showErrorSave = false;

              this.registerAudit.setEntityCurrent = nerchantProfile;
              this.registerAudit.setEntityId = nerchantProfile.cmpprofileId;
              this.registerAudit.saveCurrentAudit();

              this.router.navigate(["/config-red/perfil-comercio"]);
            },
            (error) => {
              /*
              const alertError: MatDialogRef<PopupComponent> = this.dialog.open(PopupComponent, {
                width: "450px",
                disableClose: true
              })
              alertError.componentInstance.title = "Error";
              alertError.componentInstance.body = error.error.message;
              alertError.componentInstance.isEraseSelectDelete =  true;
              */

              this.utils.toastDanger(error.error.message);

              this.showErrorSave = true;
              if (error["error"] && error["error"]["message"]) {
                const errorMsg = error["error"]["message"];
                this.msgErrorSave = errorMsg;
              }
              this.isMerchantProfileSaveProccess = false;
              this.utils.verificarCodigoError(error, this.router);
              //this.router.navigate(['/config-red/perfil-comercio']);
            }
          );
        }
      }
    }
  }

  verificarAppSelec(): boolean {
    // if (this.selection.hasValue()) {
    if (this.selectedItems.length > 0) {
      return true;
    }
    //alert('Debe Seleccionar una aplicación')
    //return false;
    this.errors.push({
      name: this.MSG_APPLICATION,
      message: "Debe seleccionar al menos una aplicacion.",
    });

    return this.errors.length == 0 ? true : false;
  }

  getMerchantProfileApplication(): MerchantProfile {
    const nerchantProfile = new MerchantProfile();
    nerchantProfile.cmpprofileId = this.form["cmpprofileId"];
    nerchantProfile.cmpModifyUser = this.tokenStorage.getUser().id;
    nerchantProfile.listMerchantProfileApplication =
      this.getListMerchantProfileApp(
        nerchantProfile.cmpModifyUser,
        nerchantProfile.cmpprofileId
      );

    console.log(nerchantProfile);
    return nerchantProfile;
  }

  getListMerchantProfileApp(userCode: string, profileID: string): any[] {
    const arrayRet = [];
    this.mapMerchantProfileApp.forEach(
      (value: InnerComponent, key: Application) => {
        const mpa = value.getOutPutData(
          userCode,
          profileID,
          key.capApplicationID
        );
        arrayRet.push(mpa);
      }
    );
    return arrayRet;
  }

  getApplication() {
    this.appService.getApps().subscribe(
      (success: Application[]) => {
        // this.parseApp(success);
        this.parseApp(
          success.filter(
            (item) =>
              this.tokenStorage
                .getAppByRol()
                .filter(
                  (item2) => item2.capApplicationID == item.capApplicationID &&  item.capApplicationID != "MAIN"
                ).length > 0
          )
        );
        this.isPerfilComercioLoad = false;
      },
      (error) => {
        console.log("Error en Servicio Applicacion");
        this.isPerfilComercioLoad = false;
        this.utils.verificarCodigoError(error, this.router);
      },
      () => this.verificarFlag()
    );
  }

  parseApp(apps) {
    this.listaAplicacion = apps;
    this.listaAplicacion.forEach((app: Application, index: number) => {
      if ((index + 1) % 3 === 0) {
        this.listPadreAplicacion.push(index);
      } else if (index + 1 === this.listaAplicacion.length) {
        this.listPadreAplicacion.push(index);
      }
    });
  }

  get setCheckBoxColor() {
    return this.sanitizer.bypassSecurityTrustStyle(
      `--checkboxcolor: ${this.checkBoxColor};
      --margin: 0px !important;`
    );
  }

  getDisplay(indexForLoop, index) {
    if (index > indexForLoop) {
      return { display: "none" };
    } else if (index <= indexForLoop - 3) {
      return { display: "none" };
    }
    if ((indexForLoop + 1) % 3 !== 0) {
      if (index <= indexForLoop - ((indexForLoop + 1) % 3)) {
        return { display: "none" };
      }
    }
    if (
      this.listaAplicacion[index] !== undefined &&
      this.listaAplicacion[index].capApplicationID === "MAIN"
    ) {
      this.listaAplicacion.splice(index);
      return { display: "none" };
    }
  }

  masterToggle() {
    this.isAllSelected()
      ? this.clearAll()
      : this.listaAplicacion.forEach((app) => this.select(app));
  }

  clearAll() {
    this.selection.clear();
    this.initMapProfileApp();
  }

  select(app: Application) {
    this.selection.select(app);
    this.selectIntoMap(app);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.listaAplicacion.length;
    return numSelected === numRows;
  }

  selCheckBoxUnit(app: Application) {
    // this.selection.toggle(app);
    this.selectIntoMap(app);
  }

  selectIntoMap(app: Application) {
    // if (this.selection.isSelected(app)) {
    // this.mapMerchantProfileApp.set(app, new InnerComponent([], undefined));
    this.transaction.getTransactionByApp(app.capApplicationID).subscribe(
      (success) => {
        this.mapMerchantProfileApp.set(
          app,
          new InnerComponent(success, undefined)
        );
        console.log();
      },
      (error) => this.selection.toggle(app)
    );
    // } else if (!this.selection.isSelected(app)) {
    // this.mapMerchantProfileApp.delete(app);
    // }
  }

  isChecked(app: any): boolean {
    const found = this.selection.selected.find(
      (el) => el.capApplicationID === app.capApplicationID
    );
    if (found) {
      return true;
    }
    return false;
  }

  verificarArray(): boolean {
    const array = Array.from(this.mapMerchantProfileApp.keys());
    if (array.length > 0) {
      return true;
    }
    return false;
  }

  validatedForm(nerchantProfile: MerchantProfile): boolean {
    this.errors = [];
    if (
      this.form["cmpprofileId"] == undefined ||
      this.form["cmpprofileId"] == ""
    ) {
      this.errors.push({
        name: this.MSG_NAME,
        message: "El campo Nombre del Perfil se encuentra vacío",
      });
    }

    // if (this.mapMerchantProfileApp.size == 0) {
    if (this.selectedItems.length === 0) {
      this.errors.push({
        name: this.MSG_APPLICATION,
        message: "Debe Seleccionar al Menos una Aplicación.",
      });
    }

    nerchantProfile.listMerchantProfileApplication.forEach((element) => {
      if (element.cmareqHourOperation === "0") {
        console.log(element);
        let desde: number = +element.cmahourOperationFrom;
        let hasta: number = +element.cmahourOperationTo;
        console.log(desde);
        console.log(hasta);

        if (desde >= hasta) {
          console.log("error desde hasta");
          this.errors.push({
            name: this.MSG_HORARIO_ATENCION + element.cmaapplicationID,
            message:
              'Debe Seleccionar un Horario de atención donde el Horario "Hasta" sea mayor que "Desde".',
          });
        }
      }
      console.log(element)
      if( element.cmareqMinimumAmount == "0" && element.nmaminAmountLocal == "0.00") {
        console.log("error monto mínimo");
        this.errors.push({
          name: this.MSG_MONTO_MINIMO + element.cmaapplicationID,
          message:
            'El monto en moneda local debe ser superior a cero.',
        });
      }
    });

    if(this.errors.length != 0){
      this.utils.toastDanger(this.errors[0].message);
    }

    return this.errors.length == 0 ? true : false;
  }

  getMessage(keyMessage: string): string {
    return this.errors.filter((item: HelperMessage) => item.name == keyMessage)
      .length > 0
      ? this.errors.filter((item: HelperMessage) => item.name == keyMessage)[0]
          .message
      : this.MSG_NONE;
  }

  initChangeTypes() {
    this.appService.getChangeTypes().subscribe((data) => {
      this.typeChanges = data;
    });
  }
  calcularMonedaExtranjera(moneda: string, appID: string): string {
    const filterChangeType: ChangeType[] = this.typeChanges
      .filter(
        (el) =>
          el.aplicacion === appID &&
          el.transactionType === "1" &&
          el.status === "0"
      )
      .sort((a, b) => b.processDate - a.processDate);
    if (filterChangeType && filterChangeType.length > 0) {
      const changeType = filterChangeType[0];
      const montoDolar = +moneda / changeType.changeType;
      return montoDolar.toFixed(2);
    }
    return moneda.toString();
  }

  putCursorEnd(e) {
    const end = e.target;
    const len = end.value.length;

    if (end.setSelectionRange) {
      end.focus();
      end.setSelectionRange(len, len);
    } else if (end.createTextRange) {
      var t = end.createTextRange();
      t.collapse(true);
      t.moveEnd("character", len);
      t.moveStart("character", len);
      t.select();
    }
  }

  onParamSelect(event) {
    this.selectIntoMap(this.getApp(event.capApplicationID));
    this.selectedItems.push(event);
    // console.log(this.selectedItems);
  }

  onParamDeselect(event) {
    this.mapMerchantProfileApp.delete(this.getApp(event.capApplicationID));
    const index = this.selectedItems.indexOf(5);
    if (index > -1) this.selectedItems.splice(index, 1);
  }

  onParamSelectAll(event) {
    this.listaAplicacion.forEach((app) => {
      this.onParamSelect(app);
    });
    console.log(event);
  }

  onParamDeselectAll(event) {
    // console.log(event);
    this.initMapProfileApp();
  }

  getApp(appId): Application {
    return this.listaAplicacion.filter(
      (app) => app.capApplicationID === appId
    )[0];
  }
}

