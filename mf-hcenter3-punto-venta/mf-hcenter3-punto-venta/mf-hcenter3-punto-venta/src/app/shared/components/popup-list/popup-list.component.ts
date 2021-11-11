import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Merchant } from 'src/app/entidades/merchant';
import { Testing } from 'src/app/utilitarios/testing';

import { Column } from '../../entities/column';
import { HelperMessage } from '../../entities/helperMessage';
import { RequestUtils } from '../../entities/request-util';
import { Utils } from '../../entities/utils';
import { MerchantService } from '../../services/merchant.service';


@Component({
  selector: 'app-popup-list',
  templateUrl: './popup-list.component.html',
  styleUrls: ['./popup-list.component.scss']
})
export class PopupListComponent implements OnInit {

  totalPorcentaje: number = 0;
  totalList: number = 0;

  //INFO: Datos de Configuracion RequestService Reactive
  page:number[] = [1];
  //size:number = 500;
  size:number = 1500;

  isMerchartProccess:boolean = true;
  isMerchartProgressBarProccess:boolean = false;

  errors: HelperMessage[] = [];

  uniqueSelect : boolean=false;
  //checkBox: boolean=true;

  MSG_NONE: string = 'none';
  MSG_MERCHANT: string = 'msg_merchant';

  isComercioProccess: boolean = true;
  dataInput: Merchant[] = [];
  selectItems = [];
  merchantSelection: Merchant[] = [];

  showColumns: Column[];
  menuColumns: Column[];
  componenteDialog: string = this.utils.EDITAR_COMERCIO;

  selectIdValue: string = this.utils.SELECT_CMRMERCHANTID;
  checkBox = this.utils.ENABLE_CHECKBOX;
  arrayOfTable = [15];
  clearFilter = this.utils.DISABLE_CLEAR_FILTER;
  checkBoxColor = this.utils.BLACK_COLOR;
  deleteData = [];
  animal:string = '';
  name:string = '';
  deleteMany: boolean=true;
  isClickableRow:boolean=false;
  title: string;
  body: string;
  service: any;
  function: any;
  parameter: any;
  returnValue: any;

  module: any;

  showCharge = false;

  constructor(
    public dialogRef: MatDialogRef<PopupListComponent>,
    private requestUtil: RequestUtils,
    public utils: Utils,
    private testing: Testing,
    private merchantService: MerchantService) {
    this.showColumns = testing.getShowColumnsTestingForMerchantLite();
    this.menuColumns = testing.getMenuColumnsTestingForMerchantLite();
  }

  ngOnInit() {
    // this.dialogRef._containerInstance._config.data.title;
    // this.dialogRef._containerInstance._config.data.body;

    // Obtienes Los Comercios

    /*
    this.merchantService.getAllMerchants().subscribe(
      (success: Merchant[]) => {
        this.isComercioProccess = false;
        this.dataInput = success.filter((item) => item.cmrStatus == '0');// INFO: Solo se muestra los comercio activos.
      }, (error) => console.log('Error en Cargar Comercio')
    );*/



    let pages:number[] = [];
    let pagesThread:number[] = [];

    this.merchantService.getAllMerchantsPageLite(this.page,5).subscribe(
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
        this.merchantService.getAllMerchantsPageLite(pages,this.size).subscribe(
          response => {
            this.isMerchartProccess = false;
            this.isMerchartProgressBarProccess = true;
            this.dataInput = this.dataInput.concat(response['content']);
            this.totalPorcentaje = ((this.dataInput.length / this.totalList) * 100);
          },error => {
            console.log("error nuevo llamado")
          },()=>{

            this.dataInput =
            this.dataInput
            .filter((item:Merchant)=>item.cmrMerchantId!=null)//INFO: Se filtran Terminales Sin Comercio
            .sort((a,b)=>a.cmrMerchantId.localeCompare(b.cmrMerchantId));//INFO: Se ordena por Comercio
            this.merchantService.getAllMerchantsPageThreadLite(pagesThread,this.size).subscribe(
              response => {
                this.isMerchartProccess = false;
                this.dataInput = this.dataInput.concat(response['content']);
                this.totalPorcentaje = ((this.dataInput.length / this.totalList) * 100);

              },error => {
                console.log("error nuevo llamado")
              },()=>{
                this.isMerchartProgressBarProccess = false;
                this.dataInput =
                this.dataInput
                .filter((item:Merchant)=>item.cmrMerchantId!=null)//INFO: Se filtran Terminales Sin Comercio
                .sort((a,b)=>a.cmrMerchantId.localeCompare(b.cmrMerchantId));//INFO: Se ordena por Comercio
              }
            );

          }
        );
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close(this.returnValue);
  }

  callBack(): void {

    if (this.selectItems.length > 0) {
      this.module.loadBack(this.selectItems);
      this.module.load(
        {
          id: this.selectItems[0]["cmrMerchantId"],
          name: this.selectItems[0]["dmrMerchantName"],
          profilerId: this.selectItems[0]["cmrProfileId"]
        });
      this.dialogRef.close();
    } else {
      if (this.selectItems.length == 0) {
        this.errors.push({ name: this.MSG_MERCHANT, message: 'Debe seleccionar un Comercio.' });
      }
    }

  }

  processDataOutPut(data: any) {
    console.log(data);
    this.selectItems = data;
  }

  getShowColumn(data: any){}

  getMessage(keyMessage: string): string {
    return this.errors.filter(
      (item: HelperMessage) =>
        item.name == keyMessage
    ).length > 0 ?
      this.errors.filter(
        (item: HelperMessage) =>
          item.name == keyMessage
      )[0].message :
      this.MSG_NONE;
  }

}
