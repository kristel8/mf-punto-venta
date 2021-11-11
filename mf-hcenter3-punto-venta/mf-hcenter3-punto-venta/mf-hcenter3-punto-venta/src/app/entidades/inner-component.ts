import { MerchantProfileApplication } from './merchant-profile-application';
import { FloorLimit } from './floor-limit';
import { TransactionType } from '../shared/entities/transaction-type';

export class InnerComponent {
  private merchantProfileApplication: MerchantProfileApplication;

  listTransactionType: TransactionType[];
  selectItems = [];
  selectItemInit = [];

  flagMultimoneda: boolean;
  flagCuatroUlDigitos: boolean;
  flagSolicitarDNI: boolean;
  flagCashBack: boolean;
  flagMultiproducto: boolean;

  valueDigitacionTarjeta: string;
  valueTipoCierre: string;
  valueTrxDefault: string;
  valueIngresoTarejta: string;

  flagHoraAtencion: boolean;
  valueHoraInicio: string;
  valueMinutoInicio: string;
  valueHoraFin: string;
  valueMinutoFin: string;

  flagAlarmaMontoMinimo: boolean;
  valueMontoMonedaLocal: string;
  valueMontoMonedaExtranjera: string;
  flagAlarmaSMS: boolean;
  flagAlamarEmail: boolean;

  show: boolean = false;

  constructor(listTransactionType: TransactionType[], merchantProfileApplication: MerchantProfileApplication) {
    this.listTransactionType = listTransactionType;
    this.initValuesParteUno();
    this.initValuesComboBox();
    this.initValuesParteDos();
    this.initValuesParteTres();
    if (merchantProfileApplication != undefined) {
      this.merchantProfileApplication = merchantProfileApplication;
      this.getTrxSelectInit();
      this.loadValues();
    } else {
      this.merchantProfileApplication = new MerchantProfileApplication();
    }
    this.show = true;
  }

  initValuesParteUno() {
    this.flagMultimoneda = false;
    this.flagCuatroUlDigitos = false;
    this.flagSolicitarDNI = false;
    this.flagCashBack = false;
    this.flagMultiproducto = false;

    this.valueDigitacionTarjeta = '';
    this.valueTipoCierre = '';
    this.valueTrxDefault = '';
    this.valueIngresoTarejta = '';
  }

  initValuesComboBox() {
    this.valueDigitacionTarjeta = '';
    this.valueTipoCierre = '';
    this.valueTrxDefault = '';
    this.valueIngresoTarejta = '';
  }

  initValuesParteDos() {
    this.flagHoraAtencion = false;
    this.valueHoraInicio = '00';
    this.valueMinutoInicio = '0000';
    this.valueHoraFin = '00';
    this.valueMinutoFin = '0000';
  }

  initValuesParteTres() {
    this.flagAlarmaMontoMinimo = false;
    this.valueMontoMonedaLocal = '0.00';
    this.valueMontoMonedaExtranjera = '0.00';
    this.flagAlarmaSMS = false;
    this.flagAlamarEmail = false;
  }

  processDataOutPut(array: any[]) {
    this.selectItems = array;
  }

  getOutPutData(userCode: string, profileId: string, aplicationID: string): MerchantProfileApplication {
    this.getMerchantProfileApplication(userCode, profileId, aplicationID);
    this.merchantProfileApplication.listFloorLimit = this.getTransactionSelect(userCode, profileId, aplicationID);
    return this.merchantProfileApplication;
  }

