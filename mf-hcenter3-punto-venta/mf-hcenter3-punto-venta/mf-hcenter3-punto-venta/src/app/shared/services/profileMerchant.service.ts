import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MerchantProfile } from '../entities/merchant-profile';
import { UtilsTemp } from '../entities/utils-temp';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileMerchantService {

  private urlEndPoints = `${environment.urlGateway}${UtilsTemp.TM_PROFILE_MERCHAR_ROUTE_MAIN}`;

  constructor(private http: HttpClient,private authService: AuthService) {}

  getAll(): Observable<MerchantProfile[]> {
    return this.http.get<MerchantProfile[]>(this.urlEndPoints +  "?app="+ this.authService.app).pipe(
      map((data:MerchantProfile[]) => data.sort((a, b) => Number((b.fmpModifyDate + b.hmpModifyTime)) - Number((a.fmpModifyDate + a.hmpModifyTime))))
    );
  }

  getById(id: string): Observable<MerchantProfile> {
    return this.http.get<MerchantProfile>(this.urlEndPoints + UtilsTemp.TM_PROFILE_MERCHAR_ROUTE_FIND_BY_ID + id);
  }

  create(merchantProfile: MerchantProfile): Observable<MerchantProfile> {
    return this.http.post<MerchantProfile>(this.urlEndPoints , merchantProfile);
  }

  update(merchantProfile: MerchantProfile): Observable<MerchantProfile> {
    return this.http.put<MerchantProfile>(this.urlEndPoints , merchantProfile);
  }


  deleteByID(merchantProfileID: string): Observable<MerchantProfile> {
    return this.http.delete<MerchantProfile>(this.urlEndPoints + UtilsTemp.TM_PROFILE_MERCHAR_ROUTE_DELETE_BY_ID + merchantProfileID);
  }

  checkDuplicates(merchantProfile: MerchantProfile): Observable<any> {
    return this.http.post(this.urlEndPoints + UtilsTemp.CHECK_DUPLICATES, merchantProfile);
  }

  appsByMerchantProfileId(id: string): Observable<MerchantProfile> {
    return this.http.get<MerchantProfile>(this.urlEndPoints + UtilsTemp.TM_PROFILE_MERCHAR_ROUTE_FIND_BY_ID + 'appsByMerchantProfileId/' + id);
  }

  findMerchantByProfile(id: string): Observable<MerchantProfile> {
    return this.http.get<MerchantProfile>(this.urlEndPoints + UtilsTemp.TM_PROFILE_MERCHAR_ROUTE_FIND_BY_ID + 'findMerchantByProfile/' + id);
  }

}
