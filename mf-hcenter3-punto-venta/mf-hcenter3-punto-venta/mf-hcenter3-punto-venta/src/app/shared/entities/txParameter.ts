import { TaParameterDet } from "./txParameterDet";

export class TxParameter{
    cpmParameterId: string;
    npmNumericValue: string;
    dpmTextValue: string;
    dpmDescription: string;

    detalle: TaParameterDet[];
    checked: boolean;

    paramDetId: string;

    paramNameView: string;

    constructor(){
        this.paramDetId = '';
        this.paramDetId = '';
        this.checked = false;
    }
}