import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TerminalService } from 'src/app/servicios/terminal.service';
import { DynamictableComponent } from 'src/app/shared/components/dynamictable/dynamictable.component';
import { PopupCommentComponent } from 'src/app/shared/components/popup-comment/popup-comment.component';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import { Column } from 'src/app/shared/entities/column';
import { ConstantUtils } from 'src/app/shared/entities/constantUtils';
import { RegisterAudit } from 'src/app/shared/entities/registerAudit';
import { RequestRallied } from 'src/app/shared/entities/request-rallied';
import { RequestUtils } from 'src/app/shared/entities/request-util';
import { RequestApproval } from 'src/app/shared/entities/requestApproval';
import { Role } from 'src/app/shared/entities/role';
import { Terminal } from 'src/app/shared/entities/terminal';
import { Utils } from 'src/app/shared/entities/utils';
import { UtilsConstant } from 'src/app/shared/entities/utils-constant';
import { AuditService } from 'src/app/shared/services/audit.service';
import { RequestApprovalService } from 'src/app/shared/services/request-approval.service';
import { TokenStorageService } from 'src/app/shared/services/token-storage.service';
import { Testing } from 'src/app/utilitarios/testing';

@Component({
  selector: 'app-terminal-list',
  templateUrl: './terminal-list.component.html',
  styleUrls: ['./terminal-list.component.scss']
})
export class TerminalListComponent implements OnInit {


  registerAudit:RegisterAudit;

  isValidAccessLevel:boolean = true;

  table: DynamictableComponent;

  totalPorcentaje: number = 0;
  totalList: number = 0;

  //INFO: Datos de Configuracion RequestService Reactive
  page:number[] = [1];
  size:number = 500;
  //size:number = 1000;

  isTerminalProccess:boolean = true;
  isTerminalProgressBarProccess:boolean = false;

  myInnerHeight: number;
  styleMatCard: string;
  dataInput: Terminal[] = [];

  // dialog
  animal: string;
  name: string;
  selectItems = [];

  showColumns: Column[];
  menuColumns: Column[];
  componenteDialog: string = this.utils.EDITAR_TERMINAL;
  selectIdValue: string = this.utils.SELECT_COMPOSEID;
  checkBox = this.utils.ENABLE_CHECKBOX;
  arrayOfTable = this.utils.ARRAY_OF_TABLE;
  clearFilter = this.utils.DISABLE_CLEAR_FILTER;
  checkBoxColor = this.utils.BLACK_COLOR;
  deleteData = [];

  requestRalliedEditar: Terminal[];
  requestRallied = new RequestRallied();

  isEliminationMode: boolean = false;

  constructor(
    public utils: Utils,
    private terminalService: TerminalService,
    private testing: Testing,
    public dialog: MatDialog,
    private router: Router,
    private sanitizer: DomSanitizer,
    private tokenStorageService: TokenStorageService,
    private auditService:AuditService,
    private reqAppService:RequestApprovalService,
    private requestUtil: RequestUtils) {
    this.showColumns = this.testing.getShowColumnsTestingForTerminal();
    this.menuColumns = this.testing.getMenuColumnsTestingForTerminal();
    this.styleMatCard = '';
  }

  @ViewChild(DynamictableComponent, { static: false }) set dynamicTable(table: DynamictableComponent) {
    this.table = table;
  }

  get setCheckBoxColor() {
    return this.sanitizer.bypassSecurityTrustStyle(
      `--checkboxcolor: ${this.checkBoxColor};`
    );
  }

