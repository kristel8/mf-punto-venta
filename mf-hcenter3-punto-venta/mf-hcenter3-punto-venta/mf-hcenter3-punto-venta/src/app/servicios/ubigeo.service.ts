import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommerceChain } from '../entidades/commerce-chain';
import { CommerceChainQuery } from '../entidades/commerce-chain-query';
import { CommerceQuery } from '../entidades/commerce-query';
import { CountryMonitoring } from '../entidades/country-monitoring';
import { Departament } from '../entidades/departament';
import { District } from '../entidades/district';
import { DistrictQuery } from '../entidades/district-query';
import { ParamTerminal } from '../entidades/param-terminal';
import { ProvinciasQuery } from '../entidades/provincias-query';
import { TerminalGeneralInfo } from '../entidades/terminal-general-info';
import { Province } from '../shared/entities/province';

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {

  constructor(private http: HttpClient) { }

  private urlEndPoint: string = `${environment.urlGateway}${'/api/hcenterv3'}`;

  getPaises(apps: string): Observable<CountryMonitoring[]> {
    return this.http.post<CountryMonitoring[]>(`${this.urlEndPoint}/monitoringTerminal/getPaisesByApp`, apps).pipe(
      map((res: any[]) => {
        const newData: CountryMonitoring[] = res.map(x => {
          x.name = x.nombre;
          return x;
        });
        return newData;
      }));
  }

  getDepartamentos(): Observable<Departament[]> {
    return this.http.get(`${this.urlEndPoint}/monitoringTerminal/getDepartamento`).pipe(
      map((res: any[]) => {
        const newData: Departament[] = res.map(x => {
          x.name = x.nombre;
          return x;
        });
        return newData;
      }));
  }

  getDepartamentosByCountry(paises: string): Observable<Departament[]> {
    return this.http.post(`${this.urlEndPoint}/monitoringTerminal/getDepartamentoByCountry`, paises).pipe(
      map((res: any[]) => {
        const newData: Departament[] = res.map(x => {
          x.name = x.nombre;
          return x;
        });
        return newData;
      }));
  }
  //INCIDENCIA 2609
  //cambiar post porque se estaban enviando muchos ids
  //en método get solo se permiten 2000 caracteres
  getProvincias(params: ProvinciasQuery): Observable<Province[]> {
    // return this.http.get(`${this.urlEndPoint}/monitoringTerminal/getProvincia`, { params: params as any }).pipe(
    return this.http.post(`${this.urlEndPoint}/monitoringTerminal/getProvincia`, params.idDepartamento).pipe(
      map((res: any[]) => {
        const newData: Province[] = res.map(x => {
          x.name = x.nombre;
          return x;
        });
        return newData;
      }));
  }
  //INCIDENCIA 2609
  //cambiar post porque se estaban enviando muchos ids
  //en método get solo se permiten 2000 caracteres
  getDistritos(params: DistrictQuery): Observable<District[]> {
    // return this.http.get(`${this.urlEndPoint}/monitoringTerminal/getDistrito`, { params: params as any }).pipe(
    return this.http.post(`${this.urlEndPoint}/monitoringTerminal/getDistrito`, params.idProvincia).pipe(
      map((res: any[]) => {
        const newData: District[] = res.map(x => {
          x.name = x.nombre;
          return x;
        });
        return newData;
      }));
  }

  getCommerceChain(params: CommerceChainQuery): Observable<CommerceChain[]> {
    if (params == null || params.app.trim() === '') {
      params.app = '0';
    }
    return this.http.get(`${this.urlEndPoint}/monitoringTerminal/merchChainByApp`, { params: params as any }).pipe(
      map((res: any[]) => {
        const newData: CommerceChain[] = res.map(x => {
          x.commerceChainID = x.chainID;
          x.commerceChainName = x.chainName;
          x.commerceChainDescription = x.description;
          return x;
        });
        return newData;
      }));
  }

  private makeArrayNumber(value: number) {
    let i = 0;
    const arrNumber = [];
    while(i <= value) {
      arrNumber.push(i);
      ++i;
    }
    return arrNumber;
  }

  async getCommerce(params: CommerceQuery) {
    if (params == null || params.chain.trim() === '') {
      params.chain = '0';
    }

    const firstCallParams = {
      page: 1,
      size: 1,
      chain: params.chain
    }

    const sizePage = 2000;

    const firstCall: any = await this.http.get(`${this.urlEndPoint}/monitoringTerminal/merchant/PageFindLite`, { params: firstCallParams as any }).toPromise();

    const numPages = Math.ceil(firstCall.totalElements/sizePage);

    return from(this.makeArrayNumber(numPages)).pipe(
      concatMap(page => <Observable<any>>
        this.http.get(`${this.urlEndPoint}/monitoringTerminal/merchant/PageFindLite`, { params: {chain: params.chain, size: sizePage, page: page} as any })
      )
    );
  }

  async getCommerceByApp(apps: string) {
    if (apps == null || apps.trim() === '') {
      apps = '0';
    }

    const firstCallParams = {
      page: 1,
      size: 1,
      chain: apps
    }

    const sizePage = 2000;

    const firstCall: any = await this.http.get(`${this.urlEndPoint}/monitoringTerminal/merchant/PageFindLiteApp`, { params: firstCallParams as any }).toPromise();

    const numPages = Math.ceil(firstCall.totalElements/sizePage);

    return from(this.makeArrayNumber(numPages)).pipe(
      concatMap(page => <Observable<any>>
        this.http.get(`${this.urlEndPoint}/monitoringTerminal/merchant/PageFindLiteApp`, { params: {app: apps, size: sizePage, page: page} as any })
      )
    );
  }


  getApplications(): Observable<any[]> {
    return this.http.get(`${this.urlEndPoint}/monitoringTerminal/application`).pipe(
      map((res: any[]) => {
        const newData = res.map(x => {
          x.name = x.dapApplicationName;
          return x;
        })
        return newData;
      })
    );
    //return this.http.get(`${this.urlEndPoint}/monitoringTerminal/applicationbyuser/U000001`) as Observable<any[]>;
  }

  getModels(): Observable<any[]> {
    // return this.http.get(`${this.urlEndPoint}/monitoringTerminal/modelo`).pipe(
    //   map((res: any[]) => {
    //     const newData = res.map(x => {
    //       x.name = x.dapApplicationName;
    //       return x;
    //     })
    //     return newData;
    //   })
    // );
    return this.http.get(`${this.urlEndPoint}/monitoringTerminal/modelo`) as Observable<any[]>;
  }

  getBaseChargeVersion(): Observable<any[]> {
    return this.http.get(`${this.urlEndPoint}/monitoringTerminal/cargaBase`).pipe(
      map((res: any[]) => {
        const newData = res.map(x => {
          x.name = x.ntrSWVersion;
          x.id = x.ntrSWVersion;
          return x;
        })
        return newData;
      })
    );
  }

  getBaseChargeVersionByApp(apps: string): Observable<any[]> {
    return this.http.post(`${this.urlEndPoint}/monitoringTerminal/cargaBaseByApp`, apps).pipe(
      map((res: any[]) => {
        const newData = res.map(x => {
          x.name = x.ntrSWVersion;
          x.id = x.ntrSWVersion;
          return x;
        })
        return newData;
      })
    );
  }

  getVersion(): Observable<any[]> {
    return this.http.get(`${this.urlEndPoint}/monitoringTerminal/version`).pipe(
      map((res: any[]) => {
        const newData = res.map(x => {
          x.id = x.dvrVersionNumber;
          x.name = x.dvrVersionNumber;
          return x;
        })
        return newData;
      })
    );
  }

  getVersionByApp(apps: string): Observable<any[]> {
    return this.http.post(`${this.urlEndPoint}/monitoringTerminal/versionByApp`, apps).pipe(
      map((res: any[]) => {
        const newData = res.map(x => {
          x.id = x.dvrVersionNumber;
          x.name = x.dvrVersionNumber;
          return x;
        })
        return newData;
      })
    );
  }

  //params de momento tendra codesDeparmat, codesProvincias, codesDistritos
  //esto podria cambiar o volverse un body para un post
  getTreeTerminal(paramRequest: ParamTerminal): Observable<any> {
    return this.http.post(`${this.urlEndPoint}/monitoringTerminal/nodeTreeTermianl`,  paramRequest);
  }

  getTerminal(params: any): Observable<TerminalGeneralInfo> {
    return this.http.get<TerminalGeneralInfo>(`${this.urlEndPoint}/monitoringTerminal/getTerminal`,  { params: params as any });
  }

}
