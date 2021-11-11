import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AdicionalInformation } from 'src/app/entidades/AdicionalInformation';
import { FloorLimit } from 'src/app/entidades/floor-limit';
import { Merchant } from 'src/app/entidades/merchant';
import { MerchantProfile } from 'src/app/entidades/merchant-profile';
import { MerchantProfileApplication } from 'src/app/entidades/merchant-profile-application';
import { Terminal } from 'src/app/entidades/terminal';
import { ProfileMerchantService } from 'src/app/servicios/profileMerchant.service';
import { TerminalService } from 'src/app/servicios/terminal.service';
import { PopupCommentComponent } from 'src/app/shared/components/popup-comment/popup-comment.component';
import { PopupListComponent } from 'src/app/shared/components/popup-list/popup-list.component';
import { Application } from 'src/app/shared/entities/application';
import { Column } from 'src/app/shared/entities/column';
import { ConstantUtils } from 'src/app/shared/entities/constantUtils';
import { GenericFilter } from 'src/app/shared/entities/genericFilter';
import { HelperMessage } from 'src/app/shared/entities/helperMessage';
import { RegisterAudit } from 'src/app/shared/entities/registerAudit';
import { RequestApproval } from 'src/app/shared/entities/requestApproval';
import { Role } from 'src/app/shared/entities/role';
import { TransactionType } from 'src/app/shared/entities/transaction-type';
import { TxListField } from 'src/app/shared/entities/tx-list-field';
import { Utils } from 'src/app/shared/entities/utils';
import { UtilsConstant } from 'src/app/shared/entities/utils-constant';
import { ApplicationService } from 'src/app/shared/services/application.service';
import { AuditService } from 'src/app/shared/services/audit.service';
import { ListFieldService } from 'src/app/shared/services/list-field.service';
import { RequestApprovalService } from 'src/app/shared/services/request-approval.service';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';
import { TransactionService } from 'src/app/shared/services/transaction.service';
import { Testing } from 'src/app/utilitarios/testing';

@Component({
  selector: 'app-terminal-create',
  templateUrl: './terminal-create.component.html',
  styleUrls: ['./terminal-create.component.scss']
})
export class TerminalCreateComponent implements OnInit {

  registerAudit: RegisterAudit;

  isValidAccessLevel: boolean = true;
  isTerminalSaveProccess: boolean = false;

  notSubmit: boolean = false;
  isProfileMerchantProccess: boolean = false;
  profileMerchantCurrent: string = '';

  listComboBoxDigitacionTarjeta: TxListField[];
  listComboBoxTipoCierre: TxListField[];
  listComboBoxTransaccionDefecto: TxListField[];
  listComboBoxIngresoTarjeta: TxListField[];

  listaAplicacion: Application[] = [];

  innerInformation: Map<string, AdicionalInformation>;

  listTransactionType: TransactionType[] = [];
  listTransactionAll: TransactionType[] = [];
  listTransactionAllTable: TransactionType[] = [];
  selectItems = [];
  showColumns: Column[];
  menuColumns: Column[];
  selectIdValue: string = this.utils.SELECT_ID_TRANSACTION_TYPE;
  checkBox = this.utils.ENABLE_CHECKBOX;
  arrayOfTable = [200];
  clearFilter = this.utils.DISABLE_CLEAR_FILTER;
  havePaginator = false;

  merchantSelect: GenericFilter = undefined;
  merchantSelectBack: Merchant[] = [];
  viewMerchantName: string = '';

  testLista: string[] = [];
  sendListApp: string[] = [];
  isComplete: boolean = false;


  isDisable: boolean = false;
  readOnlyCheck: boolean = true;

  errors: HelperMessage[] = [];

  MSG_NONE: string = 'none';
  MSG_MODELO: string = 'msg_modelo';
  MSG_STATUS: string = 'msg_status';
  MSG_MERCHANT: string = 'msg_merchant';
  MSG_MOTIVO: string = 'msg_motivo';
  MSG_DESCRIPCION: string = 'msg_descripcion';
  MSG_SERIAL: string = 'msg_serial';
  MSG_IS_SERIAL: string = 'msg_is_serial';
  MSG_TIPO: string = 'msg_tipo';
  MSG_APP: string = 'msg_app'

