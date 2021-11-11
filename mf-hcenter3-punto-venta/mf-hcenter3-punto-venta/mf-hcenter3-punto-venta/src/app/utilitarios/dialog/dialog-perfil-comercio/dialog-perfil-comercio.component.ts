import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MerchantService } from '../../../servicios/merchant.service';
import { Merchant } from '../../../entidades/merchant';

export interface DialogData {
  animal: string;
  name: string;
  merchant:Merchant[];
}

@Component({
  selector: 'app-dialog-perfil-comercio',
  templateUrl: './dialog-perfil-comercio.component.html',
  styleUrls: ['./dialog-perfil-comercio.component.scss']
})
export class DialogPerfilComercioComponent implements OnInit {

  merchantCurrent: Merchant;

  constructor(
    public dialogRef: MatDialogRef<DialogPerfilComercioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,private merchantService: MerchantService) 
    
   {
    
   }

  ngOnInit() {
  }

}