  ngOnInit() {

    this.registerAudit = new RegisterAudit( this.auditService, ConstantUtils.MODULE_POINT_OF_SALE_CONF, ConstantUtils.MODOPTION_TERMINAL, this.tokenStorageService.getFullNameByUser(), "0", ConstantUtils.AUDIT_OPTION_TYPE_DELETE);
    this.isValidAccessLevel = this.utils.validAccessLevelDelete('mantenimientomc', 'terminal');
    //this.validAccessLevel();
    let pages:number[] = [];
    let pagesThread:number[] = [];

    this.tokenStorageService.getFullNameByUser(),
    this.terminalService.getAllTerminalPage(this.page,5).subscribe(
      response => {
        let numero:number = +JSON.stringify(response["totalElements"]);
        this.totalList = numero;
        //let numCiclo:number = +numero;
        numero = numero / this.size;
        pages.push(0); //INFO: Flag para primer conjunto de datos.
        //for(let i = 1;i <= numero;i++){pages.push(i);}
        for(let i = 1;i <= numero;i++){pagesThread.push(i);}
      },error => {
        console.log("error nuevo llamado")
      },() => {
        this.terminalService.getAllTerminalPage(pages,this.size).subscribe(
          response => {
            this.isTerminalProccess = false;
            this.isTerminalProgressBarProccess = true;
            this.dataInput = this.dataInput.concat(response['content']);
            this.totalPorcentaje = ((this.dataInput.length / this.totalList) * 100);
          },error => {
            console.log("error nuevo llamado")
          },()=>{
            this.dataInput =
            this.dataInput
            .filter((item:Terminal)=>item.ctrMerchantId!=null)//INFO: Se filtran Terminales Sin Comercio
            //.sort((a,b)=>b.ctrMerchantId.localeCompare(a.ctrMerchantId));//INFO: Se ordena por Comercio
            this.terminalService.getAllTerminalPageThread(pagesThread,this.size).subscribe(
              response => {
                this.isTerminalProccess = false;
                this.dataInput = this.dataInput.concat(response['content']);
                this.totalPorcentaje = ((this.dataInput.length / this.totalList) * 100);

              },error => {
                console.log("error nuevo llamado")
              },()=>{
                this.isTerminalProgressBarProccess = false;
                this.dataInput =
                this.dataInput
                .filter((item:Terminal)=>item.ctrMerchantId!=null)//INFO: Se filtran Terminales Sin Comercio
                //.sort((a,b)=>b.ctrMerchantId.localeCompare(a.ctrMerchantId));//INFO: Se ordena por Comercio
              }
            );

          }
        );
      }
    );
  }

  validAccessLevel(){
    let role:Role[] = this.tokenStorageService.getUser()['listRols'];
    let identifierModule:string = 'mantenimientomc';
    let procesoIndicatorArbolModule:string = 'terminal';
    let valModifid:string = '2';
    let valFullAccess:string = '3';

    if(
      role[0]
        .listModules
        .filter((item)=>item.identifier.trim()==identifierModule)[0]
        .listArbolModulo
        .filter((item)=>item.procesoIndicator.trim() == procesoIndicatorArbolModule
                        && ( item.processNivel == valModifid || item.processNivel == valFullAccess ))
        .length > 0
      ){
        this.isValidAccessLevel = false;
      }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setHeight(event.target.innerHeight);
  }

  setHeight(height: number) {
    if (this.dataInput != undefined && this.dataInput != null) {
      this.styleMatCard = (0.86 * height) + 'px';
    }
  }

  processDataOutPut(data: any) {
    this.selectItems = data;
  }

  getShowColumn(data:any){}

  sendToRequest(comment:string, sendToRequest:number, appSelection:string){
    let fields: Terminal[] = this.selectItems;

    let tempRA:RequestApproval = { operationType:0, moduleType:0, content:"",	commentreq:"",coduserreq:""};
    tempRA.operationType = sendToRequest;
    tempRA.moduleType = UtilsConstant.TM_REQUEST_TERMINAL;
    tempRA.content = JSON.stringify(fields);
    tempRA.coduserreq = this.tokenStorageService.getUser()["id"];
    tempRA.commentreq = comment;
    tempRA.appcurrent = appSelection;

    this.reqAppService.save(tempRA).subscribe(
      (data:RequestApproval)=>{
        console.log("exitoso");

        this.registerAudit.setEntityOld = this.selectItems[0];
        this.registerAudit.setEntityId = this.selectItems[0].ctrMerchantId + '-' + this.selectItems[0].ctrTerminalNum;
        this.registerAudit.setIdManc = data.raid;
        this.registerAudit.saveCurrentAudit(Utils.AUDIT_MANCOMUNED_TYPE);

        this.isEliminationMode = false;

      },(error)=>console.log("Error > Request Approval"));

  }