  //Variables Para Estatus de Terminal
  protected statusTerminal: GenericFilter[];
  public statusTerminalCtrl: FormControl = new FormControl();
  public statusTerminalFilterCtrl: FormControl = new FormControl();
  public filteredStatusTerminal: ReplaySubject<GenericFilter[]> = new ReplaySubject<GenericFilter[]>(1);
  @ViewChild('singleSelectST', { static: false }) singleSelectST: MatSelect;
  protected _onDestroyStatusTerminal = new Subject<void>();

  //Variables Para Motivo de Terminal
  protected motivoTerminal: GenericFilter[];
  public motivoTerminalCtrl: FormControl = new FormControl();
  public motivoTerminalFilterCtrl: FormControl = new FormControl();
  public filteredMotivoTerminal: ReplaySubject<GenericFilter[]> = new ReplaySubject<GenericFilter[]>(1);
  @ViewChild('singleSelectMT', { static: false }) singleSelectMT: MatSelect;
  protected _onDestroyMotivoTerminal = new Subject<void>();


  //Variables Para Tipo de Terminal
  protected tipoTerminal: GenericFilter[];
  public tipoTerminalCtrl: FormControl = new FormControl();
  public tipoTerminalFilterCtrl: FormControl = new FormControl();
  public filteredTipoTerminal: ReplaySubject<GenericFilter[]> = new ReplaySubject<GenericFilter[]>(1);
  @ViewChild('singleSelectTT', { static: false }) singleSelectTT: MatSelect;
  protected _onDestroyTipoTerminal = new Subject<void>();

  //Variables Para Modelo de Terminal
  protected modeloTerminal: GenericFilter[];
  public modeloTerminalCtrl: FormControl = new FormControl();

  public multicomercioCtrl:FormControl = new FormControl();
  public amountPaidCtrl:FormControl = new FormControl(true);//INCIDENCIA EL2709

  public modeloTerminalFilterCtrl: FormControl = new FormControl();
  public filteredModeloTerminal: ReplaySubject<GenericFilter[]> = new ReplaySubject<GenericFilter[]>(1);
  @ViewChild('singleSelectModT', { static: false }) singleSelectModT: MatSelect;
  protected _onDestroyModeloTerminal = new Subject<void>();

  //Variables Para Cadena de Comercio
  /*
  protected merchant: GenericFilter[];
  public merchantCtrl: FormControl = new FormControl();
  public merchantFilterCtrl: FormControl = new FormControl();
  public filteredMerchant: ReplaySubject<GenericFilter[]> = new ReplaySubject<GenericFilter[]>(1);
  @ViewChild('singleSelectMer', { static:false }) singleSelectMer: MatSelect;
  protected _onDestroyMerchant = new Subject<void>();*/

  get setCheckBoxColor() {
    return this.sanitizer.bypassSecurityTrustStyle(
      `--checkboxcolor: ${this.checkBoxColor};`
    );
  }

  fieldsContenido: FormGroup;

  checkBoxColor = this.utils.BLACK_COLOR;

  limitCharacter = {
    description: 64
  }

  isLoadPantalla = false;

