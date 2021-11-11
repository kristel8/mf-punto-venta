import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { tap, map } from 'rxjs/operators';
import { UtilsTemp } from '../entities/utils-temp';
import { ChangeType } from 'src/app/entidades/ChangeType';
import { Moneda } from 'src/app/entidades/Moneda';
import { IApplicationFilter } from '../entities/IApplicationFIlter';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  API_URL: string = `${environment.urlGateway}${UtilsTemp.TM_DICCIONARY_ROUTE_MAIN}${UtilsTemp.TM_APPLICATION_ROUTE_LIST}`;

  private urlEndPoints: string = environment.urlGateway;

  constructor(private http: HttpClient) {}

  getApps(): Observable<any> {
    return this.http.get(this.API_URL).pipe(
      tap((apps) => {
        localStorage.setItem('apps', JSON.stringify(apps));
      })
    );
  }

  getChangeTypes(): Observable<ChangeType[]> {
    return this.http
      .get<ChangeType[]>(
        this.urlEndPoints +
          UtilsTemp.TM_DICCIONARY_ROUTE_MAIN +
          UtilsTemp.TM_CHANGETYPE_ROUTE_LIST
      )
      .pipe(
        tap((changeTypes) => {
          localStorage.setItem('changeTypes', JSON.stringify(changeTypes));
        })
      );
  }

  getMonedas(): Observable<Moneda[]> {
    return this.http
      .get<Moneda[]>(
        this.urlEndPoints +
          UtilsTemp.TM_DICCIONARY_ROUTE_MAIN +
          UtilsTemp.TM_MONEDA_ROUTE_LIST
      )
      .pipe(
        tap((monedas) => {
          localStorage.setItem('monedas', JSON.stringify(monedas));
        })
      );
  }

  getMonedasLS(): Moneda[] {
    const monedasLS = localStorage.getItem('monedas');
    const monedas = JSON.parse(monedasLS) as Moneda[];
    return monedas;
  }

  getMonedaByAppLS(applicationId: string): Moneda {
    const monedas = this.getMonedasLS();
    const moneda = monedas.find((el) => el.applicationId == applicationId);
    return moneda;
  }

  getChangeTypesLS(): ChangeType[] {
    const changeTypeLS = localStorage.getItem('changeTypes');
    const changeTypes = JSON.parse(changeTypeLS) as ChangeType[];
    return changeTypes;
  }

  getChangeTypeByAppLS(applicationId: string): ChangeType {
    const changeTypesLs = this.getChangeTypesLS();
    const changeType = changeTypesLs.find(
      (el) => el.aplicacion == applicationId
    );
    return changeType;
  }

  getApplication(idUser: string): Observable<IApplicationFilter[]> {
    return (
      this.http
        .get(
          `${this.urlEndPoints}/api/hcenterv3/monitoringTerminal/applicationbyuser/${idUser}`
        )
        // .get(`${this.urlEndPoint}/monitoringTerminal/application`)
        .pipe(map((data: IApplicationFilter[]) => data))
    );
  }

}
