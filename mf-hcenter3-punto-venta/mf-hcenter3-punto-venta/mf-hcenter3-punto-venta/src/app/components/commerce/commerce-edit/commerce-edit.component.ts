import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSelect } from "@angular/material/select";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil, take } from "rxjs/operators";
import { Merchant } from "src/app/entidades/merchant";
import { MerchantChain } from "src/app/entidades/merchant-chain";
import { ApplicationMantService } from "src/app/servicios/application.service";
import { PopupCommentComponent } from "src/app/shared/components/popup-comment/popup-comment.component";
import { PopupComponent } from "src/app/shared/components/popup/popup.component";
import { Application } from "src/app/shared/entities/application";
import { Comision } from "src/app/shared/entities/comision";
import { ConstantUtils } from "src/app/shared/entities/constantUtils";
import { Country } from "src/app/shared/entities/country";
import { GenericFilter } from "src/app/shared/entities/genericFilter";
import { HelperMessage } from "src/app/shared/entities/helperMessage";
import { MerchantProfile } from "src/app/shared/entities/merchant-profile";
import { PerfilDownload } from "src/app/shared/entities/perfilDownload";
import { RegisterAudit } from "src/app/shared/entities/registerAudit";
import { RequestUtils } from "src/app/shared/entities/request-util";
import { RequestApproval } from "src/app/shared/entities/requestApproval";
import { Role } from "src/app/shared/entities/role";
import { Utils } from "src/app/shared/entities/utils";
import { UtilsConstant } from "src/app/shared/entities/utils-constant";
import { AuditService } from "src/app/shared/services/audit.service";
import { MechantChainService } from "src/app/shared/services/mechant-chain.service";
import { MerchantService } from "src/app/shared/services/merchant.service";
import { ProfileMerchantService } from "src/app/shared/services/profileMerchant.service";
import { RequestApprovalService } from "src/app/shared/services/request-approval.service";
import { TokenStorageService } from "src/app/shared/services/token-storage.service";

@Component({
  selector: 'app-commerce-edit',
  templateUrl: './commerce-edit.component.html',
  styleUrls: ['./commerce-edit.component.scss']
})
export class CommerceEditComponent implements OnInit {


  validationMessages = {
    cmrProfileId: {
      required: 'Seleccione un perfil de comercio',

    },
    cmrDownloadProfile: {
      required: 'Seleccione un plan de descarga',

    },
    cmrComision: {
      required: 'Seleccione un perfil de comisión',
    }
  };

  MSG_NONE: string = 'none';
  MSG_FULLNAME: string = 'fullName';
  MSG_RUC: string = 'ruc';
  MSG_DESCRIPTION: string = 'description';
  MSG_APPLICATION: string = 'application';
  MSG_LIMIT_LOCAL: string = 'limit_local';
  MSG_LIMIT_EXT: string = 'limit_ext';
  MSG_NAME: string = 'name';
  MSG_LOCAL_ACCOUNT: string = 'local_account';
  MSG_ADDRESS: string = 'address';
  MSG_RUC_CODE: string = 'ruc_code';
  MSG_FOREING_ACCOUNT: string = 'foreign_account';
  MSG_TRADE_CHAIN: string = 'trade_chain';
  MSG_AFFILIATE_NUMBER: string = 'affiliate_number';
  MSG_EMAIL_FORMAT: string = 'email_format';

  MSG_MERCHANT_PROFILE: string = 'cmrProfileId';
  MSG_DOWNLOAD_PROFILE: string = 'cmrDownloadProfile';
  MSG_COMISION_PROFILE: string = 'cmrComision';

  MSG_UBICACION_PAIS: string = 'nivelCeroCtrl';
  MSG_UBICACION_NIVEL1: string = 'nivelOneCtrl';
  MSG_UBICACION_NIVEL2: string = 'nivelTwoCtrl';
  MSG_UBICACION_NIVEL3: string = 'nivelThreeCtrl';

  errors: HelperMessage[] = [];
  form: any = {}

  formAcceptPayment = new FormControl();

  registerAudit: RegisterAudit;

  isValidAccessLevel: boolean = false;
  isValidAccessLevelModify: boolean = false;
  isMerchantSaveProccess: boolean = false;

  fields = new Merchant();
  fieldsContenido: FormGroup;
  //form: FormGroup;

  tipo:number=0;

  saldoinput:boolean=true;
  formInvalid = false;
  isSuccessful = false;

  merchant = new Merchant();
  merchantCurrent: Merchant;

  checkBoxColor = this.utils.BLACK_COLOR;
  codeCountry: string = '02';

  showLevel1: boolean = true;
  showLevel2: boolean = true;
  showLevel3: boolean = true;

  ubigeo: Country[];
  operadorTelefonico: Country[];

  comercioID: string;

  originalName: string;

  originalRuc: string;

  originalMerchant: Merchant;

  selectItems:Merchant[]=[];

  countryIsNull: boolean = false;

  constructor(
    private merchantChainService: MechantChainService,
    private merchantService: MerchantService,
    private merchantProfileService: ProfileMerchantService,
    private tokenStorage: TokenStorageService,
    private reqAppService: RequestApprovalService,
    private requestUtil: RequestUtils,
    private auditService: AuditService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    public utils: Utils,
    private applicationService: ApplicationMantService,
    private router: Router) {

    // Contiene el merchantChain selecionado
    this.fieldsContenido = this.fb.group({
      cmrMerchantId: [''],
      dmrMerchantName: ['', [Validators.maxLength(32)]],
      nmrCuentaLocal: ['', [Validators.maxLength(9)]],
      cmrStatus: ['0'],
      cmrRucCode: ['', [Validators.maxLength(16)]],
      dmrAddress: ['', [Validators.maxLength(32)]],
      nmrCuentaExtranjera: ['', [Validators.maxLength(9)]],
      cmrMerchantChain: [''],
      cmrMCC: [''],
      dmrContactName: [''],
      cmrTelephoneOperatorCode: [''],
      dmrPhone: [''],
      fmrContrSignDate: [''],
      cmrProfileId: [''],
      cmrDownloadProfile: [''],
      cmrComision: [''],
      cmrCountryCode: [''],
      cmrDepartCode:[''],

      cmrLimitAmountDollar: [''],
      cmrLimitAmount: [''],
      cmrSaldoAmount: [''],
      cmrSaldoAmountDollar: [''],
      cmrProvinceCode: [''],
      cmrDistrictCode: [''],
      cmcmodifyUser: [this.tokenStorage.getUser().id],
      fmcmodifyDate: [this.requestUtil.FORMAT_ANIO_MES_DIA],
      hmcmodifyTime: [this.requestUtil.FORMAT_HORA_MIN_SEG],

      cmrEmail: [''],
      cmrAcceptCompanyPayment: ['']
    });
  }