  appsSelected: string[];
  constructor(

    private terminalService: TerminalService,
    private merchantProfileService: ProfileMerchantService,
    private transaction: TransactionService,
    private listField: ListFieldService,
    private auditService: AuditService,
    private tokenStorage: TokenStorageService,
    private appService: ApplicationService,
    private reqAppService: RequestApprovalService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
    public utils: Utils,
    private router: Router,
    private testing: Testing) {

    this.fieldsContenido = new FormGroup({
      //multicomercio: new FormControl(false),
      description: new FormControl(null),
      numSerial: new FormControl(null),
      perfilComercio: new FormControl(null),
      ticket1Ctrl: new FormControl(null),
      ticket2Ctrl: new FormControl(null),
    });

    this.fieldsContenido.addControl("multimoneda", new FormControl(false));
    this.fieldsContenido.addControl("ultimosDigitos", new FormControl(false));
    this.fieldsContenido.addControl("requestDNI", new FormControl(false));
    this.fieldsContenido.addControl("CashBack", new FormControl(false));
    this.fieldsContenido.addControl("multiProducto", new FormControl(false));
    this.fieldsContenido.addControl("horaAtencio", new FormControl(false));
    this.fieldsContenido.addControl("alarmaMM", new FormControl(false));
    this.fieldsContenido.addControl("alarmaSMS", new FormControl(false));
    this.fieldsContenido.addControl("alarmaMail", new FormControl(false));

    this.showColumns = this.testing.getShowColumnsTestinnForTerminalTransactionType();
    this.menuColumns = this.testing.getMenuColumnsTestinnForTerminalTransactionType();
  }

  validAccessLevel() {
    let role: Role[] = this.tokenStorage.getUser()['listRols'];
    let identifierModule: string = 'mantenimientomc';
    let procesoIndicatorArbolModule: string = 'terminal';
    let valModifid: string = '2';
    let valFullAccess: string = '3';


    if (
      role[0]
        .listModules
        .filter((item) => item.identifier == identifierModule)[0]
        .listArbolModulo
        .filter((item) => item.procesoIndicator.trim() == procesoIndicatorArbolModule
          && (item.processNivel == valModifid || item.processNivel == valFullAccess))
        .length > 0
    ) {
      this.isValidAccessLevel = false;
    }
  }


  ngOnInit() {


    this.registerAudit = new RegisterAudit(this.auditService, ConstantUtils.MODULE_POINT_OF_SALE_CONF, ConstantUtils.MODOPTION_TERMINAL, this.tokenStorage.getFullNameByUser(), "0", ConstantUtils.AUDIT_OPTION_TYPE_CREATE);

    this.isLoadPantalla = true;

    this.validAccessLevel();

    this.initComboBox();

    this.transaction.getTransaction().subscribe((item: TransactionType[]) => this.listTransactionAll = item, () => console.log("Error Transation"));

    //Obtienes Los estatus del Terminal
    this.terminalService.getStateTerminal().subscribe(
      (success: TxListField[]) => {
        this.statusTerminal = success.map((val) => {
          return {
            id: val["valueCode"],
            name: val["description"]
          }
        });
        this.filteredStatusTerminal.next(this.statusTerminal.slice());
      }, (error) => console.log("Error en StateTerminal")
    );

    //Obtienes Los Motivos del Terminal
    this.terminalService.getMotivoTerminal().subscribe(
      (success: TxListField[]) => {
        this.motivoTerminal = success.map((val) => {
          return {
            id: val["valueCode"],
            name: val["description"]
          }
        });

        this.filteredMotivoTerminal.next(this.motivoTerminal.slice());

      }, (error) => console.log("Error en StateTerminal")
    );

    //Obtienes Los Tipo del Terminal
    this.terminalService.getTipoTerminal().subscribe(
      (success: TxListField[]) => {
        this.tipoTerminal = success.map((val) => {
          return {
            id: val["valueCode"],
            name: val["description"]
          }
        });

        this.filteredTipoTerminal.next(this.tipoTerminal.slice());

      }, (error) => console.log("Error en StateTerminal")
    );

    //Obtienes Los Modelo del Terminal
    this.terminalService.getModeloTerminal().subscribe(
      (success: TxListField[]) => {
        this.modeloTerminal = success.map((val) => {
          return {
            id: val["valueCode"],
            name: val["description"]
          }
        });

        this.filteredModeloTerminal.next(this.modeloTerminal.slice());
        this.isLoadPantalla = false;

      }, (error) => {
        console.log("Error en StateTerminal");
        this.isLoadPantalla = false;
      }
    );

    //Se obtiene el listado de las Aplicaciones
    this.appService.getApps().subscribe(
      (success: Application[]) => {
        this.listaAplicacion = success.filter((item: Application) => item.capApplicationID != 'MAIN');
      }, (error) => {
        console.log("Error en Servicio Applicacion")
      }
    );

    //Obtienes Los Comercios
    /*
    this.merchantService.getAllMerchants().subscribe(
      (success:Merchant[])=>{

        //console.log("Comercio");
        //console.log(JSON.stringify(success));

        this.merchant = success.map((val)=>{
          return {
            id:val["cmrMerchantId"],
            name:val["dmrMerchantName"],
            profilerId:val["cmrProfileId"]
          }
        });

        this.merchantCtrl.setValue(this.merchant);
        this.filteredMerchant.next(this.merchant.slice());
        this.merchantFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyMerchant))
        .subscribe(() => {
          this.filterMerchant();
        });

      },(error)=>console.log("Error en StateTerminal")
    );*/
  }

