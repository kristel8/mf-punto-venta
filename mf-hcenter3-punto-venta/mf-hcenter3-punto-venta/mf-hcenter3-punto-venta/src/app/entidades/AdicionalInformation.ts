import { TransactionType } from "../shared/entities/transaction-type";

export class AdicionalInformation {

    public listTrasacction: TransactionType[] = [];
    public listTrasacctionSelection: TransactionType[] = [];

    constructor(listTrans: TransactionType[], listTransSel: TransactionType[]) {

        if (listTrans) {
            this.listTrasacction = listTrans;
        }

        if (listTransSel) {
            this.listTrasacctionSelection = listTransSel;
        }

    }

}
