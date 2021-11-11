import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UtilsTemp } from '../entities/utils-temp';
import { TxListField } from '../entities/tx-list-field';

@Injectable({
  providedIn: 'root'
})
export class ListFieldService {

  private API_URL: string = `${environment.urlGateway}${UtilsTemp.TM_DICCIONARY_ROUTE_MAIN}`;

  constructor(private http: HttpClient) { }

  getField(param: string): Observable<TxListField[]> {
    return this.http.get<TxListField[]>(this.API_URL + '/' + param);
  }
}
