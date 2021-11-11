import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { environment } from 'src/environments/environment';
import { UtilsTemp } from '../entities/utils-temp';
import { ApplicationMerchant, MerchantQuota } from '../entities/merchant-quota';
import { QuotaMerchant } from '../entities/quota-merchant';
import { TransactionQuota } from '../entities/transaction-quota';
import { QuotaMerchantInput } from '../entities/quota-merchant-input';
import { QuotaHeaderInput } from '../entities/quotaInput';
import { AuthService } from './auth.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class QuotaService {

  private urlEndPoints = `${environment.urlGateway}${UtilsTemp.TM_QUOTA_ROUTE_MAIN}`;

  private merchantSelect = new BehaviorSubject<MerchantQuota>({} as MerchantQuota);
  merchantSelect$ = this.merchantSelect.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  nextMerchant(merchant: MerchantQuota) {
    this.merchantSelect.next(merchant)
  }

  nexMerchantLS(merchant: MerchantQuota) {
    localStorage.setItem('merchant-quota', JSON.stringify(merchant));
  }

  getMerchantLS(): MerchantQuota {
    const merchantLS = localStorage.getItem('merchant-quota');
    const merchant = JSON.parse(merchantLS) as MerchantQuota;
    return merchant;
  }

  getAllMerchantQuotas(): Observable<MerchantQuota[]> {
    return this.http.get<MerchantQuota[]>(this.urlEndPoints + UtilsTemp.TM_QUOTA_ROUTE_FULL + UtilsTemp.TM_QUOTA_ROUTE_FULL_MERCHANT +   "?app="+ this.authService.app, httpOptions);
  }

  findQuotasByMerchantAndApp(merchantId: string, applicationId: string): Observable<QuotaMerchant[]> {
    const pathUrl = this.urlEndPoints + UtilsTemp.TM_QUOTA_ROUTE_FULL + UtilsTemp.TM_QUOTA_ROUTE_FULL_QUOTAS;
    return this.http.get<QuotaMerchant[]>(`${pathUrl}/${merchantId}/${applicationId}`, httpOptions);
  }

  findTransactionByMerchantAndApp(merchantId: string, applicationId: string): Observable<TransactionQuota[]> {
    const pathUrl = this.urlEndPoints + UtilsTemp.TM_QUOTA_ROUTE_FULL + UtilsTemp.TM_QUOTA_ROUTE_FULL_TRANSACTION;
    return this.http.get<TransactionQuota[]>(`${pathUrl}/${merchantId}/${applicationId}`, httpOptions);
  }

  /* saveQuotas(quotaInput: QuotaMerchantInput): Observable<QuotaMerchant[]> {
    const pathUrl = this.urlEndPoints + UtilsTemp.TM_QUOTA_ROUTE_FULL + UtilsTemp.TM_QUOTA_ROUTE_FULL_QUOTAS;
    return this.http.post<QuotaMerchant[]>(pathUrl, quotaInput, httpOptions);
  }
 */
  deleteQuotas(merchant: MerchantQuota) {
    const pathUrl = this.urlEndPoints + UtilsTemp.TM_QUOTA_ROUTE_FULL + UtilsTemp.TM_QUOTA_ROUTE_FULL_QUOTAS;
    return this.http.delete(`${pathUrl}/${merchant.merchantId}/${merchant.applicationId}`, httpOptions);
  }

  deleteQuota(quota: QuotaMerchant) {
    const pathUrl = this.urlEndPoints + UtilsTemp.TM_QUOTA_ROUTE_FULL + UtilsTemp.TM_QUOTA_ROUTE_FULL_QUOTAS;
    return this.http.delete(`${pathUrl}/${quota.merchantId}/${quota.applicationId}/${quota.transactionId}`, httpOptions);
  }


  updateQuotas(quotaInput: QuotaMerchantInput): Observable<QuotaMerchant[]> {
    const pathUrl = this.urlEndPoints + UtilsTemp.TM_QUOTA_ROUTE_FULL + UtilsTemp.TM_QUOTA_ROUTE_FULL_QUOTAS;
    return this.http.put<QuotaMerchant[]>(pathUrl, quotaInput, httpOptions);
  }

  findAppsByMerchant(merchantId:string): Observable<ApplicationMerchant[]> {
    const pathUrl = this.urlEndPoints + UtilsTemp.TM_QUOTA_ROUTE_FULL + UtilsTemp.TM_QUOTA_ROUTE_FULL_APPS;
    return this.http.get<ApplicationMerchant[]>(`${pathUrl}/${merchantId}`, httpOptions);
  }

  saveQuotas(quotas: QuotaHeaderInput): Observable<QuotaMerchant[]> {
    const pathUrl = this.urlEndPoints + UtilsTemp.TM_QUOTA_ROUTE_FULL + UtilsTemp.TM_QUOTA_ROUTE_FULL_QUOTAS;
    return this.http.post<QuotaMerchant[]>(pathUrl, quotas, httpOptions);
  }

}
