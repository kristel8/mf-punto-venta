export class QuotaMerchant {
    transactionId:string;
    transactionName:string;
    transactionDescription:string;

    merchantId:string;
    applicationId:string;

    // periodo diario
    action:string;
    limitAmount:number;
    limitAmountDolar:number;
    limitTimes:number;
    limitAmountAcum:number;
    limitAmountDollarAcum:number;
    limitTimesAcum:number;
    
    // periodo mensual
    actionMes:string;
    limitAmountMes:number;
    limitAmountDolarMes:number;
    limitTimesMes:number;
    limitAmountAcumMes:number;
    limitAmountDollarAcumMes:number;
    limitTimesAcumMes:number;
}