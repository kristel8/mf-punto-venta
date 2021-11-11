import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequestUtils {
  // MERCHANT_CHAIN
  public TYPE_STATUS_VIEWED_PENDING = 0;
  public TYPE_STATUS_REQUEST_PENDING_LABEL = 0;

  // req
  public TYPE_REQUEST_CREATE_ES = 'Nuevo'; // Se guardara en ingles y se presentara en el idioma.
  public TYPE_REQUEST_EDIT_ES = 'Edicion'; // Se guardara en ingles y se presentara en el idioma.
  public TYPE_REQUEST_DELETE_ES = 'Eliminacion'; // Se guardara en ingles y se presentara en el idioma.


  // name for the modules related to the approval request
  public MODULE_NAME_MERCHANT_CHAIN = 'Cadena de Comercio';
  public MODULE_NAME_CHAIN = 'Comercio';
  public MODULE_NAME_PROFILE_MERCHANT = 'Perfil de Comercio';
  public MODULE_NAME_NETWORK_PROFILE = 'Perfil de Red';
  public MODULE_NAME_TERMINAL = 'Terminal';

  public FECHA_ACTUAL = this.fecha('');
  public FORMAT_ANIO_MES_DIA = this.fechaAmD('');
  public FORMAT_HORA_MIN_SEG = this.horaMS('');

  //strings para POPUP

  //ERROR
  public POPUP_TITLE_ERROR = 'Error';

  //ELIMINAR USUARIO
  public POPUP_TITLE_REGISTRAR = 'Registrar';
  public POPUP_TITLE_ELIMINAR = 'Eliminar';
  public POPUP_TITLE_ELIMINAR_FILE = 'Eliminar Archivos';
  public POPUP_BODY_GENERIC_ERASE_DELETE_FILE = 'Debe seleccionar al menos un archivo para su eliminación.';
  public POPUP_BODY_GENERIC_ERASE_DELETE = 'Debe seleccionar al menos un registro para su eliminación.';
  public POPUP_BODY_GENERIC_ERASE_DELETE_ASOCIADOS = 'Debe seleccionar un registro que no tenga comercios asociados.';
  public POPUP_BODY_GENERIC_ERASE_DELETE_GENERIC = 'Debe seleccionar un registro que no tenga un usuario asociado.';

  public POPUP_BODY_ELIMINAR_USER = '¿Estás seguro de eliminar a este usuario?';
  public POPUP_BODY_ELIMINAR_USER_POS = '¿Estás seguro de eliminar a este Usuario Pos?';
  public POPUP_BODY_ELIMINAR = '¿Estás seguro de eliminar a este usuario?'; //se puede eliminar o no? [DUDA]
  public POPUP_BODY_ELIMINAR_ROLE = '¿Estás seguro de eliminar a este Rol?';
  public POPUP_BODY_ELIMINAR_LDAP = '¿Estás seguro de eliminar a esta configuración LDAP?';
  public POPUP_BODY_ELIMINAR_ROLE_POS = 'Estás seguro de eliminar a este Rol Pos?';
  public POPUP_BODY_ELIMINAR_QUOTA = '¿Estás seguro de eliminar este Cupo: se eliminará el cupo diario y mensual?';
  public POPUP_BODY_ELIMINAR_LIMITE = '¿Estás seguro de eliminar este Límite: se eliminará el límite diario y mensual?';
  public POPUP_BODY_ELIMINAR_PROFILE = '¿Estás seguro de eliminar a este Perfil de Comercio?';
  public POPUP_BODY_ELIMINAR_MERCHANT_CHAIN = 'Estás seguro de eliminar a este Cadena de Comercio?';
  public POPUP_BODY_ELIMINAR_MERCHANT = '¿Estás seguro de eliminar a este Comercio?';
  public POPUP_BODY_ELIMINAR_TERMINAL = '¿Estás seguro de eliminar a este Terminal?';
  public POPUP_BODY_ELIMINAR_VERSION = '¿Estás seguro de eliminar esta Versión?';
  public POPUP_BODY_ELIMINAR_VERSION_FILE = '¿Estás seguro de eliminar esta archivo?';
  public POPUP_BODY_ELIMINAR_PLAN_DESCARGA = '¿Estás seguro de eliminar este Plan de Descarga?';
  public POPUP_BODY_ELIMINAR_CUPO = '¿Estás seguro de eliminar a este Cupo de Comercio?';

  public POPUP_BODY_ELIMINAR_MERCHANT_CUPO = 'Estás seguro de eliminar todos los cupos asociados a este Comercio?';
  public POPUP_BODY_ELIMINAR_GROUPCARD_LIMIT = '¿Estas seguro de eliminar todos los límites de actividad asociado?';
  public POPUP_BODY_ELIMINAR_BINES_RAMGE = '¿Estas seguro de eliminar este rango de Bines?';
  public POPUP_BODY_ELIMINAR_BINES_RAMGE_MANY = '¿Estas seguro de eliminar estos Rango de Bines?';

  public POPUP_BODY_ELIMINAR_CATEGORIA = '¿Estás seguro de eliminar esta categoría?';
  public POPUP_BODY_ELIMINAR_MUCHAS_CATEGORIA = '¿Estás seguro de eliminar estas categorías?';

  public POPUP_BODY_ELIMINAR_SUB_CATEGORIA = '¿Estás seguro de eliminar esta sub-categoría?';

  public POPUP_BODY_ELIMINAR_MUCHAS_SUB_CATEGORIA = '¿Estás seguro de eliminar estas sub-categorías?';

  public POPUP_BODY_ELIMINAR_INVALIDO_UNITARIO= 'No se puede eliminar, se encuentra en uso';
  public POPUP_BODY_ELIMINAR_INVALIDO_MUCHOS = 'No se pueden eliminar, uno a más ítems se encuentran en uso';



  public POPUP_BODY_ELIMINAR_MANCOMUNADO_SUPERVISOR = '¿Estás seguro de eliminar este supervisor?';
  public POPUP_BODY_ELIMINAR_COMMISSION = '¿Estás seguro de eliminar a esta Comisión?';
  public POPUP_BODY_ELIMINAR_COMMISSION_MERCH = 'No se puede eliminar este registro, está relacionado a uno o más comercios.';


  public POPUP_BODY_ELIMINAR_APLICATION = '¿Estás seguro de eliminar a esta aplicación?';
  public POPUP_BODY_ELIMINAR_TRANSACTION = '¿Estás seguro de eliminar a esta transacción?';

  public POPUP_BODY_ELIMINAR_AFILIADO= '¿Estás seguro de eliminar a este afiliado?';
  public POPUP_BODY_ELIMINAR_MUCHOS_AFILIADO= '¿Estás seguro de eliminar estos afiliados?';

  public POPUP_BODY_ELIMINAR__OPCION_AFILIADO= '¿Estás seguro de eliminar a esta opción de afiliado?';
  public POPUP_BODY_ELIMINAR___MUCHOS_OPCION_AFILIADO= '¿Estás seguro de eliminar estas opciones de afiliado?';

  public POPUP_BODY_ELIMINAR_GROUP_CARD= '¿Estas seguro de eliminar este Grupo de Tarjeta?';
  public POPUP_BODY_ELIMINAR_GROUP_CARD_MANY= '¿Estas seguro de eliminar estos Grupos de Tarjetas?';

  public POPUP_BODY_EXIST_ACTIVITY_GROUP_CARD= 'No se puede eliminar los registros, están relacionado a uno o más limites de actividad.';
  public POPUP_BODY_EXIST_OPTION_AFILIATE_BY_AFILIATE= 'No se puede eliminar, se encuentra en uso';
  public POPUP_BODY_EXIST_OPTION_AFILIATE_BY_AFILIATES= 'No se pueden eliminar, uno a más ítems se encuentran en uso';

  public POPUP_BODY_ELIMINAR_FIELD = '¿Estás seguro de eliminar a este Campo?';
  public POPUP_BODY_ELIMINAR_FIELD_MANY = '¿Estas seguro de eliminar estos Campos?';

  //AGREGAR

  // public POPUP_BODY_ADD_QUOTA = 'Estás seguro de realizar estos cambios?';
  public POPUP_BODY_ADD_QUOTA = '¿Desea guardar la información?';

  public POPUP_BODY_ADD_LIMITE = 'Estás seguro de realizar estos cambios?';
  public POPUP_BODY_ADD_LIMITE2 = 'Estas seguro de agregar estos limites?';
  public POPUP_TITLE_AGREGAR = 'Agregar';
  public POPUP_BODY_GENERIC_ADD = 'Debe seleccionar al menos una Transacción para agregar.';

  public POPUP_BODY_GENERIC_CHANGES = 'No has realizado ningún cambio';

  // Validaciones configuracion de transaciones
  public POPUP_RELATION_PROFILE_APP = 'No se puede eliminar este registro, pues esta relacionado con terminal';
  public POPUP_RELATION_PROFILE_TRANSACTION = 'No se puede eliminar este registro, pues esta relacionado con Perfiles de comercio';




  fecha(fecha: string) {
    const fechaActual = new Date();
    const dia = fechaActual.getDate().toString();
    const mes = ('0' + (fechaActual.getMonth() + 1)).slice(-2);
    const anio = fechaActual.getFullYear().toString();
    const hora = fechaActual.getHours().toString();
    const minutos = fechaActual.getMinutes().toString();
    const segundos = fechaActual.getSeconds().toString();
    /*
    this.Fecha = dia + "-" + mes + "-" + anio;
    this.Hora = hora + ":" + minutos + ":" + segundos;*/
    return fecha = dia + '/' + mes + '/' + anio + ' ' + hora + ':' + minutos + ':' + segundos;
  }

  fechaAmD(fecha: string) {
    const fechaActual = new Date();
    const dia = fechaActual.getDate().toString();
    const mes = ('0' + (fechaActual.getMonth() + 1)).slice(-2);
    const anio = fechaActual.getFullYear().toString();
    const hora = fechaActual.getHours().toString();
    const minutos = fechaActual.getMinutes().toString();
    const segundos = fechaActual.getSeconds().toString();
    /*
    this.Fecha = dia + "-" + mes + "-" + anio;
    this.Hora = hora + ":" + minutos + ":" + segundos;*/
    return fecha = anio + mes + dia;
  }

  horaMS(fecha: string) {
    const fechaActual = new Date();
    const dia = fechaActual.getDate().toString();
    const mes = ('0' + (fechaActual.getMonth() + 1)).slice(-2);
    const anio = fechaActual.getFullYear().toString();
    const hora = fechaActual.getHours().toString();
    const minutos = fechaActual.getMinutes().toString();
    const segundos = fechaActual.getSeconds().toString();
    /*
    this.Fecha = dia + "-" + mes + "-" + anio;
    this.Hora = hora + ":" + minutos + ":" + segundos;*/
    return fecha = hora + minutos + segundos;
  }

  DateTofechaAmD(fecha: Date) {

    const dia = fecha.getDate().toString();
    const mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
    const anio = fecha.getFullYear().toString();
    const hora = fecha.getHours().toString();
    const minutos = fecha.getMinutes().toString();
    const segundos = fecha.getSeconds().toString();

    return anio + mes + dia;
  }

  parsefechaAmDToDate(value: string): Date | null {

    if (value === undefined || value === null || value === '') {
      return null;
    }

    if (value.indexOf('/') > -1) {
      const str = value.split('/');
      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      return new Date(year, month, date);
    } else {
      const year = Number(value.substr(0, 4));
      const month = Number(value.substr(4, 2)) - 1;
      const date = Number(value.substr(6, 2));
      return new Date(year, month, date);
    }
  }



}
