import { TaParamApplication } from "./taParamAplication";
import { TaParamDetApplication } from "./taParamDetApplication";

export class ApplicationMant{
    capapplicationid: string;
    dapapplicationname: string;
    dapapplicationflow: string;
    napapplicationflowsize: string;
    capmodifyuser: string;
    fapmodifydate: string;
    hapmodifytime: string;
    caplocalcurrency: string;
    capforigncurrency: string;
    capclosingtypeperiod: string;
    capclosingperiod: string;
    dappackage: string;
    capcountrycode: string;

    paramsApplication: TaParamApplication[];
    paramDetsApplication: TaParamDetApplication[];

    monedaLocalDes: string;
    monedaExtranjeraDes: string;

    constructor(){
        this.capclosingtypeperiod = '';
        this.capclosingperiod = '';
        this.caplocalcurrency = '';
        this.capforigncurrency = '';
        this.paramsApplication = [];
        this.paramDetsApplication = [];
        this.dapapplicationflow = '';
    }

}
