export class UtilsConstant {

    /**
     * Mensaje de PopUp A mostrar
     */
    static MSG_POPUP_TITLE_CONTENT:string = "Comentario";
    static MSG_POPUP_COMMENT_CONTENT:string = "Agregar Comentario";
    static MSG_POPUP_APP_ERASE:string = "Debe seleccionar la Aplicación.";

    /**
     * Tipos de Operacion de la solucitud.
     */
    static TYPE_REQUEST_CREATE:number = 0;
    static TYPE_REQUEST_EDIT:number = 1;
    static TYPE_REQUEST_DELETE:number = 2;

    /**
     * Tipo de estado de la Solicitud.
     */
    static TYPE_REQUEST_APPROVAL_PENDING:number = 0;
    static TYPE_REQUEST_APPROVAL_APPROVAL:number = 1;
    static TYPE_REQUEST_APPROVAL_REJECTED:number = 2;

    /**
     * Estados de Notificacion.
     */
    static STATUS_NOTICATION_ACTIVE:number = 0;
	static STATUS_NOTICATION_INACTIVE:number = 1;

    /**
     * Modulos que Soportan Mancomunado. es el equivale de la tabla "tmOptionManc" DB=dbHCENTER2
     */
    static TM_REQUEST_MERCHANT:number = 	1; 					//Comercio 
    static TM_REQUEST_MANT_USER_WEB:number = 	2; 				//Mantenimiento de Usuarios Web 
    static TM_REQUEST_MANT_ROLE_WEB:number = 	3; 				//Mantenimiento de Roles Web 
    static TM_REQUEST_MANT_USER_POS:number = 	4; 				//Mantenimiento de Usuarios Pos 
    static TM_REQUEST_MANT_ROLE_POS:number = 	5; 				//Mantenimiento de Roles Pos 
    static TM_REQUEST_PROFILER_MERCHANT:number = 	6; 			//Perfiles de Comercio 
    static TM_REQUEST_MAX_AMOUNT_BY_TRANSACCION:number = 	7; 	//Importes Máximos por Transacción //
    static TM_REQUEST_MANT_MERCHANT_CHAIN:number = 	8; 			//Mantenimiento de Cadena de Comercio 
    static TM_REQUEST_ACTIVITY_LIMITS:number = 	9; 				//Límites de Actividad  
    static TM_REQUEST_MANT_SUPERVISORS:number = 10; 			//Mantenimiento de Supervisores 
    static TM_REQUEST_MANT_COMISIONS:number = 11; 				//Mantenimiento de Comisiones 
    static TM_REQUEST_TERMINAL:number = 12; 					//Terminales 
    static TM_REQUEST_MANT_ACOUNT:number = 13; 					//Mantenimiento de Cuentas 
    static TM_REQUEST_MANT_CATEGORY:number = 14; 				//Mantenimiento de Categorías 
    static TM_REQUEST_MANT_SUBCATEGORY:number = 15; 			//Mantenimiento de SubCategorías 
    static TM_REQUEST_MANT_AFFILIATE:number = 16; 				//Mantenimiento de Afiliados 
    static TM_REQUEST_MANT_OPTION_AFFILIATE:number = 17; 		//Mantenimiento de Opciones por Afiliado 
    static TM_REQUEST_GEO_LOCATIONS_AFFILIATE:number = 18; 		//Asociar Ubicaciones Geográficas a  Afiliado 
    static TM_REQUEST_CHAINS_COMMERCE_ASSOCIATE:number = 19; 	//Asociar Cadenas de Comercio a  Afiliado 
    static TM_REQUEST_BIN_LOCK_OPERATOR:number = 20; 			//Bloqueo de Bines de Operador  
    static TM_REQUEST_WEB_USER_SECURITY_SETTINGS:number = 21; 	//Configuración de Seguridad de Usuarios Web 
    static TM_REQUEST_MANT_APPLICATION:number = 22; 			//Mantenimiento de Aplicaciones 
    static TM_REQUEST_TRANSACTION_TYPE:number = 23; 			//Tipos de Transacciones 
    static TM_REQUEST_GROUP_CARD:number = 24; 					//Grupo de Tarjeta 
    static TM_REQUEST_MANT_VERSION:number = 25; 				//Mantenimiento de Versiones 
    static TM_REQUEST_MANT_DOWNLOAD_PROFILE:number = 26; 		//Mantenimiento de Perfiles de Carga 
    static TM_REQUEST_DOWNLOAD_PROFILE_ALLOCATION:number = 27; 	//Asignación Perfiles de Carga 
    static TM_REQUEST_MANT_QUOTA_MERCHANT:number = 28; 			//Mantenimiento de Cupo por Comercio 

    static TM_REQUEST_MANT_GENERAL_FIELD:number = 	30; 
    static TM_REQUEST_EXCHANGE_RATE_FIELD:number = 	31; 
}