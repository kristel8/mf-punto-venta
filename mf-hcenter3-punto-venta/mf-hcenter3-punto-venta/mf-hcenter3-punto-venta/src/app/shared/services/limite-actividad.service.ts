import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UtilsTemp } from '../entities/utils-temp';
import { ActivityLimit } from '../entities/ActivityLimit';
import { GroupCardLimit } from '../entities/group-card-limit';
import { ActivityLimitHeaderInput } from '../entities/activity-limit-input';
import { TransactionLimit } from '../entities/transaction-limit';
import { AuthService } from './auth.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class LimiteActividadService {

  private urlEndPoints: string = `${environment.urlGateway}${UtilsTemp.TM_LIMIT_ROUTE_MAIN}`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) { }


  nexGroupCardLS(groupCard: GroupCardLimit) {
    localStorage.setItem('groupCard-limit', JSON.stringify(groupCard));
  }

  getGroupCardLS(): GroupCardLimit {
    const groupCardLS = localStorage.getItem('groupCard-limit');
    const groupCard = JSON.parse(groupCardLS) as GroupCardLimit;
    return groupCard;
  }

  listGroupCardWithLimit(): Observable<GroupCardLimit[]> {
    return this.http.get<GroupCardLimit[]>(this.urlEndPoints + UtilsTemp.TM_LIMIT_ROUTE_FULL_GROUPCARD + "?app=" + this.authService.app, httpOptions);
  }

  listLimitsByGroupCardAndApp(groupCardId: string, applicationId: string): Observable<ActivityLimit[]> {
    const pathUrl = this.urlEndPoints + UtilsTemp.TM_LIMIT_ROUTE_FULL_LIMITS;
    return this.http.get<ActivityLimit[]>(`${pathUrl}/${groupCardId}/${applicationId}`, httpOptions);
  }

  findTransactionByGroupCardAndApp(groupCardId: string, applicationId: string): Observable<TransactionLimit[]> {
    const pathUrl = this.urlEndPoints + UtilsTemp.TM_LIMIT_ROUTE_FULL_TRANSACTION;
    return this.http.get<TransactionLimit[]>(`${pathUrl}/${groupCardId}/${applicationId}`, httpOptions);
  }


  deleteLimites(groupCard: GroupCardLimit) {
    const pathUrl = this.urlEndPoints + UtilsTemp.TM_LIMIT_ROUTE_FULL_LIMITS;
    return this.http.delete(`${pathUrl}/${groupCard.groupCardId}/${groupCard.applicationId}`, httpOptions);
  }

  deleteLimite(limit: ActivityLimit) {
    const pathUrl = this.urlEndPoints + UtilsTemp.TM_LIMIT_ROUTE_FULL_LIMITS;
    return this.http.delete(`${pathUrl}/${limit.groupCardId}/${limit.applicationId}/${limit.transactionId}`, httpOptions);
  }

  /* register(limits: ActivityLimit[]): Observable<ActivityLimit[]> {
    const pathUrl = this.urlEndPoints + UtilsTemp.TM_LIMIT_ROUTE_FULL_LIMITS;
    return this.http.post<ActivityLimit[]>(pathUrl, limits, httpOptions);
  }
 */
  register(limits: ActivityLimitHeaderInput): Observable<ActivityLimit[]> {
    const pathUrl = this.urlEndPoints + UtilsTemp.TM_LIMIT_ROUTE_FULL_LIMITS;
    return this.http.post<ActivityLimit[]>(pathUrl, limits, httpOptions);
  }

  update(limits: ActivityLimit[], periodo: string): Observable<ActivityLimit[]> {

    const httpOptionsNew = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: new HttpParams().set('periodo', periodo)
    };

    const pathUrl = this.urlEndPoints + UtilsTemp.TM_LIMIT_ROUTE_FULL_LIMITS;
    return this.http.put<ActivityLimit[]>(pathUrl, limits, httpOptionsNew);
  }

}