  get setCheckBoxColor() {
    return this.sanitizer.bypassSecurityTrustStyle(
      `--checkboxcolor: ${this.checkBoxColor};`
    );
  }

  ngOnInit() {

    this.registerAudit = new RegisterAudit(this.auditService, ConstantUtils.MODULE_POINT_OF_SALE_CONF, ConstantUtils.MODOPTION_MERCHANT, this.tokenStorage.getFullNameByUser(), this.route.snapshot.paramMap.get('cmrMerchantId'), ConstantUtils.AUDIT_OPTION_TYPE_UPDATE);

    //this.validAccessLevel();
    this.isValidAccessLevel = this.utils.validAccessLevelDelete('mantenimientomc', 'comercio');
    this.isValidAccessLevelModify = this.utils.validAccessLevel('mantenimientomc', 'comercio');

    const cmrMerchantId = this.route.snapshot.paramMap.get('cmrMerchantId');

    this.comercioID = cmrMerchantId;
    this.merchantService.getMerchantID(cmrMerchantId)
      .subscribe((resp: Merchant) => {
        this.merchant = resp;
        console.log(this.merchant);
        this.countryIsNull = this.merchant.cmrCountryCode==null;
        this.originalName = this.merchant.dmrMerchantName;
        this.originalRuc = this.merchant.cmrRucCode;
        this.merchant.cmrMerchantId === cmrMerchantId;
        this.fieldsContenido.controls['cmrMerchantId'].setValue(this.merchant.cmrMerchantId);
        this.fieldsContenido.controls['dmrMerchantName'].setValue(this.merchant.dmrMerchantName);
        this.fieldsContenido.controls['cmrStatus'].setValue(this.merchant.cmrStatus);
        this.fieldsContenido.controls['nmrCuentaLocal'].setValue(this.merchant.nmrCuentaLocal);
        this.fieldsContenido.controls['cmrRucCode'].setValue(this.merchant.cmrRucCode);
        this.fieldsContenido.controls['dmrAddress'].setValue(this.merchant.dmrAddress);
        this.fieldsContenido.controls['nmrCuentaExtranjera'].setValue(this.merchant.nmrCuentaExtranjera);
        this.fieldsContenido.controls['cmrMerchantChain'].setValue(this.merchant.cmrMerchantChain);
        this.fieldsContenido.controls['cmrMCC'].setValue(this.merchant.cmrMCC);
        this.fieldsContenido.controls['dmrContactName'].setValue(this.merchant.dmrContactName);
        this.fieldsContenido.controls['cmrTelephoneOperatorCode'].setValue(this.merchant.cmrTelephoneOperatorCode);
        this.fieldsContenido.controls['dmrPhone'].setValue(this.merchant.dmrPhone);
        this.fieldsContenido.controls['fmrContrSignDate'].setValue(this.requestUtil.parsefechaAmDToDate(this.merchant.fmrContrSignDate));
        //this.fieldsContenido.controls['cmrProfileId'].setValue(this.merchant.cmrProfileId);
        //this.fieldsContenido.controls['cmrDownloadProfile'].setValue(this.merchant.cmrDownloadProfile);
        //this.fieldsContenido.controls['cmrComision'].setValue(this.merchant.cmrComision);
        this.fieldsContenido.controls['cmrModifyUser'];
        this.fieldsContenido.controls['fmrModifyDate'];
        this.fieldsContenido.controls['hmrModifyTime'];

        //this.fieldsContenido.controls['cmrDepartCode'].setValue(this.merchant.cmrDepartCode);
        //this.fieldsContenido.controls['cmrProvinceCode'].setValue(this.merchant.cmrProvinceCode);
        //this.fieldsContenido.controls['cmrDistrictCode'].setValue(this.merchant.cmrDistrictCode);

        this.fieldsContenido.controls['cmrCountryCode'].setValue(this.merchant.cmrCountryCode);
        this.fieldsContenido.controls['cmrDepartCode'].setValue(this.merchant.cmrDepartCode);
        this.fieldsContenido.controls['cmrProvinceCode'].setValue(this.merchant.cmrProvinceCode);
        this.fieldsContenido.controls['cmrDistrictCode'].setValue(this.merchant.cmrDistrictCode);


        this.fieldsContenido.controls['cmrLimitAmountDollar'].setValue(this.merchant.cmrLimitAmountDollar);
        this.fieldsContenido.controls['cmrLimitAmount'].setValue(this.merchant.cmrLimitAmount);

        this.fieldsContenido.controls['cmrSaldoAmount'].setValue(this.merchant.cmrSaldoAmount);
        this.fieldsContenido.controls['cmrSaldoAmountDollar'].setValue(this.merchant.cmrSaldoAmountDollar);


        this.fieldsContenido.controls['cmrEmail'].setValue(this.merchant.cmrEmail);
        this.fieldsContenido.controls['cmrAcceptCompanyPayment'].setValue(this.merchant.cmrAcceptCompanyPayment);
        this.formAcceptPayment.setValue(this.merchant.cmrAcceptCompanyPayment === '1' ? true : false)

        let fields: Merchant = this.preProccessRequest(this.fieldsContenido.getRawValue());
        fields.cmrProfileId = this.merchant.cmrProfileId;
        fields.cmrDownloadProfile = this.merchant.cmrDownloadProfile;
        fields.cmrComision = this.merchant.cmrComision;

        this.originalMerchant = JSON.parse(JSON.stringify(fields));
        this.registerAudit.setEntityOld = this.originalMerchant;

        console.log(this.merchant.cmrProfileId);
        console.log("this.countryIsNull", this.countryIsNull);
        if(this.countryIsNull) {
          this.merchantProfileService.appsByMerchantProfileId(this.merchant.cmrProfileId).subscribe((resp: any) => {
            this.applicationService.getApplicationById(resp[0]).subscribe((res)=>{
              console.log("APP TOTAL",res.capcountrycode);
              this.merchant.cmrCountryCode = res.capcountrycode;
              //this.nivelCeroCtrl.setValue(res.capcountrycode);
              console.log(this.merchant.cmrCountryCode);
              this.loadListInput();
            },(err)=> {
            });
          }
          ,(err)=>{})

        } else {
          this.loadListInput();
        }

      });



  }

