import { QuotaMerchant } from './quota-merchant';
import { TransactionQuota } from './transaction-quota';

export class QuotaHeaderInput {
    merchantId:string;
    applicationId:string;
    quotas: QuotaInput[];
}

export class QuotaHeaderExtendInput extends QuotaHeaderInput{
    transactions?: TransactionQuota[];
    quotasDiario?: QuotaMerchant[];
    quotasMensual?: QuotaMerchant[];
}

export class QuotaInput {
    transactionId:string;

    // periodo diario
    action:string;
    limitAmount:number;
    limitTimes:number;
   
    // periodo mensual
    actionMes:string;
    limitAmountMes:number;
    limitTimesMes:number;
   
}