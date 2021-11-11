import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, from } from "rxjs";
import { Merchant } from "../entidades/merchant";
import { Injectable } from "@angular/core";
import { Country } from "../entidades/country";
import { Comision } from "../entidades/comision";
import { PerfilDownload } from "../entidades/perfilDownload";
import { concatMap, mergeMap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { UtilsTemp } from "../shared/entities/utils-temp";
import { AuthService } from "../shared/services/auth.service";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
  providedIn: "root",
})
export class MerchantService {

  private urlEndPoints: string = environment.urlGateway;


  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllMerchants(): Observable<Merchant[]> {
    return this.http.get<Merchant[]>(
      this.urlEndPoints +
        UtilsTemp.TM_MERCHAR_ROUTE_MAIN +
        "?app=" +
        this.authService.app
    );
  }

  getAllMerchantsPageWithApplication(
    pages: number[],
    size: number,
    app: string
  ): any {
    return from(pages).pipe(
      concatMap(
        (page) =>
          <Observable<any>>(
            this.http.get<Merchant[]>(
              this.urlEndPoints +
                UtilsTemp.TM_MERCHAR_ROUTE_MAIN +
                UtilsTemp.TM_MERCHAR_ROUTE_PAGE_BY_APP +
                "?page=" +
                page +
                "&size=" +
                size +
                "&app=" +
                app
            )
          )
      )
    );
  }

  getAllMerchantsPageThreadWithApplication(
    pages: number[],
    size: number,
    app: string
  ): any {
    return from(pages).pipe(
      mergeMap(
        (page) =>
          <Observable<any>>(
            this.http.get<Merchant[]>(
              this.urlEndPoints +
                UtilsTemp.TM_MERCHAR_ROUTE_MAIN +
                UtilsTemp.TM_MERCHAR_ROUTE_PAGE_BY_APP +
                "?page=" +
                page +
                "&size=" +
                size +
                "&app=" +
                app
            )
          ),
        8
      )
    );
  }

  getAllMerchantsPage(pages: number[], size: number): any {
    return from(pages).pipe(
      concatMap(
        (page) =>
          <Observable<any>>(
            this.http.get<Merchant[]>(
              this.urlEndPoints +
                UtilsTemp.TM_MERCHAR_ROUTE_MAIN +
                UtilsTemp.TM_MERCHAR_ROUTE_PAGE +
                "?page=" +
                page +
                "&size=" +
                size +
                "&app=" +
                this.authService.app
            )
          )
      )
    );
  }

  getAllMerchantsPageThread(pages: number[], size: number): any {
    return from(pages).pipe(
      mergeMap(
        (page) =>
          <Observable<any>>(
            this.http.get<Merchant[]>(
              this.urlEndPoints +
                UtilsTemp.TM_MERCHAR_ROUTE_MAIN +
                UtilsTemp.TM_MERCHAR_ROUTE_PAGE +
                "?page=" +
                page +
                "&size=" +
                size +
                "&app=" +
                this.authService.app
            )
          ),
        8
      )
    );
  }

  getAllMerchantsPageLite(pages: number[], size: number): any {
    return from(pages).pipe(
      concatMap(
        (page) =>
          <Observable<any>>(
            this.http.post<Merchant[]>(
              this.urlEndPoints +
                UtilsTemp.TM_MERCHAR_ROUTE_MAIN +
                UtilsTemp.TM_MERCHAR_ROUTE_PAGE_LITE +
                "?page=" +
                page +
                "&size=" +
                size,
              this.authService.getApp()
            )
          )
      )
    );
  }

  getAllMerchantsPageThreadLite(pages: number[], size: number): any {
    return from(pages).pipe(
      mergeMap(
        (page) =>
          <Observable<any>>(
            this.http.post<Merchant[]>(
              this.urlEndPoints +
                UtilsTemp.TM_MERCHAR_ROUTE_MAIN +
                UtilsTemp.TM_MERCHAR_ROUTE_PAGE_LITE +
                "?page=" +
                page +
                "&size=" +
                size,
              this.authService.getApp()
            )
          ),
        8
      )
    );
  }

  getAllMerchantsPageLiteChain(
    pages: number[],
    size: number,
    chain: string,
    app: string
  ): any {
    return from(pages).pipe(
      concatMap(
        (page) =>
          <Observable<any>>(
            this.http.post<Merchant[]>(
              this.urlEndPoints +
                UtilsTemp.TM_MERCHAR_ROUTE_MAIN +
                UtilsTemp.TM_MERCHAR_ROUTE_PAGE_LITE_CHAIN +
                "?page=" +
                page +
                "&size=" +
                size +
                "&chain=" +
                chain,
              app
            )
          )
      )
    );
  }

