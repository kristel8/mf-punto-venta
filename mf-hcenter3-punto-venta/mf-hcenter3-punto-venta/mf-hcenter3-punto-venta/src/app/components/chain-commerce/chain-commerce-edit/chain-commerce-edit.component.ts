import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { ComercioLs } from 'src/app/entidades/comercio-ls';
import { MerchantChain } from 'src/app/entidades/merchant-chain';
import { MechantChainService } from 'src/app/servicios/mechant-chain.service';
import { UbigeoService } from 'src/app/servicios/ubigeo.service';
import { PopupCommentComponent } from 'src/app/shared/components/popup-comment/popup-comment.component';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { Application } from 'src/app/shared/entities/application';
import { Column } from 'src/app/shared/entities/column';
import { ConstantUtils } from 'src/app/shared/entities/constantUtils';
import { Fields } from 'src/app/shared/entities/fields';
import { HelperMessage } from 'src/app/shared/entities/helperMessage';
import { RegisterAudit } from 'src/app/shared/entities/registerAudit';
import { RequestUtils } from 'src/app/shared/entities/request-util';
import { RequestApproval } from 'src/app/shared/entities/requestApproval';
import { Role } from 'src/app/shared/entities/role';
import { Utils } from 'src/app/shared/entities/utils';
import { UtilsConstant } from 'src/app/shared/entities/utils-constant';
import { AuditService } from 'src/app/shared/services/audit.service';
import { RequestApprovalService } from 'src/app/shared/services/request-approval.service';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';

@Component({
  selector: 'app-chain-commerce-edit',
  templateUrl: './chain-commerce-edit.component.html',
  styleUrls: ['./chain-commerce-edit.component.scss']
})
export class ChainCommerceEditComponent implements OnInit {


  MSG_NONE: string = 'none';
  MSG_FULLNAME: string = 'fullName';
  MSG_RUC: string = 'ruc';
  MSG_DESCRIPTION: string = 'description';
  MSG_APPLICATION: string = 'application';
  MSG_LIMIT_LOCAL: string = 'limit_local';
  MSG_LIMIT_EXT: string = 'limit_ext';

  errors: HelperMessage[] = [];

  registerAudit: RegisterAudit;

  isValidAccessLevel: boolean = false;
  isValidAccessLevelModify: boolean = false;
  isMerchantChainSaveProccess: boolean = false;

  accumulatedFlag: boolean = true;

  selectItems:MerchantChain[]=[];

  fieldsContenido: FormGroup;

  comercios: ComercioLs[] = [];
  arrayOfTable = this.utils.ARRAY_OF_TABLE;
  clearFilter = this.utils.DISABLE_CLEAR_FILTER;
  checkBoxColor = this.utils.BLACK_COLOR;
  showColumns: Column[];
  menuColumns: Column[];

  crudType: string;
  idMerchan: string;

  merchantChain = new MerchantChain();
  fields = new Fields();
  originalMerchantChain: MerchantChain;

  formInvalid = false;

  errorFix = false;

  listApp: Application[] = [];

  originalRUC: string;

  limitCharacter = {
    codJuridicoRuc: 16,
    nombre: 30,
    description: 255
  }
  isMerchantChainLoad = false;

  deleting: boolean = false;

  loadingComercios = true;