  appsChange(change: MatSelectChange) {
    this.appsSelected = change.value;
  }

  loadBack(comercio: Merchant[]) {
    this.merchantSelectBack = comercio;
    this.viewMerchantName = comercio[0].dmrMerchantName;
  }

  load(comercio: GenericFilter) {
    this.testLista = [];
    this.merchantSelect = comercio;
    this.innerInformation = new Map<string, AdicionalInformation>();

    this.isProfileMerchantProccess = true;
    this.merchantProfileService.getById(comercio.profilerId).subscribe(
      (success: MerchantProfile) => {

        // console.log("App Size: "+success.listMerchantProfileApplication.length);
        // console.log("App Details: ");
        // console.log(JSON.stringify(success.listMerchantProfileApplication));

        this.isProfileMerchantProccess = false;
        this.profileMerchantCurrent = success.cmpprofileId;
        success.listMerchantProfileApplication.forEach((mpa: MerchantProfileApplication) => {


          let listCurrentTrans: TransactionType[] = [];
          let listCurrentTransSel: TransactionType[] = [];

          mpa.listFloorLimit.forEach((fl: FloorLimit) => {
            if (this.listTransactionAll.filter((item: TransactionType) => item.ctttransactionId == fl.cfltransactionId && item.cttaplicacion == fl.cflaplicacion).length > 0) {
              listCurrentTransSel.push(this.listTransactionAll.filter((item: TransactionType) => item.ctttransactionId == fl.cfltransactionId && item.cttaplicacion == fl.cflaplicacion)[0])
            }
          });

          listCurrentTrans = this.listTransactionAll.filter((item: TransactionType) => item.cttaplicacion == mpa.cmaapplicationID);

          this.innerInformation.set(
            this.listaAplicacion.filter((item) => item.capApplicationID == mpa.cmaapplicationID)[0].capApplicationID,
            new AdicionalInformation(listCurrentTrans, listCurrentTransSel)
          );


          this.appsSelected = [];

          //console.log('innerInformation', this.innerInformation);

        });
      },
      error => {
        this.isProfileMerchantProccess = false;
        console.error(error);
      }
    );
  }

  preProccessRequest(): Terminal {
    let terminalOper: Terminal = new Terminal();
    terminalOper.ctrModel = this.modeloTerminalCtrl.value;
    terminalOper.ctrStatus = this.statusTerminalCtrl.value;
    terminalOper.ctrStatusChangeReason = this.motivoTerminalCtrl.value;
    terminalOper.ctrMerchantId = this.merchantSelectBack[0].cmrMerchantId;
    terminalOper.cmrProfileId = this.merchantSelectBack[0].cmrProfileId;

    terminalOper.ctrAplicacion = this.appsSelected.join(';');

    terminalOper.dtrDescription = this.fieldsContenido.getRawValue()['description'];
    terminalOper.dtrTerminalSN = this.fieldsContenido.getRawValue()['numSerial'];
    terminalOper.ctrType = this.tipoTerminalCtrl.value;

    terminalOper.ctrHFR1 = this.fieldsContenido.getRawValue()['ticket1Ctrl'];
    terminalOper.ctrHFR2 = this.fieldsContenido.getRawValue()['ticket2Ctrl'];

    if(this.amountPaidCtrl.value){
      terminalOper.ctrAmountPaid = "0";
    }else{
      terminalOper.ctrAmountPaid  = "1";
    }

    terminalOper.user=this.tokenStorage.getUser()["id"]

    if(this.multicomercioCtrl.value){
      terminalOper.multmerchant = "0";
    }else{
      terminalOper.multmerchant = "1";
    }

    return terminalOper;
  }

