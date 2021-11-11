import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { UtilsTemp } from '../entities/utils-temp';
import { TransactionType } from '../entities/transaction-type';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private API_URL: string = `${environment.urlGateway}${UtilsTemp.TM_DICCIONARY_ROUTE_MAIN}`;

  constructor(private http: HttpClient) {}

  getTransaction(): Observable<TransactionType[]> {
    return this.http.get<TransactionType[]>(
      this.API_URL + UtilsTemp.TM_DICCIONARY_MAIN_TRANSACTION
    );
  }

  getTransactionByApp(appId: string): Observable<TransactionType[]> {
    return this.http.get<TransactionType[]>(
      this.API_URL +
        UtilsTemp.TM_DICCIONARY_MAIN_TRANSACTION +
        UtilsTemp.TM_DICCIONARY_ROUTE_TRANSACTION_BY_APP +
        appId
    );
  }
}
