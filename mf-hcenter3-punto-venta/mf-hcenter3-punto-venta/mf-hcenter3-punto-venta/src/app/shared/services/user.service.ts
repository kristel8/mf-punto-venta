import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { User } from '../entities/user2';
import { UtilsTemp } from '../entities/utils-temp';
import { TripleDES } from '../entities/triple-des';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private urlEndPoint: string = `${environment.urlGateway}${UtilsTemp.SEC_USER_WEB_MAIN}${UtilsTemp.SEC_USER_PREFIJO}`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService) { }

  getAll(): Observable<User[]> {
    // console.log(this.urlEndPoint + "?app=" + this.authService.app);
    return this.http.get<User[]>(this.urlEndPoint + "?app=" + this.authService.app).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/user']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  getAllUserByApp(): Observable<User[]> {
    // console.log("URL: "+this.urlEndPoint + UtilsTemp.SEC_USER_FIND_ALL_USER_BY_APP + "?app=" + this.authService.app);
    return this.http.get<User[]>(this.urlEndPoint + UtilsTemp.SEC_USER_FIND_ALL_USER_BY_APP + "?app=" + this.authService.app).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/user']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  getAllUserByApps(): Observable<User[]> {
    // console.log("URL: "+this.urlEndPoint + UtilsTemp.SEC_USER_FIND_ALL_USER_BY_APPS + "?apps=" + this.authService.apps);
    return this.http.get<User[]>(this.urlEndPoint + UtilsTemp.SEC_USER_FIND_ALL_USER_BY_APPS + "?apps=" + this.authService.apps).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.mensaje) {
          this.router.navigate(['/user']);
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  // user-app

  checkDuplicates(user: User): Observable<any> {
    return this.http.post(this.urlEndPoint + UtilsTemp.CHECK_DUPLICATES, user);
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(this.urlEndPoint + UtilsTemp.SEC_USER_FIND_BY_ID + id);
  }

  update(data: User): Observable<User> {
    let userUpdate: User = data;
    const passwordCipher = data.password?TripleDES.cipher(data.password, TripleDES.key1, TripleDES.key2, TripleDES.key3):'';
    userUpdate.password = passwordCipher;
    return this.http.put<User>(this.urlEndPoint, userUpdate);
  }

  create(data: User): Observable<User> {
    let userCreate: User = data;
    const passwordCipher = TripleDES.cipher(data.password, TripleDES.key1, TripleDES.key2, TripleDES.key3);
    userCreate.password = passwordCipher;
    return this.http.post<User>(this.urlEndPoint, userCreate);
  }

  deleteMany(usersDeleting: User[]): Observable<any> {
    return this.http.post<any>(this.urlEndPoint + UtilsTemp.SEC_USER_DELETE_MANY, usersDeleting);
  }

  deleteById(id: string): Observable<any> {
    return this.http.delete<any>(this.urlEndPoint + UtilsTemp.SEC_USER_DELETE_BY_ID + id);
  }

  validationPassHistory(data: User): Observable<User> {
    let userUpdate: User = data;
    const passwordCipher = data.password?TripleDES.cipher(data.password, TripleDES.key1, TripleDES.key2, TripleDES.key3):'';
    userUpdate.password = passwordCipher;
    return this.http.post<User>(this.urlEndPoint + UtilsTemp.VALIDATE_PASS_HISTORY, userUpdate);
  }

}
