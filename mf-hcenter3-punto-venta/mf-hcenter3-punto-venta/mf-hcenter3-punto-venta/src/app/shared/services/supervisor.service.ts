import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Application } from '../entities/application';
import { Option } from '../entities/option';
import { Supervisor } from '../entities/supervisor';
import { SupervisorInput } from '../entities/supervisor-input';
import { SupervisorOptions } from '../entities/supervisor-options';
import { SupervisorOption } from '../entities/SupervisorOption';
import { User } from '../entities/user';
import { Utils } from '../entities/utils';
import { UtilsTemp } from '../entities/utils-temp';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class SupervisorService {

  private urlEndPoits: string = `${environment.urlGateway}${UtilsTemp.TM_MANCOMUNADO_SUPERVISOR}`;
  private url: string = `${environment.urlGateway}${UtilsTemp.TM_MANCOMUNADO}`;


  //private urlEndPoits: string = 'http://localhost:8080' + '/supervisor';
  //private url: string = 'http://localhost:8080';

  private supervisorSelect = new BehaviorSubject<Supervisor>(null);
  supervisorSelect$ = this.supervisorSelect.asObservable();



  constructor(private http: HttpClient,
    private utils : Utils,
    private userService: UserService) { }

  nextSupervisor(supervisor: Supervisor) {
    this.supervisorSelect.next(supervisor)
  }

  nextSupervisorLS(supervisor: Supervisor) {

    localStorage.setItem('supervisor-select', JSON.stringify(supervisor));
  }

  getSupervisorLS(): Supervisor {
    const supervisorLS = localStorage.getItem('supervisor-select');
    const supervisor = JSON.parse(supervisorLS) as Supervisor;
    return supervisor;
  }
  findOptionsAll(): Observable<Option[]> {
    return this.http.get<Option[]>(`${this.urlEndPoits}/options`);
  }

  getOptionsBySupervisorAndApp(app: string, supervisorId: string): Observable<Option[]> {
    return this.http.get<Option[]>(`${this.urlEndPoits}/options/${app}/${supervisorId}`);
  }

  findSupervisoresByApp(app: string): Observable<Supervisor[]> {
    return this.http.get<Supervisor[]>(`${this.urlEndPoits}/${app}`);
  }

  findSupervisoresAll(): Observable<Supervisor[]> {
    return this.http.get<Supervisor[]>(`${this.urlEndPoits}`).pipe(
      map( (data: Supervisor[]) => data.map(item => {
        //item.application = this.utils.getAppNameById(item.applicationId);
        return item;
      }))
    );
  }

  getSupervisorById(app: string, supervisorId: string): Observable<Supervisor> {
    return this.http.get<Supervisor>(`${this.urlEndPoits}/${app}/${supervisorId}`);
  }

  saveSupervisor(supervisorInput: SupervisorInput): Observable<SupervisorOptions> {
    return this.http.post<SupervisorOptions>(`${this.urlEndPoits}`, supervisorInput);
  }

  deleteSupervisor(supervisorId: string) {
    //const app = localStorage.getItem('appSupervisorMancomunado');
    return this.http.delete(`${this.urlEndPoits}/${supervisorId}`);
  }

  findAllApps(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.url}/app`)
  }

  findAllUsersByApp(app: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/user/${app}`)
  }


  findAllUsers(): Observable<User[]> {
    // return this.userService.getAll().pipe(
    return this.userService.getAllUserByApp().pipe(
      map((data:any[]) => data.map(item => {
        const user = {} as User;
        user.apellido = item['secondName'];
        user.cuenta = item['username'];
        user.nombre = item['firstName'];
        user.usuarioId = item['id'];
        user.caplicacion = item['caplicacion'];
        return user;
      }))
    )
  }




  getOptionsBySupervisor(supervisorId: string): Observable<SupervisorOption[]> {
    return this.http.get<SupervisorOption[]>(`${this.urlEndPoits}/options/${supervisorId}`);
  }

}