  constructor(
    private merchantChainService: MechantChainService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private requestUtil: RequestUtils,
    private reqAppService: RequestApprovalService,
    private auditService: AuditService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    public utils: Utils,
    private sanitizer: DomSanitizer,
    private ubigeoService: UbigeoService,
    private fb: FormBuilder) {
//       cmrMerchantChain: "2"
// cmrMerchantId: "000000000003"
// cmrProfileId: "Perf_ElSalvador"
// cmrStatus: "0"
// dmrContactName: "Salvadoreño"
// dmrMerchantChainName: "Cadena_ElSalvador"
// dmrMerchantName: "COMERCIO EL SALVADOR QA"
      this.showColumns = [
        {
          id: '1',
          columnOfTable: 'cmrMerchantId',
          display: 'ID Comercio',
          columnOfRelationalTable: '',
          innierTable: ''
        },
        {
          id: '2',
          columnOfTable: 'dmrMerchantName',
          display: 'Comercio',
          columnOfRelationalTable: '',
          innierTable: ''
        },
        {
          id: '3',
          columnOfTable: 'cmrProfileId',
          display: 'Perfil',
          columnOfRelationalTable: '',
          innierTable: ''
        },
      ];
      this.menuColumns = [
        {
          id: '1',
          columnOfTable: 'cmrMerchantId',
          display: 'ID Comercio',
          columnOfRelationalTable: '',
          innierTable: '',
          blockAdminCol: true
        },
        {
          id: '2',
          columnOfTable: 'dmrMerchantName',
          display: 'Comercio',
          columnOfRelationalTable: '',
          innierTable: '',
          blockAdminCol: true
        },
        {
          id: '3',
          columnOfTable: 'cmrProfileId',
          display: 'Perfil',
          columnOfRelationalTable: '',
          innierTable: ''
        },
      ];
  }

  ngOnInit() {

    this.registerAudit = new RegisterAudit(this.auditService, ConstantUtils.MODULE_POINT_OF_SALE_CONF, ConstantUtils.MODOPTION_MERCHANT_CHAIN, this.tokenStorage.getFullNameByUser(), this.route.snapshot.paramMap.get('cmcchainID'), ConstantUtils.AUDIT_OPTION_TYPE_UPDATE);

    //this.validAccessLevel();
    this.isValidAccessLevel = this.utils.validAccessLevelDelete('mantenimientomc', 'mantCadenaCom');
    this.isValidAccessLevelModify = this.utils.validAccessLevel('mantenimientomc', 'mantCadenaCom');

    this.listApp = this.tokenStorage.getAppByRol().filter(x => x.capApplicationID != 'MAIN');

    this.listApp = this.listApp.filter(x => x.capApplicationID != "MAIN");

    const cmcchainID = parseFloat(this.route.snapshot.paramMap.get('cmcchainID'));

    this.isMerchantChainLoad = true;

    this.merchantChainService.getMerchantChainID(cmcchainID)
      .subscribe((respMerchantChain: MerchantChain) => {
        this.isMerchantChainLoad = false;
        this.merchantChain = respMerchantChain;
        this.merchantChain.cmcchainID === cmcchainID;

        this.originalRUC = this.merchantChain.dmcRUC;

        this.fieldsContenido = this.fb.group({
          cmcchainID: cmcchainID,
          dmcChainName: this.merchantChain.dmcChainName,
          dmcRUC: this.merchantChain.dmcRUC,
          dmcdescription: this.merchantChain.dmcdescription,
          cmcapplicationID: this.merchantChain.cmcapplicationID == null ? '' : this.merchantChain.cmcapplicationID,
          cmclimitAmount: parseFloat(this.merchantChain.cmclimitAmount),
          cmclimitAmountDollar: parseFloat(this.merchantChain.cmclimitAmountDollar),
          cmcamountLimiteAccumulated: [{ value: this.merchantChain.cmcamountLimiteAccumulated == null ? 0 : this.merchantChain.cmcamountLimiteAccumulated, disabled: this.accumulatedFlag }],
          cmcamountLimiteAccumulatedDollar: [{ value: this.merchantChain.cmcamountLimiteAccumulatedDollar == null ? 0 : this.merchantChain.cmcamountLimiteAccumulatedDollar, disabled: this.accumulatedFlag }],
          cmcmodifyUser: this.tokenStorage.getUser().id,
          fmcmodifyDate: this.requestUtil.FORMAT_ANIO_MES_DIA,
          hmcmodifyTime: this.requestUtil.FORMAT_HORA_MIN_SEG,
        });
        this.originalMerchantChain = JSON.parse(JSON.stringify(this.nuevoValor()));
        this.registerAudit.setEntityOld = this.originalMerchantChain;
      },
        error => {
          this.isMerchantChainLoad = false;
          console.error(error);
        }
    );

    this.ubigeoService.getCommerce({ chain: cmcchainID.toString() }).then((response) => {
      response.subscribe((resCommerce) => {
        console.log("obtener comercio de cadena", resCommerce.content);
        this.comercios.push(...resCommerce.content);
        if(resCommerce.last === true) {
          this.loadingComercios = false;
          console.log("resCommerce.last", this.loadingComercios);
        }
      });
    });
  }

