import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApplicationMant } from '../shared/entities/tmApplication';
import { TxParameter } from '../shared/entities/txParameter';
import { UtilsTemp } from '../shared/entities/utils-temp';
import { AuthService } from '../shared/services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class ApplicationMantService {

  private urlEndPoints: string = environment.urlGateway;


  constructor(private http: HttpClient, private authService: AuthService) { }

  getApplications(){
    return this.http.get(`${this.urlEndPoints}${UtilsTemp.TM_MANT_APPLICATION_MAIN}`);
  }

  getApplicationByApp(){
    console.log(this.authService.app);
    return this.http.get(`${this.urlEndPoints}${UtilsTemp.TM_MANT_APPLICATION_MAIN}/app/${this.authService.app}`);
  }

  getParams(){
    return this.http.get<TxParameter[]>(`${this.urlEndPoints}${UtilsTemp.TM_MANT_APPLICATION_MAIN}/parameters`);
  }

  getMonedas(){
    return this.http.get<any[]>(`${this.urlEndPoints}${UtilsTemp.TM_MONEDAS}`);
  }

  createApplicaction(applicaction: ApplicationMant){
    return this.http.post<ApplicationMant>(`${this.urlEndPoints}${UtilsTemp.TM_MANT_APPLICATION_MAIN}`, applicaction);
  }

  updateApplicaction(applicaction: ApplicationMant){
    return this.http.put<ApplicationMant>(`${this.urlEndPoints}${UtilsTemp.TM_MANT_APPLICATION_MAIN}`, applicaction);
  }

  getApplicationById(app: string){
    return this.http.get<ApplicationMant>(`${this.urlEndPoints}${UtilsTemp.TM_MANT_APPLICATION_MAIN}/${app}`);
  }

  deleteApplication(applicaction: string){
    return this.http.delete<ApplicationMant>(`${this.urlEndPoints}${UtilsTemp.TM_MANT_APPLICATION_MAIN}/${applicaction}`);
  }

  getRelationProfileMerch(idApp: string, idTran: string){
    return this.http.get<boolean>(`${this.urlEndPoints}${UtilsTemp.TM_MANT_APPLICATION_MAIN}/profileMerchRelation/${idApp}/${idTran}`);
  }

  existApplication(idApp: string){
    return this.http.get<boolean>(`${this.urlEndPoints}${UtilsTemp.TM_MANT_APPLICATION_MAIN}/existApplication/${idApp}`);
  }

}
