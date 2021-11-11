import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UtilsTemp } from '../entities/utils-temp';
import { MerchantChain } from 'src/app/entidades/merchant-chain';
import { AuthService } from './auth.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MechantChainService {

  private urlEndPoits: string = `${environment.urlGateway}${UtilsTemp.TM_MERCHAR_CHAIN_ROUTE_MAIN}`;

  private httpHeaders = new HttpHeaders({ 'Content-Type': 'aplication/json' });

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllMerchantChain(): Observable<MerchantChain[]> {
    return this.http.get<MerchantChain[]>(this.urlEndPoits + "?app=" + this.authService.app, httpOptions)
      .pipe(
        map((data: MerchantChain[]) => data.sort((a, b) => b.cmcchainID - a.cmcchainID)));
  }

  //NOTA: Se debe Realizar ajuste en el Componente PopUp Generico para soportar lista.
  //Actualmente da error al enviar al Servicio. (EG / 12-08-2020)
  private deleteMany(id: String): Observable<any> {
    return this.http.delete(this.urlEndPoits + UtilsTemp.TM_MERCHAR_CHAIN_ROUTE_DELETE_BY_ID + id);
  }

  checkDuplicates(merchchain: MerchantChain): Observable<any> {
    return this.http.post(this.urlEndPoits + UtilsTemp.CHECK_DUPLICATES, merchchain);
  }

  checkAssociates(merchchains: MerchantChain[]): Observable<any> {
    return this.http.post(this.urlEndPoits + UtilsTemp.CHECK_ASSOCIATE, merchchains);
  }

  deleteById(id: String): Observable<any> {
    console.log("ruta: " + this.urlEndPoits + UtilsTemp.TM_MERCHAR_CHAIN_ROUTE_DELETE_BY_ID + id);
    return this.http.delete(this.urlEndPoits + UtilsTemp.TM_MERCHAR_CHAIN_ROUTE_DELETE_BY_ID + id);
  }

  create(merchantChain: MerchantChain): Observable<any> {
    return this.http.post(this.urlEndPoits, merchantChain);
  }

  getMerchantChainID(id: number) {
    return this.http.get(this.urlEndPoits + UtilsTemp.TM_MERCHAR_CHAIN_ROUTE_FIND_BY_ID + id);
  }

  updateMerchantChain(merchantChain: MerchantChain) {
    const merchantChainTemp = {
      ...merchantChain
    };
    return this.http.put(this.urlEndPoits, merchantChainTemp);
  }

  getMerchantChainByApp(app: string): Observable<MerchantChain[]> {
    return this.http.get<MerchantChain[]>(this.urlEndPoits + "?app=" + app, httpOptions)
      .pipe(
        map((data: MerchantChain[]) => data.sort((a, b) => b.cmcchainID - a.cmcchainID)));
  }
}