  validAccessLevel() {
    let role: Role[] = this.tokenStorage.getUser()['listRols'];
    let identifierModule: string = 'mantenimientomc';
    let procesoIndicatorArbolModule: string = 'mantCadenaCom';
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


  private nuevoValor(): any {

    let fieldsContenidoAuxiliar: any = {};

    fieldsContenidoAuxiliar.cmcchainID = this.fieldsContenido.getRawValue().cmcchainID;
    fieldsContenidoAuxiliar.dmcChainName = this.fieldsContenido.getRawValue().dmcChainName.trim().replace(/[^a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s_.-]/g, "");
    fieldsContenidoAuxiliar.dmcRUC = this.fieldsContenido.getRawValue().dmcRUC.trim().replace(/[^0-9.]/g, "");
    fieldsContenidoAuxiliar.dmcdescription = this.fieldsContenido.getRawValue().dmcdescription.trim().replace(/[^a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s_.-]/g, "");
    fieldsContenidoAuxiliar.cmcapplicationID = this.fieldsContenido.getRawValue().cmcapplicationID;
    fieldsContenidoAuxiliar.cmcmodifyUser = this.fieldsContenido.getRawValue().cmcmodifyUser;
    fieldsContenidoAuxiliar.fmcmodifyDate = this.fieldsContenido.getRawValue().fmcmodifyDate;
    fieldsContenidoAuxiliar.hmcmodifyTime = this.fieldsContenido.getRawValue().hmcmodifyTime;

    fieldsContenidoAuxiliar.cmclimitAmount = this.fieldsContenido.getRawValue().cmclimitAmount;
    fieldsContenidoAuxiliar.cmclimitAmountDollar = this.fieldsContenido.getRawValue().cmclimitAmountDollar;

    return fieldsContenidoAuxiliar;

  }

  sendToRequest(comment: string, typeProccess: number, appSelection: string) {
    let merchantChain: MerchantChain = this.nuevoValor();

    let tempRA: RequestApproval = { operationType: 0, moduleType: 0, content: "", commentreq: "", coduserreq: "" };
    tempRA.operationType = typeProccess;
    tempRA.moduleType = UtilsConstant.TM_REQUEST_MANT_MERCHANT_CHAIN;
    tempRA.content = JSON.stringify(this.deleting?this.originalMerchantChain:merchantChain);
    tempRA.coduserreq = this.tokenStorage.getUser()["id"];
    tempRA.commentreq = comment;
    tempRA.appcurrent = appSelection;

    this.isMerchantChainSaveProccess = true;

    this.reqAppService.save(tempRA).subscribe(
      (data:RequestApproval) => {
        this.isMerchantChainSaveProccess = false;

        let merchantChain: MerchantChain = this.nuevoValor();
        this.registerAudit.setEntityCurrent = merchantChain;
        this.registerAudit.setEntityOld = this.originalMerchantChain;
        this.registerAudit.setEntityId = "-1";
        this.registerAudit.setIdManc = data.raid;
        this.registerAudit.saveCurrentAudit(Utils.AUDIT_MANCOMUNED_TYPE);

        this.router.navigateByUrl("/config-red/cadena-comercio")
      },
      error => {
        this.isMerchantChainSaveProccess = false;
        console.error("Error > Request Approval");
        this.utils.alertDanger(error);
      });
  }


  async guardar() {
    this.registerAudit = new RegisterAudit(this.auditService, ConstantUtils.MODULE_POINT_OF_SALE_CONF, ConstantUtils.MODOPTION_MERCHANT_CHAIN, this.tokenStorage.getFullNameByUser(), this.route.snapshot.paramMap.get('cmcchainID'), ConstantUtils.AUDIT_OPTION_TYPE_UPDATE);

    if (this.validatedForm()) {
      let resLeg = {
        message: "1"
      };
      const ruc = this.fieldsContenido.getRawValue()["dmcRUC"];

      if (this.originalRUC != ruc) {
        const merch = {dmcRUC: ruc}
        resLeg = await this.merchantChainService.checkDuplicates(merch as any).toPromise();
      }

      if(resLeg.message === "0") {
        this.utils.toastDanger('RUC ya esta asociado a una Cadena de Comercio: ' + ruc);
      }

      if (this.fieldsContenido.invalid || resLeg.message === "0") {
        this.formInvalid = true;
        this.errorFix = false;
      } else {
        let merchantChain: MerchantChain = this.nuevoValor();

        if (this.tokenStorage.isMancomuned(UtilsConstant.TM_REQUEST_MANT_MERCHANT_CHAIN)) {
          const dialogRef = this.dialog.open(PopupCommentComponent, {
            width: "800px",
            disableClose: false,
          });
          dialogRef.componentInstance.title = UtilsConstant.MSG_POPUP_TITLE_CONTENT;
          dialogRef.componentInstance.body = UtilsConstant.MSG_POPUP_COMMENT_CONTENT;
          dialogRef.componentInstance.module = this;
          dialogRef.componentInstance.typeProccess = UtilsConstant.TYPE_REQUEST_EDIT;
          this.deleting = false;
          dialogRef.afterClosed().subscribe((result) => {
          });
        } else {

          this.isMerchantChainSaveProccess = true;
          this.merchantChainService.updateMerchantChain(merchantChain).subscribe(
            response => {
              this.isMerchantChainSaveProccess = false;
              this.registerAudit.setEntityCurrent = merchantChain;
              this.registerAudit.setEntityOld = this.originalMerchantChain;
              this.registerAudit.saveCurrentAudit();
              this.router.navigateByUrl("/config-red/cadena-comercio");
            }, (err) => {
              this.isMerchantChainSaveProccess = false;
              this.utils.alertDanger(err);
            }
          );
        }
      }
    }
  }

  validatedForm(): Boolean {
    this.errors = [];

    if (this.fieldsContenido.getRawValue()["dmcChainName"] == undefined
      || this.fieldsContenido.getRawValue()["dmcChainName"].trim() == '') {
      this.errors.push({ name: this.MSG_FULLNAME, message: 'El campo Nombre se encuentra vacío.' });
    }

    if (this.fieldsContenido.getRawValue()["dmcRUC"] == undefined
      || this.fieldsContenido.getRawValue()["dmcRUC"].trim() == '') {
      this.errors.push({ name: this.MSG_RUC, message: 'El campo Código Jurídico/RUC se encuentra vacío.' });
    }

    if (this.fieldsContenido.getRawValue()["dmcdescription"] == undefined
      || this.fieldsContenido.getRawValue()["dmcdescription"].trim() == '') {
      this.errors.push({ name: this.MSG_DESCRIPTION, message: 'El campo Descripción se encuentra vacío.' });
    }

    if (this.fieldsContenido.getRawValue()["cmcapplicationID"] == undefined || this.fieldsContenido.getRawValue()["cmcapplicationID"].trim() == '') {
      this.errors.push({ name: this.MSG_APPLICATION, message: 'El campo Aplicación se encuentra vacío.' });
    }

    /*
    if (this.fieldsContenido.getRawValue()["cmclimitAmount"] == '') {
      this.errors.push({ name: this.MSG_LIMIT_LOCAL, message: 'El campo Límite Local se encuentra vacío.' });
    }

    if (Number(this.fieldsContenido.getRawValue()["cmclimitAmount"]) == 0) {
      this.errors.push({ name: this.MSG_LIMIT_LOCAL, message: 'El campo Límite Local se encuentra en 0.' });
    }

    if (this.fieldsContenido.getRawValue()["cmclimitAmountDollar"] == '') {
      this.errors.push({ name: this.MSG_LIMIT_EXT, message: 'El campo Límite Extranjero se encuentra vacío.' });
    }

    if (Number(this.fieldsContenido.getRawValue()["cmclimitAmountDollar"]) == 0) {
      this.errors.push({ name: this.MSG_LIMIT_EXT, message: 'El campo Límite Extranjero se encuentra en 0.' });
    }
    */

    return this.errors.length == 0 ? true : false;
  }

  getMessage(keyMessage: string): string {
    return this.errors.filter(
      (item: HelperMessage) =>
        item.name == keyMessage).length > 0 ? this.errors.filter((item: HelperMessage) => item.name == keyMessage
        )[0].message : this.MSG_NONE;
  }

  get setCheckBoxColor() {
    return this.sanitizer.bypassSecurityTrustStyle(
      `--checkboxcolor: ${this.checkBoxColor};`
    );
  }

  getLength(value: number) {

    // if(value == null || value == 0 || value == 0.00) {
    //   return 0;
    // }

    const stringValue = value.toString();

    // if (stringValue == "0.00") {
    //   return 0;
    // }

    if (value == 0) {
      return 3;
    }

    return parseFloat(stringValue).toFixed(2).length - 1;

  }

  putCursorEnd(e) {
    const end = e.target;
    var len = end.value.length;

    if (end.setSelectionRange) {
        end.focus();
        end.setSelectionRange(len, len);
    } else if (end.createTextRange) {
        var t = end.createTextRange();
        t.collapse(true);
        t.moveEnd('character', len);
        t.moveStart('character', len);
        t.select();
    }
  }

  invalidDeleteMessagePopup(message: string) {
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '450px',
      disableClose: true,
    });
    dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_ELIMINAR;
    dialogRef.componentInstance.body = message;
    dialogRef.componentInstance.isEraseSelectDelete = true;
  }

  async popupDelete(): Promise<void> {
    this.selectItems = [];
    this.registerAudit = new RegisterAudit(this.auditService, ConstantUtils.MODULE_POINT_OF_SALE_CONF, ConstantUtils.MODOPTION_MERCHANT_CHAIN, this.tokenStorage.getFullNameByUser(), this.route.snapshot.paramMap.get('cmcchainID'), ConstantUtils.AUDIT_OPTION_TYPE_DELETE);

    this.selectItems.push(this.merchantChain);

    ///////////////////////////
    if (this.selectItems.length == 0) {
      this.invalidDeleteMessagePopup(this.requestUtil.POPUP_BODY_GENERIC_ERASE_DELETE);
      return;
    }
    const resLeg = await this.merchantChainService.checkAssociates(this.selectItems).toPromise();

    if (this.selectItems.length > 1) {
      if(resLeg.message === "0") {
        this.isMerchantChainSaveProccess = false;
        this.invalidDeleteMessagePopup(this.requestUtil.POPUP_BODY_ELIMINAR_INVALIDO_MUCHOS);
        return;
      }
    } else {
      if(resLeg.message === "0") {
        this.isMerchantChainSaveProccess = false;
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
            this.deleting = true;
            dialogRefMancModal.afterClosed().subscribe((result) => {
              this.router.navigateByUrl("/config-red/cadena-comercio");
            });
          }


        });


        // const dialogRef = this.dialog.open(PopupCommentComponent, {
        //   width: "800px",
        //   disableClose: false,
        // });
        // dialogRef.componentInstance.title = UtilsConstant.MSG_POPUP_TITLE_CONTENT;
        // dialogRef.componentInstance.body = UtilsConstant.MSG_POPUP_COMMENT_CONTENT;
        // dialogRef.componentInstance.module = this;
        // dialogRef.componentInstance.typeProccess = UtilsConstant.TYPE_REQUEST_DELETE;
        // dialogRef.afterClosed().subscribe((result) => {
        //   // console.log("datos");
        // });

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
            this.registerAudit.setEntityOld = this.originalMerchantChain;
            this.registerAudit.saveCurrentAudit();
            this.router.navigateByUrl("/config-red/cadena-comercio");
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

  getComercio() {
    this.ubigeoService.getCommerce({ chain: "0" }).then((response) => {
      response.subscribe((res) => {
        console.log("obtener comercio de cadena",res.content);
      });
    });
  }
}
