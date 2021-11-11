import { ActivityLimit } from './ActivityLimit';
import { TransactionLimit } from './transaction-limit';

export class ActivityLimitHeaderInput {
    groupCardId: string;
    applicationId: string;
    limits: ActivityLimitInput[];
}

export class ActivityLimitHeaderExtendInput extends ActivityLimitHeaderInput{
    transactions?: TransactionLimit[];
    limitesDiario?: ActivityLimit[];
    limitesMensual?: ActivityLimit[];
}

export class ActivityLimitInput {

    transactionId: string;
    // periodo diario
    limitAmount: number;
    limitTimes: number;
    action: string;

    //periodo mensual
    limitAmountMes: number;
    limitTimesMes: number;
    actionMes: string;
}