  sendToRequest(comment: string, sendToRequest: number, appSelection: string) {
    let fields: Terminal = this.preProccessRequest();

    let tempRA: RequestApproval = { operationType: 0, moduleType: 0, content: "", commentreq: "", coduserreq: "" };
    tempRA.operationType = sendToRequest;
    tempRA.moduleType = UtilsConstant.TM_REQUEST_TERMINAL;
    tempRA.content = JSON.stringify(fields);
    tempRA.coduserreq = this.tokenStorage.getUser()["id"];
    tempRA.commentreq = comment;
    tempRA.appcurrent = appSelection;

    this.reqAppService.save(tempRA).subscribe(
      (data:RequestApproval) => {
        console.log("exitoso");

        let terminalOper: Terminal = this.preProccessRequest();

        this.registerAudit.setEntityCurrent = terminalOper;
        this.registerAudit.setEntityId = "-1";
        this.registerAudit.setIdManc = data.raid;
        console.log("saveCurrentAudit-1", this.registerAudit);
        this.registerAudit.saveCurrentAudit(Utils.AUDIT_MANCOMUNED_TYPE);

        // this.registerAudit.saveCurrentAuditObservable(Utils.AUDIT_MANCOMUNED_TYPE).subscribe(
        //   (res) => {
        //     //this.utils.toastSuccess('Creación satisfactoria');
        //     this.isTerminalSaveProccess = false;
        //     this.router.navigateByUrl("/config-red/terminal");
        //   },
        //   (err) => {
        //     //toast duplicado
        //     this.isTerminalSaveProccess = false;
        //     if (err.error.localizedMessage == "3") {
        //       this.utils.toastDanger('Ya existe este terminal asociado a este comercio');
        //     } else {
        //       this.utils.toastWarning('Error');
        //     }
        //   }
        // );

      }, (error) => console.log("Error > Request Approval"), () => this.router.navigateByUrl("/config-red/terminal"));


    // this.isTerminalSaveProccess = false;
    // this.router.navigateByUrl("/config-red/terminal");
  }

