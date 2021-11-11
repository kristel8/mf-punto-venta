import { Application } from "./application";

export class ConstantUtils {
    static MODULE_POINT_OF_SALE_CONF:string = "I20";
    static MODOPTION_MERCHANT_PROFILE:string = "E0020";
    static MODOPTION_MERCHANT:string = "E0021";
    static MODOPTION_TERMINAL:string = "E0022";
    static MODOPTION_MERCHANT_CHAIN:string = "E0029";
    static MODOPTION_QUOTA_MERCHANT:string = "E0055";

    static MODULE_CARD_CONFIG:string = "I21";
    static MODOPTION_ACTIVITY_LIMITS:string = "E0023";
    static MODOPTION_BINES_RANGE_OPERATOR:string = "E0024";
    static MODOPTION_GROUP_CARD:string = "E0022";

    static MODULE_SECURITY:string = "I04";
    static MODOPTION_USER_POS:string = "E0062";
    static MODOPTION_ROL_POS:string = "E0063";
    static MODOPTION_USER_WEB:string = "E0026";
    static MODOPTION_ROL_WEB:string = "E0027";
    static MODOPTION_CONFIG_LDAP:string = "E0030";
    static MODOPTION_SECURITY_USER_WEB:string = "E0065";

    static MODULE_LIQUIDACION:string = "I34";
    static MODOPTION_COMMISSION:string = "E0001";

    static MODULE_CONFIG_TRANSACTION:string = "I19";
    static MODOPTION_MANT_TRANSACTION: string = "E0037";
    static MODOPTION_MANT_APPLICATION: string = "E0036";

    static MODULE_PUBLIC_SERVICES: string = "I80";
    static MODOPTION_CATEGORY:string = "E0001";
    static MODOPTION_SUB_CATEGORY:string = "E0002";
    static MODOPTION_AFILIADOS:string = "E0003";
    static MODOPTION__OPCIONES_AFILIADOS:string = "E0004";
    static MODOPTION__OPCIONES_AFILIADOS_UBICACION:string = "E0005";
    static MODOPTION_AFILIADOS_CADENA_COMERCIO:string = "E0006";

    static MODULE_CONFIG_GENERAL_FIELD:string = "I23";
    static MODOPTION_MANT_FIELD: string = "E0001";

    static AUDIT_OPTION_TYPE_CREATE:number = 0;
    static AUDIT_OPTION_TYPE_UPDATE:number = 1;
    static AUDIT_OPTION_TYPE_DELETE:number = 2;

    static getAppDescription(appCode:string): string{
        let appFilter:Array<any> = (JSON.parse(localStorage.getItem('apps')) as Application[]).filter((item)=>item.cApApplicationID==appCode);
        return appFilter.length > 0 ? appFilter[0].dapApplicationName : appCode == "0" ? "Todas" : appCode;
        //return appCode == "0" ? "Todas" : (JSON.parse(localStorage.getItem('apps')) as Application[]).filter((item)=>item.capApplicationID==appCode)[0].dapApplicationName;
    }
}
