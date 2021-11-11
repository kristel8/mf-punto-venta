import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MerchantChain } from 'src/app/entidades/merchant-chain';
import { MechantChainService } from 'src/app/servicios/mechant-chain.service';
import { PopupCommentComponent } from 'src/app/shared/components/popup-comment/popup-comment.component';
import { Application } from 'src/app/shared/entities/application';
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
  selector: 'app-chain-commerce-create',
  templateUrl: './chain-commerce-create.component.html',
  styleUrls: ['./chain-commerce-create.component.scss']
})
export class ChainCommerceCreateComponent implements OnInit {

  MSG_NONE: string = 'none';
  MSG_FULLNAME: string = 'fullName';
  MSG_RUC: string = 'ruc';
  MSG_DESCRIPTION: string = 'description';
  MSG_APPLICATION: string = 'application';
  MSG_LIMIT_LOCAL: string = 'limit_local';
  MSG_LIMIT_EXT: string = 'limit_ext';

  errors: HelperMessage[] = [];

  isValidAccessLevel: boolean = true;
  isMerchantChainSaveProccess: boolean = false;

  registerAudit:RegisterAudit;

  styleMatCard: string;

  fields = new Fields();
  selectItems = [];

  fieldsContenido: FormGroup;

  formInvalid = false;
  isSuccessful = false;
  errorFix = false;

  checkBoxColor = this.utils.BLACK_COLOR;

  listApp: Application[] = [];

  limitCharacter = {
    codJuridicoRuc: 16,
    nombre: 30,
    description: 255
  }

  isMerchantChainLoad = false;
  constructor(
    private merchantChainService: MechantChainService,
    private tokenStorage: TokenStorageService,
    private router: Router,
    private requestUtil: RequestUtils,
    private auditService:AuditService,
    public utils: Utils,
    private dialog: MatDialog,
    private reqAppService: RequestApprovalService,
    private sanitizer: DomSanitizer) {
    this.styleMatCard = '';
  }