  private getMerchantProfileApplication(userCode: string, profileId: string, aplicationID: string) {
    this.merchantProfileApplication.cmamerchantProfileId = profileId;
    this.merchantProfileApplication.cmaapplicationID = aplicationID;

    this.merchantProfileApplication.cmamultCurrency = this.getValueFromBoolean(this.flagMultimoneda);
    this.merchantProfileApplication.cmareqLastNumber = this.getValueFromBoolean(this.flagCuatroUlDigitos);
    this.merchantProfileApplication.cmareqDocId = this.getValueFromBoolean(this.flagSolicitarDNI);
    this.merchantProfileApplication.cmareqCashBack = this.getValueFromBoolean(this.flagCashBack);
    this.merchantProfileApplication.cmamultiproduct = this.getValueFromBoolean(this.flagMultiproducto);

    this.merchantProfileApplication.cmacardWriter = this.valueDigitacionTarjeta;
    this.merchantProfileApplication.cmacloseType = this.valueTipoCierre;
    this.merchantProfileApplication.cmatrxDefault = this.valueTrxDefault;
    this.merchantProfileApplication.cmaconfirmCardEntryMode = this.valueIngresoTarejta;

    this.merchantProfileApplication.cmareqHourOperation = this.getValueFromBoolean(this.flagHoraAtencion);
    this.merchantProfileApplication.cmahourOperationFrom = this.valueHoraInicio + this.valueMinutoInicio;
    this.merchantProfileApplication.cmahourOperationTo = this.valueHoraFin + this.valueMinutoFin;

    this.merchantProfileApplication.cmareqMinimumAmount = this.getValueFromBoolean(this.flagAlarmaMontoMinimo);
    this.merchantProfileApplication.nmaminAmountLocal = this.valueMontoMonedaLocal;
    this.merchantProfileApplication.cmareqAlarmSMS = this.getValueFromBoolean(this.flagAlarmaSMS);
    this.merchantProfileApplication.cmareqAlarmEmail = this.getValueFromBoolean(this.flagAlamarEmail);

    this.merchantProfileApplication.cmamodifyUser = userCode;
  }

  private getTransactionSelect(userCode: string, profileId: string, aplicationID: string): FloorLimit[] {
    const listFloorLimit: FloorLimit[] = [];
    this.selectItems.forEach(
      (trx: TransactionType) => {
        const floorLimit = new FloorLimit();
        floorLimit.cflmrProfileId = profileId;
        floorLimit.cflaplicacion = aplicationID;
        floorLimit.cfltransactionId = trx.ctttransactionId;
        floorLimit.cflmodifyUser = userCode;
        listFloorLimit.push(floorLimit);
      });
    return listFloorLimit;
  }

  private loadValues() {
    this.flagMultimoneda = this.getValueFromString(this.merchantProfileApplication.cmamultCurrency);
    this.flagCuatroUlDigitos = this.getValueFromString(this.merchantProfileApplication.cmareqLastNumber);
    this.flagSolicitarDNI = this.getValueFromString(this.merchantProfileApplication.cmareqDocId);
    this.flagCashBack = this.getValueFromString(this.merchantProfileApplication.cmareqCashBack);
    this.flagMultiproducto = this.getValueFromString(this.merchantProfileApplication.cmamultiproduct);

    this.valueDigitacionTarjeta = this.merchantProfileApplication.cmacardWriter;
    this.valueTipoCierre = this.merchantProfileApplication.cmacloseType;
    this.valueTrxDefault = this.merchantProfileApplication.cmatrxDefault;
    this.valueIngresoTarejta = this.merchantProfileApplication.cmaconfirmCardEntryMode;

    this.flagHoraAtencion = this.getValueFromString(this.merchantProfileApplication.cmareqHourOperation);
    this.valueHoraInicio = this.merchantProfileApplication.cmahourOperationFrom.substring(0, 2);
    this.valueMinutoInicio = this.merchantProfileApplication.cmahourOperationFrom.substring(2, 6);
    this.valueHoraFin = this.merchantProfileApplication.cmahourOperationTo.substring(0, 2);
    this.valueMinutoFin = this.merchantProfileApplication.cmahourOperationTo.substring(2, 6);

    this.flagAlarmaMontoMinimo = this.getValueFromString(this.merchantProfileApplication.cmareqMinimumAmount);
    this.valueMontoMonedaLocal = this.merchantProfileApplication.nmaminAmountLocal;
    this.flagAlarmaSMS = this.getValueFromString(this.merchantProfileApplication.cmareqAlarmSMS);
    this.flagAlamarEmail = this.getValueFromString(this.merchantProfileApplication.cmareqAlarmEmail);
  }

  private getValueFromBoolean(value: boolean): string {
    if (value) {
      return '0';
    }
    return '1';
  }

  private getValueFromString(value: string): boolean {
    if (value == '0') {
      return true;
    }
    return false;
  }

  getTrxSelectInit() {
    if (this.merchantProfileApplication.listFloorLimit != undefined) {
      this.listTransactionType.forEach(
        trx => {
          this.merchantProfileApplication.listFloorLimit.forEach(
            floor => {
              if (floor.cfltransactionId == trx.ctttransactionId) {
                this.selectItemInit.push(trx);
              }
            });
        });
    }
  }
}