  popupDelete(): void {
    if(this.selectItems.length >0){

      /**
       * Flujo Para Mancomunado. Aun falta definir el flujo para activacion de Mancomunado en los modulos.
       */
      //if(true){
      if (this.tokenStorageService.isMancomuned(UtilsConstant.TM_REQUEST_TERMINAL)) {
        const dialogRef = this.dialog.open(PopupComponent, {
          width: "450px",
          disableClose: true,
        });
        dialogRef.componentInstance.title =
          this.requestUtil.POPUP_TITLE_ELIMINAR;
        dialogRef.componentInstance.body =
          this.requestUtil.POPUP_BODY_ELIMINAR_TERMINAL;
        dialogRef.componentInstance.call = true;
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
        const dialogRef = this.dialog.open(PopupCommentComponent, {
          width: "800px",
          disableClose: false,
        });
        dialogRef.componentInstance.title = UtilsConstant.MSG_POPUP_TITLE_CONTENT;
        dialogRef.componentInstance.body = UtilsConstant.MSG_POPUP_COMMENT_CONTENT;
        dialogRef.componentInstance.module = this;
        dialogRef.componentInstance.typeProccess = UtilsConstant.TYPE_REQUEST_DELETE;
        dialogRef.afterClosed().subscribe((result) => {
          if(!result) {
            this.table.refreshData();
            this.table.cleanFormInputsFilters();
          }
          this.table.dataTable = this.dataInput;
          this.table.refreshData();
        });

        } else {
          dialogRef.close();
        }
      });
      } else {

        console.log(JSON.stringify(this.selectItems));

        const dialogRef = this.dialog.open(PopupComponent, {
          width: '450px',
          disableClose: true,
        });
        dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_ELIMINAR;
        dialogRef.componentInstance.body = this.requestUtil.POPUP_BODY_ELIMINAR_TERMINAL;
        dialogRef.componentInstance.service = this.terminalService;
        dialogRef.componentInstance.function = 'delete';
        dialogRef.componentInstance.parameter = this.selectItems;
        dialogRef.afterClosed().subscribe(result => {
          if (result != undefined && result.status != undefined && result.status === 200) {
            this.registerAudit.setEntityOld = this.selectItems[0];
            this.registerAudit.setEntityId = this.selectItems[0].ctrMerchantId + '-' + this.selectItems[0].ctrTerminalNum;
            this.registerAudit.saveCurrentAudit();

            this.borrarDelDataSource(result.parameter);

            this.isEliminationMode = false;
          } else {
            this.utils.verificarCodigoError(result, this.router);
          }
        });

      }

    } else {
      const dialogRef = this.dialog.open(PopupComponent, {
        width: '450px',
        disableClose: true,
      });
      dialogRef.componentInstance.title = this.requestUtil.POPUP_TITLE_ELIMINAR;
      dialogRef.componentInstance.body = this.requestUtil.POPUP_BODY_GENERIC_ERASE_DELETE;
      dialogRef.componentInstance.isEraseSelectDelete = true;
    }

  }

  borrarDelDataSource(retirarDelDataSource: Terminal[]) {
    retirarDelDataSource.forEach(
      terminal => {
        const index = this.dataInput.indexOf(terminal);
        this.dataInput.splice(index, 1);
        this.table.dataTable = this.dataInput;
        this.table.refreshData();
      }
    );
  }

  toggleEliminationMode($event){
    console.log("elimination mode: ", $event);
    this.isEliminationMode = $event;
  }

  toggleEliminationModeTable() {
    //this.table.eliminationMode = false;
    this.isEliminationMode = false;
  }

}
