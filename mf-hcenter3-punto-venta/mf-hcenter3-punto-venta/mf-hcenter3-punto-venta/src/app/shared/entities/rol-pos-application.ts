import { FloorLimit } from "./floor-limit";

export class RolPosApplication {
    cmamerchantProfileId: string;
    cmaapplicationID: string;

    cmamultCurrency: string;
    cmareqLastNumber: string;
    cmareqDocId: string;
    cmareqCashBack: string;
    cmamultiproduct: string;

    cmacardWriter: string;
    cmacloseType: string;
    cmatrxDefault: string;
    cmaconfirmCardEntryMode: string;

    cmareqHourOperation: string;
    cmahourOperationFrom: string;
    cmahourOperationTo: string;

    cmareqMinimumAmount: string;
    nmaminAmountLocal: string;
    cmareqAlarmSMS: string;
    cmareqAlarmEmail: string;

    cmamodifyUser: string;
    fmamodifyDate: string;
    hmamodifyTime: string;
    listFloorLimit: FloorLimit[];
}