  validAccessLevel() {
    let role: Role[] = this.tokenStorage.getUser()['listRols'];
    let identifierModule: string = 'mantenimientomc';
    let procesoIndicatorArbolModule: string = 'comercio';
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

  preProccessRequest(fields: Merchant): Merchant {

    if (this.fieldsContenido.getRawValue()["fmrContrSignDate"]) {
      let fecha = this.requestUtil.DateTofechaAmD(this.fieldsContenido.getRawValue()["fmrContrSignDate"]);
      fields.fmrContrSignDate = fecha;
    }

    if (this.nivelCeroCtrl.value && this.nivelCeroCtrl.value['id']) {
      fields.cmrCountryCode = this.nivelCeroCtrl.value.id;
    }


    if (this.nivelOneCtrl.value && this.nivelOneCtrl.value['id']) {
      fields.cmrDepartCode = this.nivelOneCtrl.value.id;
    }

    if (this.nivelTwoCtrl.value && this.nivelTwoCtrl.value['id']) {
      fields.cmrProvinceCode = this.nivelTwoCtrl.value.id;
    }

    if (this.nivelThreeCtrl.value && this.nivelThreeCtrl.value['id']) {
      fields.cmrDistrictCode = this.nivelThreeCtrl.value.id;
    }
    fields.cmrLogicalStatus = Utils.ACTIVADO + '';
    fields.cmrMerchantId = this.comercioID;
    fields.cmrDownloadProfileName = this.fieldsContenido.controls.cmrDownloadProfile.value.ddpprofilename + '';

    return fields;
  }

  sendToRequest(comment: string, sendToRequest: number, appSelection: string) {
    console.log(this.tipo);
    if(this.tipo==0){
      let fields: Merchant = this.preProccessRequest(this.fieldsContenido.getRawValue());
    const tempProfile = this.fieldsContenido.getRawValue()["cmrProfileId"];
    fields.cmrProfileId = tempProfile.cmpprofileId;
    const tempDownloadProfile = this.fieldsContenido.getRawValue()["cmrDownloadProfile"];
    fields.cmrDownloadProfile = tempDownloadProfile.cdpprofileid + '';
    const tempComision = this.fieldsContenido.getRawValue()["cmrComision"];
    fields.cmrComision = tempComision.ncoidCommission;

    let tempRA: RequestApproval = { operationType: 0, moduleType: 0, content: "", commentreq: "", coduserreq: "" };
    tempRA.operationType = sendToRequest;
    tempRA.moduleType = UtilsConstant.TM_REQUEST_MERCHANT;
    tempRA.content = JSON.stringify(fields);
    tempRA.coduserreq = this.tokenStorage.getUser()["id"];
    tempRA.commentreq = comment;
    tempRA.appcurrent = appSelection;

    this.reqAppService.save(tempRA).subscribe(
      (data:RequestApproval) => {
        console.log("exitoso");
        this.registerAudit.setEntityOld = this.originalMerchant;
        this.registerAudit.setEntityCurrent = fields;
        this.registerAudit.setEntityId = '-1';
        this.registerAudit.setIdManc = data.raid;
        this.registerAudit.saveCurrentAudit(Utils.AUDIT_MANCOMUNED_TYPE);

        this.isMerchantSaveProccess = false;
        this.formInvalid = false;
        this.isSuccessful = true;
        this.router.navigateByUrl("/config-red/comercio");
      }, (error) => {
        console.log("Error > Request Approval");
        this.isMerchantSaveProccess = false;
        this.utils.alertDanger(error);
      });
    }else{

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
        this.registerAudit.setEntityOld = this.originalMerchant;
        this.registerAudit.setIdManc = data.raid;
        this.registerAudit.saveCurrentAudit(Utils.AUDIT_MANCOMUNED_TYPE);
      },
      (error) => console.log("Error > Request Approval")
    );

    this.router.navigateByUrl("/config-red/comercio");
    }


  }


  async guardar() {
    this.tipo=0;
    console.log("Inicio de Guardado");

    if (this.validatedForm()) {
      let resLeg = {
        message: "1"
      };

      let resLegRuc = {
        message: "1"
      };

      //return;
      const ruc = this.fieldsContenido.getRawValue()["cmrRucCode"];
      const dmrMerchantName = this.fieldsContenido.getRawValue()["dmrMerchantName"];

      if (this.originalName.toLowerCase() != dmrMerchantName.toLowerCase()) {
        const merch = {cmrRucCode: ruc, dmrMerchantName: dmrMerchantName }
        resLeg = await this.merchantService.checkDuplicates(merch as any).toPromise();
      }

      if(resLeg.message === "0") {
        this.utils.toastDanger('Ya existe comercio con este nombre: ' + dmrMerchantName);
      }

      if (this.originalRuc != ruc) {
        const merchByRuc = {cmrRucCode: ruc, dmrMerchantName: dmrMerchantName }
        resLegRuc = await this.merchantService.checkDuplicateRuc(merchByRuc as any).toPromise();
      }

      if(resLegRuc.message === "0") {
        this.utils.toastDanger('Ya existe comercio con este ruc: ' + ruc);
        return;
      }

      if (this.fieldsContenido.invalid || resLeg.message === "0" || resLegRuc.message === "0") {
        console.log('Formulario invalido');
        this.formInvalid = true;
      } else {

        console.log('Formulario valido');

        let fields: Merchant = this.preProccessRequest(this.fieldsContenido.getRawValue());

        //this.fieldsContenido.controls['cmrProfileId'].setValue(this.merchant.cmrProfileId);
        //this.fieldsContenido.controls['cmrDownloadProfile'].setValue(this.merchant.cmrDownloadProfile);
        //this.fieldsContenido.controls['cmrComision'].setValue(this.merchant.cmrComision);

        const tempProfile = this.fieldsContenido.getRawValue()["cmrProfileId"];
        fields.cmrProfileId = tempProfile.cmpprofileId;

        const tempDownloadProfile = this.fieldsContenido.getRawValue()["cmrDownloadProfile"];
        fields.cmrDownloadProfile = tempDownloadProfile.cdpprofileid + '';

        const tempComision = this.fieldsContenido.getRawValue()["cmrComision"];
        fields.cmrComision = tempComision.ncoidCommission;

        this.isMerchantSaveProccess = true;

        if (this.tokenStorage.isMancomuned(UtilsConstant.TM_REQUEST_MERCHANT)) {

          console.log('es mancomunado');

          const dialogRef = this.dialog.open(PopupCommentComponent, {
            width: "800px",
            disableClose: false,
          });
          dialogRef.componentInstance.title = UtilsConstant.MSG_POPUP_TITLE_CONTENT;
          dialogRef.componentInstance.body = UtilsConstant.MSG_POPUP_COMMENT_CONTENT;
          dialogRef.componentInstance.module = this;
          dialogRef.componentInstance.typeProccess = UtilsConstant.TYPE_REQUEST_EDIT;
          dialogRef.afterClosed().subscribe((result) => {
            this.isMerchantSaveProccess = false;
            this.formInvalid = false;
            this.isSuccessful = true;
          });

        } else {

          this.merchantService.updateMerchant(fields).subscribe(
            response => {
              this.registerAudit.setEntityOld = this.originalMerchant;
              this.registerAudit.setEntityCurrent = fields;
              this.registerAudit.saveCurrentAudit();

              this.isMerchantSaveProccess = false;
              this.formInvalid = false;
              this.isSuccessful = true;
              this.router.navigateByUrl("/config-red/comercio");
            }, err => {
              this.isMerchantSaveProccess = false;
              console.log('Error al Crear usuario');
              this.utils.alertDanger(err);
            }
          );

        }
      }
    }
  }

  loadInitialCountry() {

    this.nivelTwo =
      this.ubigeo
        .filter((item) => item.valueCode == this.nivelCeroCtrl.value.id)[0]
        .children.filter((item2) => item2.valueCode == this.nivelOneCtrl.value.id)[0]
        .children.filter((item3) => item3.fatherCode == this.nivelOneCtrl.value.id)
        .map((val) => {
          return {
            id: val["valueCode"],
            name: val["description"]
          }
        });

    this.nivelTwoCtrl.setValue(this.nivelTwo);
    this.filteredNivelTwo.next(this.nivelTwo.slice());
    this.nivelTwoFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroyNivelTwo))
      .subscribe(() => {
        this.filterNivelCero();
      });


    let tempTwo = this.nivelTwo.filter((item) => item.id == this.merchant.cmrProvinceCode);
    if (tempTwo.length > 0) {

      this.showLevel2 = false;
      this.nivelTwoCtrl.setValue(tempTwo[0]);


      this.nivelThree =
        this.ubigeo
          .filter((item) => item.valueCode == this.nivelCeroCtrl.value.id)[0]
          .children.filter((item2) => item2.valueCode == this.nivelOneCtrl.value.id)[0]
          .children.filter((item3) => item3.fatherCode == this.nivelOneCtrl.value.id)

          .filter((item4) => item4.valueCode == this.nivelTwoCtrl.value.id)[0]
          .children

          .map((val) => {
            return {
              id: val["valueCode"],
              name: val["description"]
            }
          });

      this.nivelThreeCtrl.setValue(this.nivelThree);
      this.filteredNivelThree.next(this.nivelThree.slice());
      this.nivelThreeFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroyNivelThree))
        .subscribe(() => {
          this.filterNivelCero();
        });


      let tempThree = this.nivelThree.filter((item) => item.id == this.merchant.cmrDistrictCode);
      if (tempThree.length > 0) {
        this.showLevel3 = false;
        this.nivelThreeCtrl.setValue(tempThree[0]);
      }

    }

  }

  checkNivel1(comercio: GenericFilter) {

    this.showLevel1 = false;
    this.showLevel2 = true;
    this.showLevel3 = true;


    this.nivelOne =
      this.ubigeo
        .filter((item) => item.valueCode == this.nivelCeroCtrl.value.id)[0]
        .children.filter((item2) => item2.fatherCode == this.nivelCeroCtrl.value.id)
        .map((val) => {
          return {
            id: val["valueCode"],
            name: val["description"]
          }
        });

    this.nivelOneCtrl.setValue(this.nivelOne);

    this.nivelTwoCtrl.setValue([]);
    this.nivelThreeCtrl.setValue([]);

    this.filteredNivelOne.next(this.nivelOne.slice());
    this.nivelOneFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroyNivelOne))
      .subscribe(() => {
        this.filterNivelCero();
      });
  }

  checkNivel2(comercio: GenericFilter) {

    this.showLevel2 = false;
    this.showLevel3 = true;

    this.nivelTwo =
      this.ubigeo
        .filter((item) => item.valueCode == this.nivelCeroCtrl.value.id)[0]
        .children.filter((item2) => item2.valueCode == this.nivelOneCtrl.value.id)[0]
        .children.filter((item3) => item3.fatherCode == this.nivelOneCtrl.value.id)
        .map((val) => {
          return {
            id: val["valueCode"],
            name: val["description"]
          }
        });

    this.nivelTwoCtrl.setValue(this.nivelTwo);
    this.filteredNivelTwo.next(this.nivelTwo.slice());
    this.nivelTwoFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroyNivelTwo))
      .subscribe(() => {
        this.filterNivelCero();
      });
  }

  checkNivel3(comercio: GenericFilter) {

    this.showLevel3 = false;

    this.nivelThree =
      this.ubigeo
        .filter((item) => item.valueCode == this.nivelCeroCtrl.value.id)[0]
        .children.filter((item2) => item2.valueCode == this.nivelOneCtrl.value.id)[0]
        .children.filter((item3) => item3.fatherCode == this.nivelOneCtrl.value.id)

        .filter((item4) => item4.valueCode == this.nivelTwoCtrl.value.id)[0]
        .children

        .map((val) => {
          return {
            id: val["valueCode"],
            name: val["description"]
          }
        });

    this.nivelThreeCtrl.setValue(this.nivelThree);
    this.filteredNivelThree.next(this.nivelThree.slice());
    this.nivelThreeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroyNivelThree))
      .subscribe(() => {
        this.filterNivelCero();
      });

  }

  changeOfMerchantChain(currentCC: MerchantChain) {
    //this.loadProfilePlan(currentCC.cmcchainID + '');
  }

  /****************************************************************************************************************
   *
   * De esta seccion en adelante se usa para las declaracion de las listas con busquedas. para evitar la duplicacion
   * de codigo se debe idear una forma de volver esas implementaciones mas generericas y no colocar tanto codigo
   * de solo su implementacion de funcionamiento ya que solo deberia estar la logica expecifica de este componente.
   *
   *****************************************************************************************************************/


  /**
   *
   * Declaration
   *
  */

  /*Para buscador de Cadena de Comercio*/
  merchantChain: MerchantChain[];
  matSelectCadenaComercioCtrl: FormControl = new FormControl();
  matSelectSearchCadenaComercioCtrl: FormControl = new FormControl();
  @ViewChild('filtermerchant', { static: true }) filtermerchant: MatSelect;
  filteredFiltro: ReplaySubject<MerchantChain[]> = new ReplaySubject<MerchantChain[]>(1);
  protected _onDestroy = new Subject<void>();


  /*Para buscador perfil de Comision*/
  comisiones: Comision[];
  matSelectComisionCtrl: FormControl = new FormControl();
  matSelectSearchComisionCtrl: FormControl = new FormControl();
  @ViewChild('filtercomision', { static: true }) filtercomision: MatSelect;
  filteredFiltroComision: ReplaySubject<Comision[]> = new ReplaySubject<Comision[]>(1);
  private _onDestroyer = new Subject<void>();


  /* Para buscar perfil de comercio */
  merchantProfile: MerchantProfile[];
  matSelectPerfilComercioCtrl: FormControl = new FormControl();
  matSelectSearchPerfilComercioCtrl: FormControl = new FormControl();
  @ViewChild('filterperfilcomercio', { static: true }) filterperfilcomercio: MatSelect;
  filteredFiltroPerfilComercio: ReplaySubject<MerchantProfile[]> = new ReplaySubject<MerchantProfile[]>(1);
  private _onDestroyPerfCom = new Subject<void>();

  /* Para buscar perfil de descarga*/
  profileDownload: PerfilDownload[];
  matSelectPerfilDownloadCtrl: FormControl = new FormControl();
  matSelectSearchPerfilDownloadCtrl: FormControl = new FormControl();
  filteredFiltroPerfildownload: ReplaySubject<PerfilDownload[]> = new ReplaySubject<PerfilDownload[]>(1);
  @ViewChild('filterperfildownload', { static: true }) filterperfildownload: MatSelect;
  private _onDestroyPerfilDonwload = new Subject<void>();


  //Variables Para Nivel 0 (Pais)
  protected nivelCero: GenericFilter[];
  public nivelCeroCtrl: FormControl = new FormControl();
  public nivelCeroFilterCtrl: FormControl = new FormControl();
  public filteredNivelCero: ReplaySubject<GenericFilter[]> = new ReplaySubject<GenericFilter[]>(1);
  @ViewChild('singleSelectNCERO', { static: false }) singleSelectNCERO: MatSelect;
  protected _onDestroyNivelCero = new Subject<void>();

  //Variables Para Nivel 1 (Provincia)
  protected nivelOne: GenericFilter[];
  public nivelOneCtrl: FormControl = new FormControl();
  public nivelOneFilterCtrl: FormControl = new FormControl();
  public filteredNivelOne: ReplaySubject<GenericFilter[]> = new ReplaySubject<GenericFilter[]>(1);
  @ViewChild('singleSelectNONE', { static: false }) singleSelectNONE: MatSelect;
  protected _onDestroyNivelOne = new Subject<void>();

  //Variables Para Nivel 2 (Provincia)
  protected nivelTwo: GenericFilter[];
  public nivelTwoCtrl: FormControl = new FormControl();
  public nivelTwoFilterCtrl: FormControl = new FormControl();
  public filteredNivelTwo: ReplaySubject<GenericFilter[]> = new ReplaySubject<GenericFilter[]>(1);
  @ViewChild('singleSelectNTWO', { static: false }) singleSelectNTWO: MatSelect;
  protected _onDestroyNivelTwo = new Subject<void>();

  //Variables Para Nivel 2 (Provincia)
  protected nivelThree: GenericFilter[];
  public nivelThreeCtrl: FormControl = new FormControl();
  public nivelThreeFilterCtrl: FormControl = new FormControl();
  public filteredNivelThree: ReplaySubject<GenericFilter[]> = new ReplaySubject<GenericFilter[]>(1);
  @ViewChild('singleSelectNTHREE', { static: false }) singleSelectNTHREE: MatSelect;
  protected _onDestroyNivelThree = new Subject<void>();

  /**
   *
   * Iniital Values Filtered Search
   *
  */
  private initValueFilterComisions() {
    this.matSelectSearchComisionCtrl.valueChanges
      .pipe(takeUntil(this._onDestroyer))
      .subscribe(() => {
        this.filterComisions();
      });
  }

  private initValueFilterMerchant() {
    this.matSelectSearchCadenaComercioCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterMerchants();
      });
  }

  private iniitValueFilterProfileMerchants() {
    this.matSelectSearchPerfilComercioCtrl.valueChanges
      .pipe(takeUntil(this._onDestroyPerfCom))
      .subscribe(() => {
        this.filterProfileMerchant();
      })
  }

  private initValueFilterProfileDownload() {
    this.matSelectSearchPerfilDownloadCtrl.valueChanges
      .pipe(takeUntil(this._onDestroyPerfilDonwload))
      .subscribe(() => {
        this.filterProfileDownload();
      })
  }

  /**
   *
   * Logical Search List
   *
   */

  protected filterNivelCero() {
    if (!this.nivelCero) {
      return;
    }
    // get the search keyword
    let search = this.nivelCeroFilterCtrl.value;
    if (!search) {
      this.filteredNivelCero.next(this.nivelCero.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredNivelCero.next(
      this.nivelCero.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }
  protected filterNivelOne() {
    if (!this.nivelOne) {
      return;
    }
    // get the search keyword
    let search = this.nivelOneFilterCtrl.value;
    if (!search) {
      this.filteredNivelOne.next(this.nivelOne.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredNivelOne.next(
      this.nivelOne.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterNivelTwo() {
    if (!this.nivelTwo) {
      return;
    }
    // get the search keyword
    let search = this.nivelTwoFilterCtrl.value;
    if (!search) {
      this.filteredNivelTwo.next(this.nivelTwo.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredNivelTwo.next(
      this.nivelTwo.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterNivelThree() {
    if (!this.nivelThree) {
      return;
    }
    // get the search keyword
    let search = this.nivelThreeFilterCtrl.value;
    if (!search) {
      this.filteredNivelThree.next(this.nivelThree.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredNivelThree.next(
      this.nivelThree.filter(bank => bank.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterMerchants() {
    if (!this.merchantChain) {
      return;
    }
    let search = this.matSelectSearchCadenaComercioCtrl.value;
    if (!search) {
      this.filteredFiltro.next(this.merchantChain.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredFiltro.next(
      this.merchantChain.filter(filtro => filtro.dmcChainName.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterComisions() {
    if (!this.comisiones) {
      return;
    }
    let search = this.matSelectSearchComisionCtrl.value;
    if (!search) {
      this.filteredFiltroComision.next(this.comisiones.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredFiltroComision.next(
      this.comisiones.filter(filtros => filtros.cconame.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterProfileMerchant() {
    if (!this.merchantProfile) {
      return;
    }
    let search = this.matSelectSearchPerfilComercioCtrl.value;
    if (!search) {
      this.filteredFiltroPerfilComercio.next(this.merchantProfile.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredFiltroPerfilComercio.next(
      this.merchantProfile.filter(filtros => filtros.cmpprofileId.toLowerCase().indexOf(search) > -1)
    )
  }

  protected filterProfileDownload() {
    if (!this.profileDownload) {
      return;
    }
    let search = this.matSelectSearchPerfilDownloadCtrl.value;
    if (!search) {
      this.filteredFiltroPerfildownload.next(this.profileDownload.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredFiltroPerfildownload.next(
      this.profileDownload.filter(filtros => filtros.ddpprofilename.toLowerCase().indexOf(search) > -1)
    )

  }

  /**
   *
   * Initial Values
   *
  */

  protected setInitialValueNCero() {
    this.filteredNivelCero
      .pipe(take(1), takeUntil(this._onDestroyNivelCero))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelectNCERO.compareWith = (a: GenericFilter, b: GenericFilter) => a && b && a.id === b.id;
      });
  }
  protected setInitialValueNOne() {
    this.filteredNivelOne
      .pipe(take(1), takeUntil(this._onDestroyNivelOne))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelectNONE.compareWith = (a: GenericFilter, b: GenericFilter) => a && b && a.id === b.id;
      });
  }

  protected setInitialValueNTwo() {
    this.filteredNivelTwo
      .pipe(take(1), takeUntil(this._onDestroyNivelTwo))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelectNTWO.compareWith = (a: GenericFilter, b: GenericFilter) => a && b && a.id === b.id;
      });
  }

  protected setInitialValueNThree() {
    this.filteredNivelThree
      .pipe(take(1), takeUntil(this._onDestroyNivelThree))
      .subscribe(() => {
        // setting the compareWith property to a comparison function
        // triggers initializing the selection according to the initial value of
        // the form control (i.e. _initializeSelection())
        // this needs to be done after the filteredBanks are loaded initially
        // and after the mat-option elements are available
        this.singleSelectNTHREE.compareWith = (a: GenericFilter, b: GenericFilter) => a && b && a.id === b.id;
      });
  }


  /**
   *
   * After View Init
   *
   */
  ngAfterViewInit() {
    this.setInitialValueNCero();
    this.setInitialValueNOne();
    this.setInitialValueNTwo();
    this.setInitialValueNThree();
  }


  /**
   *
   * Destroy List Search
   *
   */
  ngOnDestroy() {
    this._onDestroyNivelCero.next();
    this._onDestroyNivelCero.complete();
    this._onDestroyNivelOne.next();
    this._onDestroyNivelOne.complete();
    this._onDestroyNivelTwo.next();
    this._onDestroyNivelTwo.complete();
    this._onDestroyNivelThree.next();
    this._onDestroyNivelThree.complete();
  }

  /**
   *
   * Load list Inputs
   *
   */

  validApplicationCurrent(success: Country[]): GenericFilter[]{
    const appContryList: GenericFilter[] =  success.map(val => {
                                              return {
                                                id: val["valueCode"],
                                                name: val["description"]
                                              }
                                            });

    const localApp: Application[] = (JSON.parse(localStorage.getItem('apps')) as Application[]);
    const userApp: Application[] = this.tokenStorage.getAppByRol();

    const currentApp: Application[] = localApp.filter((item)=>userApp.filter((item2)=>item2.capApplicationID == item.capApplicationID).length > 0);

    return appContryList.filter((item)=>currentApp.filter((item2)=>item2.capCountryCode == item.id).length > 0);
  }

  loadListInput() {

    //Load Ubigeo Main
    this.merchantService.getUbigeo().subscribe(
      (success: Country[]) => {
        this.ubigeo = success;

        this.nivelCero = this.validApplicationCurrent(success);

        this.nivelCeroCtrl.setValue(this.nivelCero);
        this.filteredNivelCero.next(this.nivelCero.slice());
        this.nivelCeroFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroyNivelCero))
          .subscribe(() => {
            this.filterNivelCero();
          });

        this.nivelCeroCtrl.setValue(this.nivelCero.filter((item) => item.id == this.merchant.cmrCountryCode)[0]);

        this.nivelOne = success
          .filter((item) => item.valueCode == this.nivelCeroCtrl.value.id)[0]
          .children
          .map((val) => {
            return {
              id: val["valueCode"],
              name: val["description"]
            }
          });

        this.nivelOneCtrl.setValue(this.nivelOne);
        this.filteredNivelOne.next(this.nivelOne.slice());
        this.nivelOneFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroyNivelOne))
          .subscribe(() => {
            this.filterNivelOne();
          });

        this.nivelOneCtrl.setValue(this.nivelOne.filter((item) => item.id == this.merchant.cmrDepartCode)[0]);
      }, error => console.error('Error al cargar ubigeo.'),
      () => {
        this.loadInitialCountry();
      }
    );

    this.merchantChainService.getAllMerchantChain().subscribe(
      dataInput => {
        console.log("Completado Cadena de Comercio");
        this.merchantChain = dataInput;
        this.matSelectCadenaComercioCtrl.setValue(this.merchantChain);
        this.filteredFiltro.next(this.merchantChain.slice());
        this.initValueFilterMerchant();
        this.filteredFiltro
          .pipe(take(1), takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filtermerchant.compareWith = (a: MerchantChain, b: MerchantChain) => a && b && a.cmcchainID === b.cmcchainID;
          });
      },
      error => console.error('Error al trae las cadenas de comercios'),
      () => {
        //let merchantChainID: number = (JSON.parse(JSON.stringify(this.merchant.cmrMerchantChain)) as MerchantChain).cmcchainID;
        //this.loadProfilePlan(merchantChainID + '');
      }
    );

    this.merchantProfileService.getAll().subscribe(
      dataInput => {

        this.merchantProfile = dataInput;

        //this.matSelectPerfilComercioCtrl.setValue(this.merchantProfile);
        this.fieldsContenido.controls['cmrProfileId'].setValue(this.merchant.cmrProfileId);

        const profile = this.merchantProfile.find(el => el.cmpprofileId == this.merchant.cmrProfileId);
        this.fieldsContenido.controls['cmrProfileId'].setValue(profile);

        this.filteredFiltroPerfilComercio.next(this.merchantProfile.slice());

        this.iniitValueFilterProfileMerchants();
        this.filteredFiltroPerfilComercio
          .pipe(take(1), takeUntil(this._onDestroyPerfCom))
          .subscribe(() => {
            this.filterperfilcomercio.compareWith = (a: MerchantProfile, b: MerchantProfile) => a && b && a.cmpprofileId === b.cmpprofileId;
          })
      },
      error => {
        console.error('Error al trae los perfiles de comercios')
      }
    );

    // this.loadProfilePlan("");

    this.merchantService.getOperadorTelefonico().subscribe(
      (dataInput: Country[]) => {
        this.operadorTelefonico =
          //NOTA: Se coloca en duro (HardCode) debido aque esta informacion no encuentra en el usuario en el formato especificado
          dataInput.filter((item) => item.fatherCode == 'CJCOCR');
      },
      error => {
        console.error('Error al cargar OperadorTelefonico.')
      }
    );

    // this.merchantService.getAllComissionsByApp().subscribe(
    //   dataInput => {
    //     this.comisiones = dataInput;

    //     //this.matSelectComisionCtrl.setValue(this.comisiones);
    //     const comision = this.comisiones.find(el => el.ncoidCommission == this.merchant.cmrComision);
    //     this.fieldsContenido.controls['cmrComision'].setValue(comision);

    //     this.filteredFiltroComision.next(this.comisiones.slice());
    //     this.initValueFilterComisions();
    //     this.filteredFiltroComision
    //       .pipe(take(1), takeUntil(this._onDestroyer))
    //       .subscribe(() => {
    //         this.filtercomision.compareWith = (a: Comision, b: Comision) => a && b && a.ncoidCommission === b.ncoidCommission;
    //       });
    //   },
    //   error => {
    //     console.error('Error al cargar comisiones.')
    //   }
    // );

    this.merchantProfileService.appsByMerchantProfileId(this.merchant.cmrProfileId).subscribe((resp: any) => {
      let apps =  resp.map(element => `'${element}'`).join(',');
      console.log("apps resp", resp);

      this.merchantService.getAllComissionsByApps(resp).subscribe(dataInput => {
        this.comisiones = dataInput;
        const comision = this.comisiones.find(el => el.ncoidCommission == this.merchant.cmrComision);
        this.fieldsContenido.controls['cmrComision'].setValue(comision);
        this.matSelectComisionCtrl.setValue(this.comisiones);
        this.filteredFiltroComision.next(this.comisiones.slice());
        this.initValueFilterComisions();
        this.filteredFiltroComision
          .pipe(take(1), takeUntil(this._onDestroyer))
          .subscribe(() => {
            this.filtercomision.compareWith = (a: Comision, b: Comision) => a && b && a.ncoidCommission === b.ncoidCommission;
          });
      },
      error => {
        console.error('Error al cargar comisiones.')
      });


      this.merchantService.getDownloadProfileByApps(apps).subscribe(dataInput => {
        this.profileDownload = dataInput;
        const profileDownload = this.profileDownload.find(el => el.cdpprofileid == this.merchant.cmrDownloadProfile);
        this.fieldsContenido.controls['cmrDownloadProfile'].setValue(profileDownload);

        this.matSelectPerfilDownloadCtrl.setValue(this.profileDownload);
        this.filteredFiltroPerfildownload.next(this.profileDownload.slice());
        this.initValueFilterProfileDownload();
        this.filteredFiltroPerfildownload
          .pipe(take(1), takeUntil(this._onDestroyPerfilDonwload))
          .subscribe(() => {
            this.filterperfildownload.compareWith = (a: PerfilDownload, b: PerfilDownload) => a && b && a.cdpprofileid === b.cdpprofileid;
          })
      },
      error => {
        console.error('Error, no carga los perfiles de download');
      });
    });


  }

  loadProfilePlan(codCC: string) {
    this.merchantService.getPerfilDownload(codCC).subscribe(
      dataInput => {

        this.profileDownload = dataInput;
        //this.matSelectPerfilDownloadCtrl.setValue(this.profileDownload);
        const profileDownload = this.profileDownload.find(el => el.cdpprofileid == this.merchant.cmrDownloadProfile);
        this.fieldsContenido.controls['cmrDownloadProfile'].setValue(profileDownload);
        this.filteredFiltroPerfildownload.next(this.profileDownload.slice());
        this.initValueFilterProfileDownload();
        this.filteredFiltroPerfildownload
          .pipe(take(1), takeUntil(this._onDestroyPerfilDonwload))
          .subscribe(() => {
            this.filterperfildownload.compareWith = (a: PerfilDownload, b: PerfilDownload) => a && b && a.cdpprofileid === b.cdpprofileid;
          })
      },
      error => {
        console.error('Error, no carga los perfiles de download');
      }
    )
  }

  validatedForm(): boolean {
    this.errors = [];

    // console.log("form errors");
    // console.log(JSON.stringify(this.fieldsContenido.getRawValue()));

    if (this.fieldsContenido.getRawValue()['dmrMerchantName'] == undefined || this.fieldsContenido.getRawValue()['dmrMerchantName'] == '') {
      this.errors.push({ name: this.MSG_NAME, message: "El campo Nombre se encuentra vacío" });
    }

    if (this.fieldsContenido.getRawValue()['nmrCuentaLocal'] == undefined || this.fieldsContenido.getRawValue()['nmrCuentaLocal'] == '') {
      this.errors.push({ name: this.MSG_LOCAL_ACCOUNT, message: "Campo Número de Cuenta Local se encuentra vacío" });
    }

    if (this.fieldsContenido.getRawValue()['dmrAddress'] == undefined || this.fieldsContenido.getRawValue()['dmrAddress'] == '') {
       this.errors.push({ name: this.MSG_ADDRESS, message: "Campo Dirección se encuentra vacío" });
     }

    if (this.fieldsContenido.getRawValue()['cmrRucCode'] == undefined || this.fieldsContenido.getRawValue()['cmrRucCode'] == '') {
      this.errors.push({ name: this.MSG_RUC_CODE, message: "Campo Razón Social se encuentra vacío" });
    }

     if (this.fieldsContenido.getRawValue()['nmrCuentaExtranjera'] == undefined || this.fieldsContenido.getRawValue()['nmrCuentaExtranjera'] == '') {
      this.errors.push({ name: this.MSG_FOREING_ACCOUNT, message: "Campo Número de Cuenta Extranjera se encuentra vacío" });
    }

    if (this.fieldsContenido.getRawValue()['nmrCuentaExtranjera'].length > 9) {
      this.errors.push({ name: this.MSG_FOREING_ACCOUNT, message: "Campo Número de Cuenta puede tener maximo 9 cifras" });
    }

    if (this.fieldsContenido.getRawValue()['cmrMerchantChain'] == undefined || this.fieldsContenido.getRawValue()['cmrMerchantChain'] == '') {
      this.errors.push({ name: this.MSG_TRADE_CHAIN, message: "Seleccione la Cadena de Comercio" });
    }

    if (this.fieldsContenido.getRawValue()['cmrMCC'] == undefined || this.fieldsContenido.getRawValue()['cmrMCC'] == '') {
        this.errors.push({ name: this.MSG_AFFILIATE_NUMBER, message: "Campo Número de Afiliado se encuentra vacío" });
    }

    if (this.fieldsContenido.getRawValue()["cmrProfileId"] == undefined || this.fieldsContenido.getRawValue()["cmrProfileId"] == '') {
      this.errors.push({ name: this.MSG_MERCHANT_PROFILE, message: this.validationMessages.cmrProfileId.required });
    }

    if (this.fieldsContenido.getRawValue()["cmrDownloadProfile"] == undefined || this.fieldsContenido.getRawValue()["cmrDownloadProfile"] == '') {
      this.errors.push({ name: this.MSG_DOWNLOAD_PROFILE, message: this.validationMessages.cmrDownloadProfile.required });
    }

    if (this.fieldsContenido.getRawValue()["cmrComision"] == undefined || this.fieldsContenido.getRawValue()["cmrComision"] == '') {
      this.errors.push({ name: this.MSG_COMISION_PROFILE, message: this.validationMessages.cmrComision.required });
    }

    if (this.fieldsContenido.getRawValue()["cmrEmail"] !== undefined && this.fieldsContenido.getRawValue()["cmrEmail"] !== '' && !this.isValidEmailFormater(this.fieldsContenido.getRawValue()["cmrEmail"])) {
      this.errors.push({ name: this.MSG_EMAIL_FORMAT, message: "El valor del campo Notificación de correo es inválido" });
    }

    if(!(this.nivelCeroCtrl.value && this.nivelCeroCtrl.value['id'])) {
      this.errors.push({ name: this.MSG_UBICACION_PAIS, message: "El valor del campo País es obligatorio" });
    }

    if (!(this.nivelOneCtrl.value && this.nivelOneCtrl.value['id'])) {
      this.errors.push({ name: this.MSG_UBICACION_NIVEL1, message: "El valor del campo Nivel 1 es obligatorio" });
    }

    if (!(this.nivelTwoCtrl.value && this.nivelTwoCtrl.value['id'])) {
      this.errors.push({ name: this.MSG_UBICACION_NIVEL2, message: "El valor del campo Nivel 2 es obligatorio" });
    }

    if (!(this.nivelThreeCtrl.value && this.nivelThreeCtrl.value['id'])) {
      this.errors.push({ name: this.MSG_UBICACION_NIVEL3, message: "El valor del campo Nivel 3 es obligatorio" });
    }

    // console.log("Errors");
    // console.log(JSON.stringify(this.errors));
    console.log(this.errors);

    return this.errors.length == 0 ? true : false;
  }

  getMessage(keyMessage: string): string {
    return this.errors.filter(
      (item: HelperMessage) =>
        item.name == keyMessage).length > 0 ? this.errors.filter((item: HelperMessage) => item.name == keyMessage
        )[0].message : this.MSG_NONE;
  }

  isValidEmailFormater(email: string): boolean {
    return new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,4})+$/).test(email);
  }

  onChangeAcceptPayment(event) {
    const currentValue = this.fieldsContenido.controls['cmrAcceptCompanyPayment'].value;

    if (!!currentValue && currentValue == "1") {
      this.fieldsContenido.controls['cmrAcceptCompanyPayment'].setValue('0');
    } else {
      this.fieldsContenido.controls['cmrAcceptCompanyPayment'].setValue('1');
    }

    // if (event.currentTarget.checked) {
    //   this.fieldsContenido.controls['cmrAcceptCompanyPayment'].setValue('0');
    // } else {
    //   this.fieldsContenido.controls['cmrAcceptCompanyPayment'].setValue('1');
    // }
  }


  popupDelete(): void {

    this.tipo=1;

    this.registerAudit = new RegisterAudit(this.auditService, ConstantUtils.MODULE_POINT_OF_SALE_CONF, ConstantUtils.MODOPTION_MERCHANT, this.tokenStorage.getFullNameByUser(), this.route.snapshot.paramMap.get('cmrMerchantId'), ConstantUtils.AUDIT_OPTION_TYPE_DELETE);
    this.selectItems.push(this.merchant);
    if (this.selectItems.length > 0) {

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
              this.selectItems[0].cmrProfileId;
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

                  this.router.navigateByUrl("/config-red/comercio");
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
                this.registerAudit.setEntityOld = this.originalMerchant;
                this.registerAudit.saveCurrentAudit();
                this.router.navigateByUrl("/config-red/comercio");
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

  changeMerchProfile(){
    this.merchantProfileService.appsByMerchantProfileId(this.fieldsContenido.controls.cmrProfileId.value.cmpprofileId).subscribe((resp: any) => {
      let apps =  resp.map(element => `'${element}'`).join(',');

      this.merchantService.getAllComissionsByApps(resp).subscribe(dataInput => {
        this.comisiones = dataInput;
        this.matSelectComisionCtrl.setValue(this.comisiones);
        this.filteredFiltroComision.next(this.comisiones.slice());
        this.initValueFilterComisions();
        this.filteredFiltroComision
          .pipe(take(1), takeUntil(this._onDestroyer))
          .subscribe(() => {
            this.filtercomision.compareWith = (a: Comision, b: Comision) => a && b && a.ncoidCommission === b.ncoidCommission;
          });
      },
      error => {
        console.error('Error al cargar comisiones.')
      });


      this.merchantService.getDownloadProfileByApps(apps).subscribe(dataInput => {
        this.profileDownload = dataInput;
        this.matSelectPerfilDownloadCtrl.setValue(this.profileDownload);
        this.filteredFiltroPerfildownload.next(this.profileDownload.slice());
        this.initValueFilterProfileDownload();
        this.filteredFiltroPerfildownload
          .pipe(take(1), takeUntil(this._onDestroyPerfilDonwload))
          .subscribe(() => {
            this.filterperfildownload.compareWith = (a: PerfilDownload, b: PerfilDownload) => a && b && a.cdpprofileid === b.cdpprofileid;
          })
      },
      error => {
        console.error('Error, no carga los perfiles de download');
      });


    });

  }

}
