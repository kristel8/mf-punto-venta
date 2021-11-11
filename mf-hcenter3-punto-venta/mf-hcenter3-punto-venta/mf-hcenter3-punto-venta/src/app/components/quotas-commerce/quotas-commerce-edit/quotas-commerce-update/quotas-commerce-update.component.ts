import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuotaMerchant } from 'src/app/entidades/quota-merchant';
import { QuotaMerchantInput, QuotaTransactionInput } from 'src/app/entidades/quota-merchant-input';
import { ApplicationService } from 'src/app/shared/services/application.service';

enum StatusQuotas {
  Habilitado = "0",
  Deshabilitado = "1"
}

@Component({
  selector: 'app-quotas-commerce-update',
  templateUrl: './quotas-commerce-update.component.html',
  styleUrls: ['./quotas-commerce-update.component.scss']
})
export class QuotasCommerceUpdateComponent implements OnInit {


  form: FormGroup;
  quota: QuotaMerchant;
  titulo: string;
  typeStatus: any[];
  periodo: string;
  showLoader = false;
  showError = false;
  error_msg: string;
  simbolo = '';

  constructor(
    public dialogRef: MatDialogRef<QuotasCommerceUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private fb: FormBuilder,
    private appService: ApplicationService
  ) {

    console.log('test');
    this.typeStatus = Object.keys(StatusQuotas).map(key => {
      return {
        code: StatusQuotas[key],
        name: key
      }
    });

    this.quota = _data.data;
    this.titulo = _data.title;
    this.periodo = _data.periodo;

    if (this.appService.getMonedaByAppLS(this.quota.applicationId)) {
      this.simbolo = `(${this.appService.getMonedaByAppLS(this.quota.applicationId).simbolo})`;
    }


    if (this.periodo === 'diario') {
      this.form = this.fb.group({
        actionCode: [StatusQuotas[this.quota.action], [Validators.required]],
        limitAmount: [this.quota.limitAmount,
        [Validators.required,
        Validators.maxLength(13),
        Validators.max(99999999999),
        Validators.min(0)]],
        limitTimes: [this.quota.limitTimes,
        [Validators.required,
        Validators.maxLength(4),
        Validators.max(9999),
        Validators.min(0)]],
      });
    }

    if (this.periodo === 'mensual') {
      this.form = this.fb.group({
        actionCode: [StatusQuotas[this.quota.actionMes], [Validators.required]],
        limitAmount: [this.quota.limitAmountMes,
        [Validators.required,
        Validators.maxLength(13),
        Validators.max(99999999999),
        Validators.min(0)]],
        limitTimes: [this.quota.limitTimesMes,
        [Validators.required,
        Validators.maxLength(4),
        Validators.max(9999),
        Validators.min(0)]],
      });
    }
  }

  ngOnInit() {
  }

  cancelar() {
    this.dialogRef.close();
  }

  actualizarCupo() {
    console.log(this.quota);
    const quotaUpdate = {} as QuotaMerchantInput;
    quotaUpdate.applicationId = this.quota.applicationId;
    quotaUpdate.merchantId = this.quota.merchantId;
    quotaUpdate.periodo = this.periodo;

    const tran = {} as QuotaTransactionInput;
    tran.transactionId = this.quota.transactionId;
    tran.action = StatusQuotas[this.quota.action];
    tran.actionMes = StatusQuotas[this.quota.actionMes];;
    tran.limitAmount = this.quota.limitAmount;
    tran.limitAmountMes = this.quota.limitAmountMes;
    tran.limitTimes = this.quota.limitTimes;
    tran.limitTimesMes = this.quota.limitTimesMes;

    if (this.periodo === 'diario') {
      tran.action = this.form.value.actionCode;
      tran.limitTimes = +this.form.value.limitTimes;
      tran.limitAmount = +this.form.value.limitAmount;
    }

    if (this.periodo === 'mensual') {
      tran.actionMes = this.form.value.actionCode;
      tran.limitTimesMes = +this.form.value.limitTimes;
      tran.limitAmountMes = +this.form.value.limitAmount;
    }

    quotaUpdate.quotas = Array.of(tran);

    let quotaSave: QuotaMerchant = {} as QuotaMerchant;
    quotaSave = Object.assign({}, this.quota);
    if (this.periodo === 'diario') {
      quotaSave.action = this.form.value.actionCode;
      quotaSave.limitTimes = +this.form.value.limitTimes;
      quotaSave.limitAmount = +this.form.value.limitAmount;
    }

    if (this.periodo === 'mensual') {
      quotaSave.actionMes = this.form.value.actionCode;
      quotaSave.limitTimesMes = +this.form.value.limitTimes;
      quotaSave.limitAmountMes = +this.form.value.limitAmount;
    }

    this.dialogRef.close(Array.of(quotaSave));

  }
}