  async guardar() {
   // console.log("this.notSubmit",this.notSubmit);
    if (true) {

      this.errors = [];

      console.log('modeloTerminalCtrl', this.modeloTerminalCtrl)
      if (!this.modeloTerminalCtrl.value) {
        this.errors.push({ name: this.MSG_MODELO, message: "Debe seleccionar un Modelo." });
      }

      if (!this.statusTerminalCtrl.value) {
        this.errors.push({ name: this.MSG_STATUS, message: "Debe seleccionar un Estado." });
      }

      if (!this.motivoTerminalCtrl.value) {
        this.errors.push({ name: this.MSG_MOTIVO, message: "Debe seleccionar un Motivo." });
      }

      if (this.merchantSelectBack.length == 0) {
        this.errors.push({ name: this.MSG_MERCHANT, message: "Debe seleccionar un Comercio." });
      }
      /*
      if(this.merchantCtrl.value.id == undefined){
        this.errors.push({name:this.MSG_MERCHANT,message:"Debe seleccionar un Comercio."});
      }*/

      if (this.fieldsContenido.getRawValue()['description'] == null) {
        this.errors.push({ name: this.MSG_DESCRIPCION, message: "Debe indicar una Descripción." });
      }

      if (this.fieldsContenido.getRawValue()['numSerial'] == undefined || this.fieldsContenido.getRawValue()['numSerial'].trim() == "") {
        this.errors.push({ name: this.MSG_SERIAL, message: "Debe indicar un número de serie." });
      }

      if (this.errors.filter((item) => item.name == this.MSG_SERIAL).length > 0 || ((this.fieldsContenido.getRawValue()['numSerial'] == null ? '' : this.fieldsContenido.getRawValue()['numSerial']) as string).length < 8) {
        this.errors.push({ name: this.MSG_SERIAL, message: "El campo número de serie del Terminal debe contener 8 dígitos." });
      }

      if (!this.tipoTerminalCtrl.value) {
        this.errors.push({ name: this.MSG_TIPO, message: "Debe seleccionar un tipo." });
      }

      if (!this.appsSelected || this.appsSelected.length < 1) {
        this.errors.push({ name: this.MSG_APP, message: "Debe seleccionar al menos una aplicación." });
      }

      if (this.errors.length == 0) {
        let resLeg = {
          message: "1"
        }

        const termproc = this.preProccessRequest();

        resLeg = await this.terminalService.checkDuplicatesTwo(termproc).toPromise();

        if(resLeg.message === "0") {
          this.utils.toastDanger('El número de serial indicado se encuentra en uso: ' + termproc.dtrTerminalSN);
        } else {
            let terminalOper: Terminal = this.preProccessRequest();

            this.isTerminalSaveProccess = true;

            if (this.tokenStorage.isMancomuned(UtilsConstant.TM_REQUEST_TERMINAL)) {

              const dialogRef = this.dialog.open(PopupCommentComponent, {
                width: "800px",
                disableClose: false,
              });
              dialogRef.componentInstance.title = UtilsConstant.MSG_POPUP_TITLE_CONTENT;
              dialogRef.componentInstance.body = UtilsConstant.MSG_POPUP_COMMENT_CONTENT;
              dialogRef.componentInstance.module = this;
              dialogRef.componentInstance.typeProccess = UtilsConstant.TYPE_REQUEST_CREATE;
              dialogRef.afterClosed().subscribe((result) => {
                this.isTerminalSaveProccess = false;
              });

            } else {

              this.terminalService.create(terminalOper).subscribe(
                (success: Terminal) => {
                  this.registerAudit.setEntityCurrent = terminalOper;
                  this.registerAudit.setEntityId = success.ctrMerchantId + '-' + success.ctrTerminalNum;
                  console.log("saveCurrentAudit-2", this.registerAudit);
                  this.registerAudit.saveCurrentAudit();

                  this.isTerminalSaveProccess = false;
                  this.router.navigateByUrl("/config-red/terminal");
                }, (error) => {
                  console.log("Error de servicio. / Guardado");
                  this.utils.alertDanger(error);
                  this.isTerminalSaveProccess = false;

                }
              );
            }
        }

      }

    }
  }

  isSubmit() {
    this.notSubmit = true;
  }

  /******************************************************************************************************/


  ngAfterViewInit() {
    // this.setInitialValue();
    // this.setInitialValueMT();
    // this.setInitialValueTT();
    // this.setInitialValueModT();
    //this.setInitialValueMer();
  }

  ngOnDestroy() {
    this._onDestroyStatusTerminal.next();
    this._onDestroyStatusTerminal.complete();
    this._onDestroyMotivoTerminal.next();
    this._onDestroyMotivoTerminal.complete();
  }

  protected setInitialValue() {
    this.filteredStatusTerminal
      .pipe(take(1), takeUntil(this._onDestroyStatusTerminal))
      .subscribe(() => {
        this.singleSelectST.compareWith = (a: GenericFilter, b: GenericFilter) => a && b && a.id === b.id;
      });
  }

  protected setInitialValueMT() {
    this.filteredMotivoTerminal
      .pipe(take(1), takeUntil(this._onDestroyMotivoTerminal))
      .subscribe(() => {
        this.singleSelectMT.compareWith = (a: GenericFilter, b: GenericFilter) => a && b && a.id === b.id;
      });
  }

