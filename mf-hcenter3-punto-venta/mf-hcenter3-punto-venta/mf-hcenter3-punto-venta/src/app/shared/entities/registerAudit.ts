import { Observable } from 'rxjs';
import { AuditService } from '../services/audit.service';
import { AuditSaveRequest } from './auditSaveRequest';

export class RegisterAudit {
  protected _module: string;
  protected _modOption: string;
  protected _codUser: string;
  protected _typeOption: number;
  protected _entityId: string;
  protected _idManc: number;

  protected _entityOld: any;
  protected _entityCurrent: any;
  protected _auditServices: AuditService;

  constructor(
    auditServices: AuditService,
    module: string,
    modOption: string,
    codUser: string,
    entityId: string,
    typeOption: number
  ) {
    this._auditServices = auditServices;
    this._module = module;
    this._modOption = modOption;
    this._codUser = codUser;
    this._entityId = entityId;
    this._typeOption = typeOption;
  }

  public saveCurrentAudit(type?: number) {
    console.log('Auditoria');
    console.log(JSON.stringify(type));
    const typeCurrent = type == undefined ? 0 : type;
    this._auditServices.saveAudit(this.getModelSave(), typeCurrent).subscribe(
      (success: AuditSaveRequest) => {
        console.log('SaveAudit <Exitoso>');
      },
      (error) => console.log('Error Servicio-Audit <saveAudit>')
    );
  }

  public saveCurrentAuditObservable(type?: number): Observable<any> {
    console.log('Auditoria');
    console.log(JSON.stringify(type));
    const typeCurrent = type == undefined ? 0 : type;
    return this._auditServices.saveAudit(this.getModelSave(), typeCurrent);
  }

  protected getModelSave(): AuditSaveRequest {
    let request: AuditSaveRequest = new AuditSaveRequest();

    request.module = this._module;
    request.modOption = this._modOption;
    request.codUser = this._codUser;
    request.typeOption = this._typeOption;
    request.entityId = this._entityId;
    request.idManc = this._idManc;

    request.entityOld = JSON.stringify(this._entityOld);
    request.entityCurrent = JSON.stringify(this._entityCurrent);

    console.log(request);

    return request;
  }

  debug() {
    // console.log(JSON.stringify(this.getModelOld(this._entityOld)));
    // console.log("datos");
    // console.log(JSON.stringify(this.getModelSave()));
    // console.log("OLD")
    // console.log(JSON.stringify(this._entityOld));
    // console.log("NEW")
    // console.log(JSON.stringify(this._entityCurrent));
    // console.log("Current");
    // console.log(JSON.stringify(this.getModelSave()))
    // console.log("COMPARER")
    // console.log(JSON.stringify(this.getModelSave()));
  }

  public set setEntityOld(theEntityOld: any) {
    this._entityOld = { ...theEntityOld };
  }

  public set setEntityCurrent(theEntityCurrent: any) {
    this._entityCurrent = theEntityCurrent;
  }

  public set setEntityId(theEntityId: any) {
    this._entityId = theEntityId;
  }

  public set setIdManc(theIdManc: any) {
    this._idManc = theIdManc;
  }
}
