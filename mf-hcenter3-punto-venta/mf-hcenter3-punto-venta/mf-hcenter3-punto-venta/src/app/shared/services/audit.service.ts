import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuditRequest } from '../entities/auditRequest';
import { AuditResponse } from '../entities/auditResponse';
import { AuditSaveRequest } from '../entities/auditSaveRequest';
import { Country } from '../entities/country';
import { ModuleResponse } from '../entities/moduleResponse';
import { UserWebDTO } from '../entities/userWebDTO';
import { UtilsTemp } from '../entities/utils-temp';


@Injectable({
  providedIn: 'root'
})
export class AuditService {

  private urlEndPoints: string = environment.urlGateway;

  constructor(private http:HttpClient) { }

  public findConditionAudit(request: AuditRequest):Observable<AuditResponse[]>{
    return this.http.post<AuditResponse[]>(this.urlEndPoints + UtilsTemp.TM_AUDIT_ROUTE_MAIN, request);
  }

  public findAllModule():Observable<ModuleResponse[]>{
    return this.http.get<ModuleResponse[]>(this.urlEndPoints + UtilsTemp.TM_AUDIT_ROUTE_MAIN + UtilsTemp.TM_AUDIT_ROUTE_ALL_MODULE);
  }

  public getOperType(): Observable<Country[]> {
    return this.http.get<Country[]>(this.urlEndPoints + UtilsTemp.TM_DICCIONARY_ROUTE_MAIN + UtilsTemp.TM_AUDIT_ROUTE_ALL_OPER_TYPE);
  }

  public getAllUserWeb(): Observable<UserWebDTO[]> {
    return this.http.get<UserWebDTO[]>(this.urlEndPoints + UtilsTemp.TM_AUDIT_ROUTE_MAIN + UtilsTemp.TM_AUDIT_ROUTE_ALL_USER_WEB);
  }

  public saveAudit(request:AuditSaveRequest, type: number): Observable<any>{
    return this.http.post(this.urlEndPoints + UtilsTemp.TM_AUDIT_ROUTE_MAIN + UtilsTemp.TM_AUDIT_ROUTE_SAVE_AUDIT + UtilsTemp.TM_AUDIT_ROUTE_SAVE_PARAM + type, request);
  }
}
