export class QuotaMerchantInput {
    merchantId: string;
    applicationId: string;
    periodo: string;
    quotas: QuotaTransactionInput[];
}

export class QuotaTransactionInput {
    transactionId: string;
    action: string;
    limitAmount: number;
    limitTimes: number;
    actionMes: string;
    limitAmountMes: number;
    limitTimesMes: number;
}