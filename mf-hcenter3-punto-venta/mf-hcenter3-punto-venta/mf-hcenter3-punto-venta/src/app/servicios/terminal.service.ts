import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Terminal } from '../entidades/terminal';
import { concatMap, mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { RequestUtils } from '../shared/entities/request-util';
import { TxListField } from '../shared/entities/tx-list-field';
import { UtilsTemp } from '../shared/entities/utils-temp';
import { AuthService } from '../shared/services/auth.service';
import { TokenStorageService } from '../shared/services/token-storage.service';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TerminalService {

  private urlEndPoints = environment.urlGateway;

  constructor(
    private http: HttpClient,
    private tokenStorage: TokenStorageService,
    private requestUtil: RequestUtils,
    private authService: AuthService) {}

  getAllTerminal(): Observable<any> {
    return this.http.get<Terminal[]>(this.urlEndPoints + UtilsTemp.TM_TERMINAL_ROUTE_MAIN +  "?app="+ this.authService.app);
  }

  getAllTerminalPageWithApplication(pages:number[], size:number, app: string): any {
    return from(pages).pipe(
      concatMap(page => <Observable<any>>
          this.http.get<Terminal[]>(
            this.urlEndPoints + UtilsTemp.TM_TERMINAL_ROUTE_MAIN + UtilsTemp.TM_TERMINAL_ROUTE_PAGE_BY_APP
            +"?page="
            +page
            +"&size="
            +size
            +"&app="
            +app)
        )
    );
  }

  getAllTerminalPageThreadWithApplication(pages:number[], size:number, app: string): any {
    return from(pages).pipe(
      mergeMap(page => <Observable<any>>
          this.http.get<Terminal[]>(
            this.urlEndPoints + UtilsTemp.TM_TERMINAL_ROUTE_MAIN + UtilsTemp.TM_TERMINAL_ROUTE_PAGE_BY_APP
            +"?page="
            +page
            +"&size="
            +size
            +"&app="
            +app),
            8
        )
    );
  }


  getAllTerminalPage(pages:number[], size:number): any {
    return from(pages).pipe(
      concatMap(page => <Observable<any>>
          this.http.get<Terminal[]>(
            this.urlEndPoints + UtilsTemp.TM_TERMINAL_ROUTE_MAIN + UtilsTemp.TM_TERMINAL_ROUTE_PAGE
            +"?page="
            +page
            +"&size="
            +size
            +"&app="
            +this.authService.app)
        )
    );
  }


  getAllTerminalPageThread(pages:number[], size:number): any {
    return from(pages).pipe(
      mergeMap(page => <Observable<any>>
          this.http.get<Terminal[]>(
            this.urlEndPoints + UtilsTemp.TM_TERMINAL_ROUTE_MAIN + UtilsTemp.TM_TERMINAL_ROUTE_PAGE
            +"?page="
            +page
            +"&size="
            +size
            +"&app="
            +this.authService.app),
            8
        )
    );
  }


  create(reqTerminal: Terminal): Observable<any> {
    return this.http.post( this.urlEndPoints + UtilsTemp.TM_TERMINAL_ROUTE_MAIN , reqTerminal );
  }

  update(reqTerminal: Terminal): Observable<any> {
    return this.http.put( this.urlEndPoints + UtilsTemp.TM_TERMINAL_ROUTE_MAIN , reqTerminal );
  }

  delete(reqTerminal: Terminal[]): Observable<any> {
    return this.http.post( this.urlEndPoints + UtilsTemp.TM_TERMINAL_ROUTE_MAIN + UtilsTemp.TM_TERMINAL_ROUTE_DELETE , reqTerminal );
  }

  checkDuplicates(terminal: Terminal): Observable<any> {
    return this.http.post(this.urlEndPoints + UtilsTemp.TM_TERMINAL_ROUTE_MAIN  + UtilsTemp.CHECK_DUPLICATES, terminal);
  }

  checkDuplicatesTwo(terminal: Terminal): Observable<any> {
    console.log('terminal', terminal);
    return this.http.post(this.urlEndPoints + UtilsTemp.TM_TERMINAL_ROUTE_MAIN  + UtilsTemp.CHECK_DUPLICATES, terminal);
  }

  // APIS PARA SETEAR INFORMACION A COMBOBOX TERMINALES
  getStateTerminal(): Observable<TxListField[]> {
    return this.http.get<TxListField[]>(
      /*`${this.urlMaster}/EstadoTerminal`*/
      //"/assets/json/EstadoTerminal.json"
      this.urlEndPoints + UtilsTemp.TM_DICCIONARY_ROUTE_MAIN + UtilsTemp.TM_TERMINAL_DICTIONARY_FILTER_STATUS_TERMINAL
      );
  }

  getMotivoTerminal(): Observable<TxListField[]> {
    return this.http.get<TxListField[]>(
      //`${this.urlMaster}/MotivoTerminal`
      this.urlEndPoints + UtilsTemp.TM_DICCIONARY_ROUTE_MAIN + UtilsTemp.TM_TERMINAL_DICTIONARY_FILTER_MOTIVO_TERMINAL);
  }

  getTipoTerminal(): Observable<TxListField[]> {
    return this.http.get<TxListField[]>(
      //`${this.urlMaster}/TipoTerminal`
      this.urlEndPoints + UtilsTemp.TM_DICCIONARY_ROUTE_MAIN + UtilsTemp.TM_TERMINAL_DICTIONARY_FILTER_TIPO_TERMINAL);
  }

  getModeloTerminal(): Observable<TxListField[]> {
    return this.http.get<TxListField[]>(
      //`${this.urlMaster}/ModeloTerminal`
      this.urlEndPoints + UtilsTemp.TM_DICCIONARY_ROUTE_MAIN + UtilsTemp.TM_TERMINAL_DICTIONARY_FILTER_MODELO_TERMINAL);
  }

  isUsingSerial(serial: String): Observable<Boolean> {
    return this.http.get<Boolean>(
      //`${this.urlMaster}/ModeloTerminal`
      this.urlEndPoints + UtilsTemp.TM_TERMINAL_ROUTE_MAIN + UtilsTemp.TM_TERMINAL_ROUTE_FIND_BY_SERIAL + serial);
  }

}