  getAllMerchantsPageThreadLiteChain(
    pages: number[],
    size: number,
    chain: string,
    app: string
  ): any {
    return from(pages).pipe(
      mergeMap(
        (page) =>
          <Observable<any>>(
            this.http.post<Merchant[]>(
              this.urlEndPoints +
                UtilsTemp.TM_MERCHAR_ROUTE_MAIN +
                UtilsTemp.TM_MERCHAR_ROUTE_PAGE_LITE_CHAIN +
                "?page=" +
                page +
                "&size=" +
                size +
                "&chain=" +
                chain,
              app
            )
          ),
        8
      )
    );
  }

  getIdCorrela() {
    return this.http.get<any>(
      `${this.urlEndPoints + UtilsTemp.TM_MERCHAR_ROUTE_MAIN}/getIdCorrela`
    );
  }

  create(merchant: Merchant): Observable<any> {
    return this.http.post(
      this.urlEndPoints + UtilsTemp.TM_MERCHAR_ROUTE_MAIN,
      merchant
    );
  }

  updateMerchant(merchant: Merchant) {
    const merchantTemp = { ...merchant };
    return this.http.put(
      `${this.urlEndPoints + UtilsTemp.TM_MERCHAR_ROUTE_MAIN}`,
      merchantTemp
    );
  }

  deleteMany(merchantDel: Merchant[]): Observable<any> {
    return this.http.post(
      `${this.urlEndPoints + UtilsTemp.TM_MERCHAR_ROUTE_MAIN}/deletemerchants`,
      merchantDel
    );
  }

  getUbigeo(): Observable<Country[]> {
    return this.http.get<Country[]>(
      this.urlEndPoints + UtilsTemp.TM_DICCIONARY_ROUTE_MAIN + "/ubigeo"
    );
  }

  getOperadorTelefonico(): Observable<Country[]> {
    return this.http.get<Country[]>(
      this.urlEndPoints + UtilsTemp.TM_DICCIONARY_ROUTE_MAIN + "/OperatorCode"
    );
  }

  //obtener merchant POR ID
  getMerchantID(id: string) {
    return this.http.get(
      this.urlEndPoints +
        UtilsTemp.TM_MERCHAR_ROUTE_MAIN +
        UtilsTemp.TM_MERCHAR_ROUTE_FIND_BY_ID +
        id
    );
  }

  //perfil de comision listaAll
  getAllComissions(): Observable<Comision[]> {
    return this.http.get<Comision[]>(
      this.urlEndPoints + UtilsTemp.TM_DICCIONARY_ROUTE_MAIN + "/comission"
    );
  }

  getPerfilDownload(codCC: string): Observable<PerfilDownload[]> {
    return this.http.get<PerfilDownload[]>(
      this.urlEndPoints +
        UtilsTemp.TM_DICCIONARY_ROUTE_MAIN +
        UtilsTemp.TM_DICCIONARY_DP_ROUTE_FIND_BY_MERCHANT_CHAIN +
        codCC
    );
  }

  getAllComissionsByApp(): Observable<Comision[]> {
    return this.http.get<Comision[]>(
      this.urlEndPoints +
        UtilsTemp.TM_DICCIONARY_ROUTE_MAIN +
        "/comission/" +
        this.authService.app
    );
  }

  checkDuplicates(merchant: Merchant): Observable<any> {
    return this.http.post(this.urlEndPoints + UtilsTemp.TM_MERCHAR_ROUTE_MAIN + UtilsTemp.CHECK_DUPLICATES, merchant);
  }

  checkDuplicateRuc(merchant: Merchant): Observable<any> {
    return this.http.post(this.urlEndPoints + UtilsTemp.TM_MERCHAR_ROUTE_MAIN + UtilsTemp.TM_MERCHAR_ROUTE_DUPLICATE_RUC, merchant);
  }

  validationMerchTerminal(idMerch: string){
    return this.http.get<boolean>(`${this.urlEndPoints}${UtilsTemp.TM_MERCHAR_ROUTE_MAIN}/validationMerchTerminal/${idMerch}`);
  }

  getAllComissionsByApps(apps: string[]): Observable<Comision[]> {
    return this.http.post<Comision[]>(this.urlEndPoints + UtilsTemp.TM_DICCIONARY_ROUTE_MAIN + "/comission/getAllByApps", apps);
  }

  getDownloadProfileByApps(apps: string): Observable<PerfilDownload[]> {
    return this.http.get<PerfilDownload[]>(this.urlEndPoints + UtilsTemp.TM_DICCIONARY_ROUTE_MAIN+ UtilsTemp.TM_DICCIONARY_DP_ROUTE_FIND_BY_MERCHANT_CHAIN + 'apps/' + apps);
  }
}