  protected setInitialValueTT() {
    this.filteredMotivoTerminal
      .pipe(take(1), takeUntil(this._onDestroyTipoTerminal))
      .subscribe(() => {
        this.singleSelectTT.compareWith = (a: GenericFilter, b: GenericFilter) => a && b && a.id === b.id;
      });
  }

  protected setInitialValueModT() {
    this.filteredMotivoTerminal
      .pipe(take(1), takeUntil(this._onDestroyModeloTerminal))
      .subscribe(() => {
        this.singleSelectModT.compareWith = (a: GenericFilter, b: GenericFilter) => a && b && a.id === b.id;
      });
  }

  protected filterStatusTerminal() {
    if (!this.statusTerminal) {
      return;
    }
    // get the search keyword
    let search = this.statusTerminalFilterCtrl.value;
    if (!search) {
      this.filteredStatusTerminal.next(this.statusTerminal.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredStatusTerminal.next(
      this.statusTerminal.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterMotivoTerminal() {
    if (!this.motivoTerminal) {
      return;
    }
    // get the search keyword
    let search = this.motivoTerminalFilterCtrl.value;
    if (!search) {
      this.filteredMotivoTerminal.next(this.motivoTerminal.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredMotivoTerminal.next(
      this.motivoTerminal.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterTipoTerminal() {
    if (!this.tipoTerminal) {
      return;
    }
    // get the search keyword
    let search = this.tipoTerminalFilterCtrl.value;
    if (!search) {
      this.filteredTipoTerminal.next(this.tipoTerminal.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredTipoTerminal.next(
      this.tipoTerminal.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterModeloTerminal() {
    if (!this.modeloTerminal) {
      return;
    }
    // get the search keyword
    let search = this.modeloTerminalFilterCtrl.value;
    if (!search) {
      this.filteredModeloTerminal.next(this.modeloTerminal.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredModeloTerminal.next(
      this.modeloTerminal.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  processDataOutPut(array: any[]) {
    this.selectItems = array;
  }

  initComboBox() {
    this.listField.getField('digitaciontarjeta').subscribe(
      success => this.listComboBoxDigitacionTarjeta = success,
      error => console.log(error)
    );

    this.listField.getField('tipocierrecomercio').subscribe(
      success => this.listComboBoxTipoCierre = success,
      error => console.log(error)
    );

    this.listField.getField('TrxDefault').subscribe(
      success => this.listComboBoxTransaccionDefecto = success,
      error => console.log(error)
    );

    this.listField.getField('TipoIngresoTarjetaConfirm').subscribe(
      success => this.listComboBoxIngresoTarjeta = success,
      error => console.log(error)
    );
  }


  popupMerchant(): void {
    const dialogRef = this.dialog.open(PopupListComponent, {
      width: '1000px',
      disableClose: true,
    });
    dialogRef.componentInstance.title = "Comercio";
    //dialogRef.componentInstance.body = this.requestUtil.POPUP_BODY_ELIMINAR;
    dialogRef.componentInstance.service = this.terminalService;
    dialogRef.componentInstance.function = 'delete';
    dialogRef.componentInstance.parameter = this.selectItems;
    dialogRef.componentInstance.module = this;

    dialogRef.componentInstance.uniqueSelect =true;
    dialogRef.componentInstance.checkBox =true;
    dialogRef.componentInstance.deleteMany = this.utils.DISABLE_CHECKBOX;

    dialogRef.componentInstance.merchantSelection = this.merchantSelectBack;
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined && result.status != undefined && result.status === 200) {
        alert(result.body.message);
        //this.borrarDelDataSource(result.body.parameter);
      } else {
        this.utils.verificarCodigoError(result, this.router);
      }
    });
  }

  getMessage(keyMessage: string): string {
    return this.errors.filter((item: HelperMessage) => item.name == keyMessage).length > 0 ? this.errors.filter((item: HelperMessage) => item.name == keyMessage)[0].message : this.MSG_NONE;
  }
}
