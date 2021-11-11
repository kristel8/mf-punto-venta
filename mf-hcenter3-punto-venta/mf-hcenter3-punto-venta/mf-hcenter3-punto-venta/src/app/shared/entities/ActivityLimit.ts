export class ActivityLimit {
    groupCardId:string;
    transactionId:string;
    transactionName:string;
    transactionDescription:string;
    applicationId:string;

    // periodo diario
    action:string;
    limitAmount:number;
    limitAmountDollar:number;
    limitTimes:number;


    // periodo mensual
    actionMes:string;
    limitAmountMes:number;
    limitAmountDollarMes:number;
    limitTimesMes:number;


    periodo:string;

}