  ngOnInit() {
    this.registerAudit = new RegisterAudit( this.auditService, ConstantUtils.MODULE_POINT_OF_SALE_CONF, ConstantUtils.MODOPTION_MERCHANT_CHAIN, this.tokenStorage.getFullNameByUser(), "0", ConstantUtils.AUDIT_OPTION_TYPE_CREATE);

    this.validAccessLevel();

    this.listApp = this.tokenStorage.getAppByRol();
    this.listApp = this.listApp.filter(x => x.capApplicationID != "MAIN");

    // formulario reactivo - reactiveForms
    this.fieldsContenido = new FormGroup({
      dmcChainName: new FormControl('', [Validators.required, Validators.maxLength(this.limitCharacter.nombre)]),
      dmcRUC: new FormControl('', [Validators.maxLength(this.limitCharacter.codJuridicoRuc)]),
      dmcdescription: new FormControl(''),
      cmcapplicationID: new FormControl(''),
      cmcmodifyUser: new FormControl(this.tokenStorage.getUser().id),
      fmcmodifyDate: new FormControl(this.requestUtil.FORMAT_ANIO_MES_DIA),
      hmcmodifyTime: new FormControl(this.requestUtil.FORMAT_HORA_MIN_SEG),
      cmclimitAmount: new FormControl(null, [Validators.maxLength(14)]),
      cmclimitAmountDollar: new FormControl(null, [Validators.maxLength(14)]),
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


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setHeight(event.target.innerHeight);
  }

  setHeight(height: number) {
    if (this.fieldsContenido != undefined && this.fieldsContenido != null) {
      this.styleMatCard = (0.86 * height) + 'px';
    }
  }

  sendToRequest(comment: string, sendToRequest: number, appSelection: string) {
    let fields: MerchantChain = this.fieldsContenido.getRawValue();

    let tempRA: RequestApproval = { operationType: 0, moduleType: 0, content: "", commentreq: "", coduserreq: "" };
    tempRA.operationType = sendToRequest;
    tempRA.moduleType = UtilsConstant.TM_REQUEST_MANT_MERCHANT_CHAIN;
    tempRA.content = JSON.stringify(fields);
    tempRA.coduserreq = this.tokenStorage.getUser()["id"];
    tempRA.commentreq = comment;
    tempRA.appcurrent = appSelection;

    this.isMerchantChainSaveProccess = true;

    this.reqAppService.save(tempRA).subscribe(
      (data:RequestApproval) => {
        console.log("exitoso temp");

        this.registerAudit.setEntityId = "-1";
        this.registerAudit.setEntityCurrent = fields;
        this.registerAudit.setIdManc = data.raid;
        //this.registerAudit.saveCurrentAudit(Utils.AUDIT_MANCOMUNED_TYPE);
        this.registerAudit.saveCurrentAuditObservable(Utils.AUDIT_MANCOMUNED_TYPE).subscribe(
          (res) => {
            //this.utils.toastSuccess('Creación satisfactoria');
            this.isMerchantChainSaveProccess = false;
            this.router.navigateByUrl("/config-red/cadena-comercio");
          },
          (err) => {
            //toast duplicado
            this.isMerchantChainSaveProccess = false;
            if (err.error.localizedMessage == "2") {
              this.utils.toastWarning('Ya existe una cadena de comercio con este RUC');
            } else {
              this.utils.toastWarning('Error');
            }
          }
        );

        //this.isMerchantChainSaveProccess = false;
        //this.router.navigateByUrl("/config-red/cadena-comercio");
      },
      (error) => {
        this.isMerchantChainSaveProccess = false;
        this.utils.alertDanger(error);
        console.log("Error > Request Approval")
      });
  }

  async guardar() {
    if (this.validatedForm()) {
      const ruc = this.fieldsContenido.getRawValue()["dmcRUC"];
      const merch = {dmcRUC: ruc}
      const resLeg = await this.merchantChainService.checkDuplicates(merch as any).toPromise();
      if(resLeg.message === "0") {
        this.utils.toastDanger('RUC ya esta asociado a una Cadena de Comercio: ' + ruc);
      }

      if (this.fieldsContenido.invalid || resLeg.message === "0") {
        console.log('Formulario invalido');
        this.formInvalid = true;
        this.errorFix = false;
      } else {
        let fields: MerchantChain = this.fieldsContenido.getRawValue();

        //Fix - Por error al filtrar caracteres especiales
        fields.dmcChainName = fields.dmcChainName.trim().replace(/[^a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s_.-]/g, "");
        fields.dmcRUC = fields.dmcRUC.trim().replace(/[^0-9.]/g, "");
        fields.dmcdescription = fields.dmcdescription.trim().replace(/[^a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s_.-]/g, "");

        if (this.tokenStorage.isMancomuned(UtilsConstant.TM_REQUEST_MANT_MERCHANT_CHAIN)) {

          const dialogRef = this.dialog.open(PopupCommentComponent, {
            width: "800px",
            disableClose: false,
          });
          dialogRef.componentInstance.title = UtilsConstant.MSG_POPUP_TITLE_CONTENT;
          dialogRef.componentInstance.body = UtilsConstant.MSG_POPUP_COMMENT_CONTENT;
          dialogRef.componentInstance.module = this;
          dialogRef.componentInstance.typeProccess = UtilsConstant.TYPE_REQUEST_CREATE;
          //
          dialogRef.afterClosed().subscribe((result) => {
          }, (err) => {
            console.log(err);
          });

        } else {

          this.isMerchantChainSaveProccess = true;

          this.merchantChainService.create(fields).subscribe(
            (response:MerchantChain) => {
              this.isMerchantChainSaveProccess = false;

              this.registerAudit.setEntityId = response.cmcchainID;
              this.registerAudit.setEntityCurrent = fields;
              this.registerAudit.saveCurrentAudit();

              this.router.navigateByUrl("/config-red/cadena-comercio");
            }, (err) => {

              console.log("error",err.error);
              this.utils.alertDanger(err);
              this.isMerchantChainSaveProccess = false;

            }
          );

        }

      }
    }
  }

  validatedForm(): Boolean {
    this.errors = [];

    console.log(JSON.stringify(this.fieldsContenido.getRawValue()));

    if (this.fieldsContenido.getRawValue()["dmcChainName"] == undefined
      || this.fieldsContenido.getRawValue()["dmcChainName"].trim() == ''
      || this.fieldsContenido.getRawValue()["dmcChainName"].trim().replace(/[^a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s_.-]/g, "") == '') {
      this.errors.push({ name: this.MSG_FULLNAME, message: 'El campo Nombre se encuentra vacío.' });
    }

    if (this.fieldsContenido.getRawValue()["dmcRUC"] == undefined
      || this.fieldsContenido.getRawValue()["dmcRUC"].trim() == ''
      || this.fieldsContenido.getRawValue()["dmcRUC"].trim().replace(/[^0-9.]/g, "") == '') {
      this.errors.push({ name: this.MSG_RUC, message: 'El campo Código Jurídico/RUC se encuentra vacío.' });
    }

    if (this.fieldsContenido.getRawValue()["dmcdescription"] == undefined
      || this.fieldsContenido.getRawValue()["dmcdescription"].trim() == ''
      || this.fieldsContenido.getRawValue()["dmcdescription"].trim().replace(/[^a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s_.-]/g, "") == '') {
      this.errors.push({ name: this.MSG_DESCRIPTION, message: 'El campo Descripción se encuentra vacío.' });
    }

    if (this.fieldsContenido.getRawValue()["cmcapplicationID"] == undefined
      || this.fieldsContenido.getRawValue()["cmcapplicationID"].trim() == '') {
      this.errors.push({ name: this.MSG_APPLICATION, message: 'El campo Aplicación se encuentra vacío.' });
    }

    /*
    const cmclimitAmount =  this.fieldsContenido.getRawValue()["cmclimitAmount"];
    console.log('cmclimitAmount', cmclimitAmount);

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

}
