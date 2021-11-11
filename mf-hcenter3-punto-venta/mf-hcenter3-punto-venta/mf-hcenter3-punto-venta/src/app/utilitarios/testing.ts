import { Injectable } from '@angular/core';
import { Merchant } from '../entidades/merchant';
import { Terminal } from '../entidades/terminal';
import { MerchantProfile } from '../entidades/merchant-profile';
import { MerchantChain } from '../entidades/merchant-chain';
import { Column } from '../shared/entities/column';

@Injectable({
	providedIn: 'root'
})
export class Testing {
	showColumns: Column[];
	menuColumns: Column[];
	merchantChainsTesting: MerchantChain[];
	merchant: Merchant[];
	terminal: Terminal[];
	merchantProfile: MerchantProfile[];


	getShowColumnsTestinnForMerchantChainDownload(): Column[] {
		this.showColumns = [
			{
				id: '3',
				columnOfTable: 'planName',
				display: 'Plan de descarga',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '4',
				columnOfTable: 'merchantId',
				display: 'Código de comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '5',
				columnOfTable: 'merchantName',
				display: 'Comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			}
		];
		return this.showColumns;
	}

	getMenuColumnsTestingForMerchantChainDownload(): Column[] {
		this.showColumns = [
			{
				id: '3',
				columnOfTable: 'planName',
				display: 'Plan de descarga',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '4',
				columnOfTable: 'merchantId',
				display: 'Código de comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '5',
				columnOfTable: 'merchantName',
				display: 'Comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			}
		];
		return this.showColumns;
	}

	getShowColumnsTestinnForMerchantChain(): Column[] {
		this.showColumns = [
			{
				id: '3',
				columnOfTable: 'dmcChainName',
				display: 'Cadena de Comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '4',
				columnOfTable: 'dmcdescription',
				display: 'Descripción',
				columnOfRelationalTable: 'na',
				innierTable: ''
			},
			{
				id: '5',
				columnOfTable: 'dmcRUC',
				display: 'RUC',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '6',
				columnOfTable: 'cmcLogicalStatus',
				display: 'Estado',
				columnOfRelationalTable: '',
				innierTable: 'formatStatus2'
			},
      {
				id: '9',
				columnOfTable: 'cmcassociatedQuantity',
				display: 'Comercios Asociados',
				columnOfRelationalTable: '',
				innierTable: ''
			}
		];
		return this.showColumns;
	}

	getMenuColumnsTestingForMerchantChain(): Column[] {
		this.showColumns = [
			{
				id: '3',
				columnOfTable: 'dmcChainName',
				display: 'Cadena de Comercio',
				columnOfRelationalTable: '',
				innierTable: '',
        blockAdminCol: true,
			},
			{
				id: '4',
				columnOfTable: 'dmcdescription',
				display: 'Descripción',
				columnOfRelationalTable: 'na',
				innierTable: ''
			},
			{
				id: '5',
				columnOfTable: 'dmcRUC',
				display: 'RUC',
				columnOfRelationalTable: '',
				innierTable: '',
        blockAdminCol: true,
			},
			{
				id: '6',
				columnOfTable: 'cmcLogicalStatus',
				display: 'Estado',
				columnOfRelationalTable: '',
				innierTable: 'formatStatus2'
			},
      {
				id: '9',
				columnOfTable: 'cmcassociatedQuantity',
				display: 'Comercios Asociados',
				columnOfRelationalTable: '',
				innierTable: ''
			}
		];
		return this.showColumns;
	}

	getShowColumnsTestingForMerchantByApp(): Column[] {
		this.showColumns = [
			{
				id: '2',
				columnOfTable: 'cmrMerchantId',
				display: 'Comercio ID',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '3',
				columnOfTable: 'cmrStatus',
				display: 'Estado del Comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '4',
				columnOfTable: 'dmrContactName',
				display: 'Nombre de Contacto',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '5',
				columnOfTable: 'dmrMerchantName',
				display: 'Nombre del Comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '13',
				columnOfTable: 'applicationsName',
				display: 'Aplicaciones',
				columnOfRelationalTable: '',
				innierTable: ''
			}
		];
		return this.showColumns;
	}

	getMenuColumnsTestingForMerchantByApp(): Column[] {
		this.showColumns = [
			{
				id: '2',
				columnOfTable: 'cmrMerchantId',
				display: 'Comercio ID',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '3',
				columnOfTable: 'cmrStatus',
				display: 'Estado del Comercio',
				columnOfRelationalTable: '',
				innierTable: 'formatStatusComercio'
			},
			{
				id: '4',
				columnOfTable: 'dmrContactName',
				display: 'Nombre de Contacto',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '5',
				columnOfTable: 'dmrMerchantName',
				display: 'Nombre del Comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '6',
				columnOfTable: 'cmrRucCode',
				display: 'RUC',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '7',
				columnOfTable: 'dmrAddress',
				display: 'Dirección de Comercio',
				columnOfRelationalTable: '',
				innierTable: 'formatStatus'
			},
			{
				id: '8',
				columnOfTable: 'dmrPhone',
				display: 'Número de Contacto',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '9',
				columnOfTable: 'cmrProfileId',
				display: 'Perfil',
				columnOfRelationalTable: '',
				innierTable: ''
			}
			//Seccion de ubigeos
			,
			{
				id: '10',
				columnOfTable: 'departamento',
				display: 'Departamento',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '11',
				columnOfTable: 'provincia',
				display: 'Provincia',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '12',
				columnOfTable: 'distrito',
				display: 'Distrito',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '13',
				columnOfTable: 'applicationsName',
				display: 'Aplicaciones',
				columnOfRelationalTable: '',
				innierTable: ''
			}
		];
		return this.showColumns;
	}

	getShowColumnsTestingForMerchant(): Column[] {
		this.showColumns = [
			{
				id: '2',
				columnOfTable: 'cmrMerchantId',
				display: 'ID de Comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '5',
				columnOfTable: 'dmrMerchantName',
				display: 'Nombre Comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '13',
				columnOfTable: 'merchantChainname',
				display: 'Cadena Comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: "9",
				columnOfTable: "cmrProfileId",
				display: "Perfil Comercio",
				columnOfRelationalTable: "",
				innierTable: ""
			},
			{
				id: '3',
				columnOfTable: 'cmrStatus',
				display: 'Estado',
				columnOfRelationalTable: '',
				innierTable: ''
			}

		];
		return this.showColumns;
	}

	getMenuColumnsTestingForMerchant(): Column[] {
		this.showColumns = [
			{
				id: '2',
				columnOfTable: 'cmrMerchantId',
				display: 'ID de Comercio',
				columnOfRelationalTable: '',
				innierTable: '',
        blockAdminCol: true,
			},
			{
				id: '3',
				columnOfTable: 'cmrStatus',
				display: 'Estado',
				columnOfRelationalTable: '',
				innierTable: 'formatStatusComercio'
			},
			{
				id: '5',
				columnOfTable: 'dmrMerchantName',
				display: 'Nombre Comercio',
				columnOfRelationalTable: '',
				innierTable: '',
        blockAdminCol: true,
			},
			{
				id: '9',
				columnOfTable: 'cmrProfileId',
				display: 'Perfil Comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '13',
				columnOfTable: 'merchantChainname',
				display: 'Cadena Comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '4',
				columnOfTable: 'dmrContactName',
				display: 'Nombre de Contacto',
				columnOfRelationalTable: '',
				innierTable: ''
			},

			{
				id: '6',
				columnOfTable: 'cmrRucCode',
				display: 'RUC',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '7',
				columnOfTable: 'dmrAddress',
				display: 'Dirección de Comercio',
				columnOfRelationalTable: '',
				innierTable: 'formatStatus'
			},
			{
				id: '8',
				columnOfTable: 'dmrPhone',
				display: 'Número de Contacto',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			//Seccion de ubigeos
			{
				id: '10',
				columnOfTable: 'departamento',
				display: 'Departamento',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '11',
				columnOfTable: 'provincia',
				display: 'Provincia',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '12',
				columnOfTable: 'distrito',
				display: 'Distrito',
				columnOfRelationalTable: '',
				innierTable: ''
			}
		];
		return this.showColumns;
	}


	getShowColumnsTestingForMerchantLite(): Column[] {
		this.showColumns = [
			{
				id: '2',
				columnOfTable: 'cmrMerchantId',
				display: 'Comercio ID',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '3',
				columnOfTable: 'dmrMerchantName',
				display: 'Nombre del Comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '4',
				columnOfTable: 'cmrProfileId',
				display: 'Perfil de Comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '5',
				columnOfTable: 'dmrContactName',
				display: 'Nombre de Contacto',
				columnOfRelationalTable: '',
				innierTable: ''
			}
		];
		return this.showColumns;
	}

	getMenuColumnsTestingForMerchantLite(): Column[] {
		this.showColumns = [
			{
				id: '2',
				columnOfTable: 'cmrMerchantId',
				display: 'Comercio ID',
				columnOfRelationalTable: '',
				innierTable: '',
        blockAdminCol: true
			},
			{
				id: '3',
				columnOfTable: 'dmrMerchantName',
				display: 'Nombre del Comercio',
				columnOfRelationalTable: '',
				innierTable: '',
        blockAdminCol: true
			},
			{
				id: '4',
				columnOfTable: 'cmrProfileId',
				display: 'Perfil de Comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '5',
				columnOfTable: 'dmrContactName',
				display: 'Nombre de Contacto',
				columnOfRelationalTable: '',
				innierTable: ''
			}
		];
		return this.showColumns;
	}

	getShowColumnsTestingForMerchantProfile(): Column[] {
		this.showColumns = [
			{
				id: '1',
				columnOfTable: 'cmpprofileId',
				display: 'Perfil de Comercio ID',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '2',
				columnOfTable: 'cmpapplicationAux',
				display: 'Aplicación(es)',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '3',
				columnOfTable: 'cmpassociatedQuantity',
				display: 'Comercios Asociados',
				columnOfRelationalTable: '',
				innierTable: '',
				linkModal: true
			}
		];
		return this.showColumns;
	}

	getMenuColumnsTestingForMerchantProfile(): Column[] {
		this.showColumns = [
			{
				id: '1',
				columnOfTable: 'cmpprofileId',
				display: 'Perfil de Comercio ID',
				columnOfRelationalTable: '',
				innierTable: '',
        blockAdminCol: true,
			},
			{
				id: '2',
				columnOfTable: 'cmpapplicationAux',
				display: 'Aplicación(es)',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '3',
				columnOfTable: 'cmpassociatedQuantity',
				display: 'Comercios Asociados',
				columnOfRelationalTable: '',
				innierTable: '',
				linkModal: true

			},
			{
				id: '4',
				columnOfTable: 'cmpModifyUser',
				display: 'Usuario de Modificación',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '5',
				columnOfTable: 'fmpModifyDate',
				display: 'Fecha de Modificación',
				columnOfRelationalTable: '',
				innierTable: 'formatDate2'
			},
			{
				id: '6',
				columnOfTable: 'hmpModifyTime',
				display: 'Hora de Modificación',
				columnOfRelationalTable: '',
				innierTable: 'formatTime'
			}
		];
		return this.showColumns;
	}

	getShowColumnsTestingForTerminalDownload(): Column[] {
		this.showColumns = [
			{
				id: '2',
				columnOfTable: 'planName',
				display: 'Plan de descarga',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '3',
				columnOfTable: 'terminallns',
				display: 'Número de Terminal',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '4',
				columnOfTable: 'serial',
				display: 'Numero de serie',
				columnOfRelationalTable: '',
				innierTable: ''
			}
		];
		return this.showColumns;
	}

	getMenuColumnsTestingForTerminalDownload(): Column[] {
		this.showColumns = [
			{
				id: '2',
				columnOfTable: 'planName',
				display: 'Plan de descarga',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '3',
				columnOfTable: 'terminallns',
				display: 'Número de Terminal',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '4',
				columnOfTable: 'serial',
				display: 'Numero de serie',
				columnOfRelationalTable: '',
				innierTable: ''
			}
		];
		return this.showColumns;
	}

	getShowColumnsTestingForTerminal(): Column[] {
		this.showColumns = [
			{
				id: '9',
				columnOfTable: 'dtrTerminalSN',
				display: 'Serial Number',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '2',
				columnOfTable: 'ctrMerchantId',
				display: 'Id Comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '5',
				columnOfTable: 'dmrMerchantName',
				display: 'Comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '11',
				columnOfTable: 'ctrModel',
				display: 'Modelo',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '7',
				columnOfTable: 'dtrDescription',
				display: 'Descripción Terminal',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '6',
				columnOfTable: 'ctrAplicacionName',
				display: 'Aplicación',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '8',
				columnOfTable: 'statusDisplay',
				display: 'Estado',
				columnOfRelationalTable: '',
				innierTable: 'formatStatusTerminal'
			}
		];
		return this.showColumns;
	}

	getMenuColumnsTestingForTerminal(): Column[] {
		this.showColumns = [
			{
				id: '2',
				columnOfTable: 'ctrMerchantId',
				display: 'Id Comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			},

			{
				id: '5',
				columnOfTable: 'dmrMerchantName',
				display: 'Comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '6',
				columnOfTable: 'ctrAplicacionName',
				display: 'Aplicación',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '7',
				columnOfTable: 'dtrDescription',
				display: 'Descripción Terminal',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '8',
				columnOfTable: 'statusDisplay',
				display: 'Estado',
				columnOfRelationalTable: '',
				innierTable: 'formatStatusTerminal'
			},
			{
				id: '9',
				columnOfTable: 'dtrTerminalSN',
				display: 'Serial Number',
				columnOfRelationalTable: '',
				innierTable: '',
        blockAdminCol: true,
			},
			{
				id: '11',
				columnOfTable: 'ctrModel',
				display: 'Modelo',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '3',
				columnOfTable: 'ctrTerminalNum',
				display: 'Número de Terminal',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '4',
				columnOfTable: 'dmcchainName',
				display: 'Cadena C. Asociada',
				columnOfRelationalTable: '',
				innierTable: ''
			},

			{
				id: '10',
				columnOfTable: 'ctrTypeDescription',
				display: 'Tipo',
				columnOfRelationalTable: '',
				innierTable: ''
			},

			{
				id: '12',
				columnOfTable: 'cmrProfileId',
				display: 'Perfil de Comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '13',
				columnOfTable: 'ntrSWVersion',
				display: 'Versión de Software',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '14',
				columnOfTable: 'ntrLongitudTrama',
				display: 'Medio de Comunicación',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '15',
				columnOfTable: 'ftrCreationDate',
				display: 'Fecha Creación',
				columnOfRelationalTable: '',
				innierTable: 'formatDate2'
			},
			{
				id: '16',
				columnOfTable: 'htrCreationTime',
				display: 'Hora Creación',
				columnOfRelationalTable: '',
				innierTable: 'formatTime'
			}
			//Seccion ubigeo
			,
			{
				id: '17',
				columnOfTable: 'departamento',
				display: 'Departamento',
				columnOfRelationalTable: '',
				innierTable: 'formatTime'
			},
			{
				id: '18',
				columnOfTable: 'provincia',
				display: 'Provincia',
				columnOfRelationalTable: '',
				innierTable: 'formatTime'
			},
			{
				id: '19',
				columnOfTable: 'distrito',
				display: 'Distrito',
				columnOfRelationalTable: '',
				innierTable: 'formatTime'
			}


		];
		return this.showColumns;
	}

	getShowColumnsTestinnForTransactionType(): Column[] {
		this.showColumns = [
			{
				id: '1',
				columnOfTable: 'dtttransactionName',
				display: 'Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '2',
				columnOfTable: 'ctttransactionId',
				display: 'ID Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '3',
				columnOfTable: 'ctttransGroup',
				display: 'Tipo de Transacción',
				columnOfRelationalTable: '',
				innierTable: 'castTypeTransaction'
			}
		];
		return this.showColumns;
	}

	getMenuColumnsTestinnForTransactionType(): Column[] {
		this.showColumns = [
			{
				id: '1',
				columnOfTable: 'dtttransactionName',
				display: 'Transacción',
				columnOfRelationalTable: '',
				innierTable: '',
        blockAdminCol: true
			},
			{
				id: '2',
				columnOfTable: 'ctttransactionId',
				display: 'ID Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '3',
				columnOfTable: 'ctttransGroup',
				display: 'Tipo de Transacción',
				columnOfRelationalTable: '',
				innierTable: 'castTypeTransaction'
			}
		];
		return this.showColumns;
	}

	getShowColumnsTestinnForTerminalTransactionType(): Column[] {
		this.showColumns = [
			{
				id: '1',
				columnOfTable: 'dtttransactionName',
				display: 'Nombre',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '2',
				columnOfTable: 'dttdescription',
				display: 'Descripción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '3',
				columnOfTable: 'ctttransGroup',
				display: 'Tipo de Transacción',
				columnOfRelationalTable: '',
				innierTable: 'castTypeTransaction'
			}
		];
		return this.showColumns;
	}

	getMenuColumnsTestinnForTerminalTransactionType(): Column[] {
		this.showColumns = [
			{
				id: '1',
				columnOfTable: 'dtttransactionName',
				display: 'Nombre',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '2',
				columnOfTable: 'dttdescription',
				display: 'Descripción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '3',
				columnOfTable: 'ctttransGroup',
				display: 'Tipo de Transacción',
				columnOfRelationalTable: '',
				innierTable: 'castTypeTransaction'
			}
		];
		return this.showColumns;
	}

	getShowColumnsTestinnForQuota(): Column[] {
		this.showColumns = [
			{
				id: '8',
				columnOfTable: 'applicationName',
				display: 'Aplicación',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '2',
				columnOfTable: 'merchantId',
				display: 'ID de Comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '3',
				columnOfTable: 'merchantName',
				display: 'Nom de Comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '14',
				columnOfTable: 'merchantchainname',
				display: 'Cadena Comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '7',
				columnOfTable: 'profileId',
				display: 'Perfil Comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '13',
				columnOfTable: 'statusmerq',
				display: 'Estado',
				columnOfRelationalTable: '',
				innierTable: 'formatStatusComercio'
			}

		];
		return this.showColumns;
	}

	getMenuColumnsTestingForQuota(): Column[] {
		this.showColumns = [
			{
				id: '2',
				columnOfTable: 'merchantId',
				display: 'ID de Comercio',
				columnOfRelationalTable: '',
				innierTable: '',
        blockAdminCol: true,
			},
			{
				id: '3',
				columnOfTable: 'merchantName',
				display: 'Nom de Comercio',
				columnOfRelationalTable: '',
				innierTable: '',
        blockAdminCol: true,
			},
			{
				id: '7',
				columnOfTable: 'profileId',
				display: 'Perfil Comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '8',
				columnOfTable: 'applicationName',
				display: 'Aplicación',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '13',
				columnOfTable: 'statusmerq',
				display: 'Estado',
				columnOfRelationalTable: '',
				innierTable: 'formatStatusComercio'
			},
			{
				id: '4',
				columnOfTable: 'address',
				display: 'Direccion',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '5',
				columnOfTable: 'contactName',
				display: 'Nombre de Contacto',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '6',
				columnOfTable: 'phone',
				display: 'Telefono',
				columnOfRelationalTable: '',
				innierTable: ''
			},

			{
				id: '9',
				columnOfTable: 'countQuota',
				display: 'N° Cupos',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '10',
				columnOfTable: 'nivel1',
				display: 'Nivel 1',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '11',
				columnOfTable: 'nivel2',
				display: 'Nivel 2',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '12',
				columnOfTable: 'nivel3',
				display: 'Nivel 3',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '14',
				columnOfTable: 'merchantchainname',
				display: 'Cadena Comercio',
				columnOfRelationalTable: '',
				innierTable: ''
			}

		];
		return this.showColumns;
	}




	getMenuColumnsTestingForQuotaMerchant(): Column[] {
		this.showColumns = [
			{
				id: '1',
				columnOfTable: 'transactionId',
				display: 'ID Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '2',
				columnOfTable: 'transactionName',
				display: 'Nombre de Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '3',
				columnOfTable: 'transactionDescription',
				display: 'Descripción de Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '4',
				columnOfTable: 'action',
				display: 'Estado Diario',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '5',
				columnOfTable: 'limitAmount',
				display: 'Monto Diario',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '6',
				columnOfTable: 'limitAmountDolar',
				display: 'Monto Diario ($)',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '7',
				columnOfTable: 'limitTimes',
				display: 'N° Veces Diario',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '8',
				columnOfTable: 'limitAmountAcum',
				display: 'Monto Acumulado Diario',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '9',
				columnOfTable: 'limitAmountDollarAcum',
				display: 'Monto Acumulado Diario ($)',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '10',
				columnOfTable: 'limitTimesAcum',
				display: 'N° Veces Acumulado Diario',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '11',
				columnOfTable: 'actionMes',
				display: 'Estado Mensual',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '12',
				columnOfTable: 'limitAmountMes',
				display: 'Monto Mensual',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '13',
				columnOfTable: 'limitAmountDolarMes',
				display: 'Monto Mensual ($)',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '14',
				columnOfTable: 'limitTimesMes',
				display: 'N° Veces Mensual',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '15',
				columnOfTable: 'limitAmountAcumMes',
				display: 'Monto Acumulado Mensual',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '16',
				columnOfTable: 'limitAmountDollarAcumMes',
				display: 'Monto Acumulado Mensual ($)',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '17',
				columnOfTable: 'limitTimesAcumMes',
				display: 'N° Veces Acumulado Mensual',
				columnOfRelationalTable: '',
				innierTable: ''
			},
		];
		return this.showColumns;
	}

	getShowColumnsTestinnForQuotaMerchant(): Column[] {
		this.showColumns = [
			{
				id: '1',
				columnOfTable: 'transactionId',
				display: 'ID Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '2',
				columnOfTable: 'transactionName',
				display: 'Nombre de Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '4',
				columnOfTable: 'action',
				display: 'Estado Diario',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '5',
				columnOfTable: 'limitAmount',
				display: 'Monto Diario',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '7',
				columnOfTable: 'limitTimes',
				display: 'N° Veces Diario',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '11',
				columnOfTable: 'actionMes',
				display: 'Estado Mensual',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '12',
				columnOfTable: 'limitAmountMes',
				display: 'Monto Mensual',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '14',
				columnOfTable: 'limitTimesMes',
				display: 'N° Veces Mensual',
				columnOfRelationalTable: '',
				innierTable: ''
			},
		];
		return this.showColumns;
	}

	// cupos Diario
	getMenuColumnsTestingForQuotaMerchantDiario(): Column[] {
		this.showColumns = [
			{
				id: '1',
				columnOfTable: 'transactionId',
				display: 'ID Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '2',
				columnOfTable: 'transactionName',
				display: 'Nombre de Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '3',
				columnOfTable: 'transactionDescription',
				display: 'Descripción de Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '4',
				columnOfTable: 'action',
				display: 'Estado',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '5',
				columnOfTable: 'limitAmount',
				display: 'Monto Límite',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '6',
				columnOfTable: 'limitAmountDolar',
				display: 'Monto Límite ($)',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '7',
				columnOfTable: 'limitTimes',
				display: 'Veces Límite',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '8',
				columnOfTable: 'limitAmountAcum',
				display: 'Monto Acumulado',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '9',
				columnOfTable: 'limitAmountDollarAcum',
				display: 'Monto Acumulado ($)',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '10',
				columnOfTable: 'limitTimesAcum',
				display: 'Veces Acumulado',
				columnOfRelationalTable: '',
				innierTable: ''
			}
		];
		return this.showColumns;
	}

	getShowColumnsTestingForQuotaMerchantDiario(): Column[] {
		this.showColumns = [
			{
				id: '2',
				columnOfTable: 'transactionName',
				display: 'Nombre de Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '4',
				columnOfTable: 'action',
				display: 'Estado',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '5',
				columnOfTable: 'limitAmount',
				display: 'Monto Límite',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '6',
				columnOfTable: 'limitAmountDolar',
				display: 'Monto Límite ($)',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '7',
				columnOfTable: 'limitTimes',
				display: 'Veces Límite',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '8',
				columnOfTable: 'limitAmountAcum',
				display: 'Monto Acumulado',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '9',
				columnOfTable: 'limitAmountDollarAcum',
				display: 'Monto Acumulado ($)',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '10',
				columnOfTable: 'limitTimesAcum',
				display: 'Veces Acumulado',
				columnOfRelationalTable: '',
				innierTable: ''
			}
		];
		return this.showColumns;
	}



	// cupos mensual
	getMenuColumnsTestingForQuotaMerchantMensual(): Column[] {
		this.showColumns = [
			{
				id: '1',
				columnOfTable: 'transactionId',
				display: 'ID Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '2',
				columnOfTable: 'transactionName',
				display: 'Nombre de Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '3',
				columnOfTable: 'transactionDescription',
				display: 'Descripción de Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '11',
				columnOfTable: 'actionMes',
				display: 'Estado',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '12',
				columnOfTable: 'limitAmountMes',
				display: 'Monto Límite',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '13',
				columnOfTable: 'limitAmountDolarMes',
				display: 'Monto Límite ($)',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '14',
				columnOfTable: 'limitTimesMes',
				display: 'Veces Límite',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '15',
				columnOfTable: 'limitAmountAcumMes',
				display: 'Monto Acumulado',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '16',
				columnOfTable: 'limitAmountDollarAcumMes',
				display: 'Monto Acumulado ($)',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '17',
				columnOfTable: 'limitTimesAcumMes',
				display: 'Veces Acumulado',
				columnOfRelationalTable: '',
				innierTable: ''
			},
		];
		return this.showColumns;
	}

	getShowColumnsTestingForQuotaMerchantMensual(): Column[] {
		this.showColumns = [
			{
				id: '2',
				columnOfTable: 'transactionName',
				display: 'Nombre de Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '11',
				columnOfTable: 'actionMes',
				display: 'Estado',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '12',
				columnOfTable: 'limitAmountMes',
				display: 'Monto Límite',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '13',
				columnOfTable: 'limitAmountDolarMes',
				display: 'Monto Límite ($)',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '14',
				columnOfTable: 'limitTimesMes',
				display: 'Veces Límite',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '15',
				columnOfTable: 'limitAmountAcumMes',
				display: 'Monto Acumulado',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '16',
				columnOfTable: 'limitAmountDollarAcumMes',
				display: 'Monto Acumulado ($)',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '17',
				columnOfTable: 'limitTimesAcumMes',
				display: 'Veces Acumulado',
				columnOfRelationalTable: '',
				innierTable: ''
			},
		];
		return this.showColumns;
	}


	// Transaction quota
	getMenuColumnsTestingForTransactionQuota(): Column[] {
		this.showColumns = [
			{
				id: '1',
				columnOfTable: 'transactionId',
				display: 'ID Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '2',
				columnOfTable: 'transactionName',
				display: 'Nombre de Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '3',
				columnOfTable: 'transactionDescription',
				display: 'Descripción de Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '4',
				columnOfTable: 'hasQuota',
				display: 'tiene Quota',
				columnOfRelationalTable: '',
				innierTable: ''
			},

		];
		return this.showColumns;
	}

	getShowColumnsTestingForTransactionQuota(): Column[] {
		this.showColumns = [
			{
				id: '1',
				columnOfTable: 'transactionId',
				display: 'ID Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '2',
				columnOfTable: 'transactionName',
				display: 'Nombre de Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '3',
				columnOfTable: 'transactionDescription',
				display: 'Descripción de Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
		];
		return this.showColumns;
	}

	getMenuColumnsTestingForTransactionLimit(): Column[] {
		this.showColumns = [
			{
				id: '1',
				columnOfTable: 'transactionId',
				display: 'ID Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '2',
				columnOfTable: 'transactionName',
				display: 'Nombre de Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '3',
				columnOfTable: 'transactionDescription',
				display: 'Descripción deTransacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '4',
				columnOfTable: 'hasLimit',
				display: 'tiene límite',
				columnOfRelationalTable: '',
				innierTable: ''
			},

		];
		return this.showColumns;
	}

	getShowColumnsTestingForTransactionLimit(): Column[] {
		this.showColumns = [
			{
				id: '1',
				columnOfTable: 'transactionId',
				display: 'ID Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '2',
				columnOfTable: 'transactionName',
				display: 'Nombre de Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '3',
				columnOfTable: 'transactionDescription',
				display: 'Descripción de Transaccion',
				columnOfRelationalTable: '',
				innierTable: ''
			},
		];
		return this.showColumns;
	}

	getMenuColumnsTestingForActivityLimitMensual(): Column[] {
		this.showColumns = [
			{
				id: '1',
				columnOfTable: 'transactionId',
				display: 'ID Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '2',
				columnOfTable: 'transactionName',
				display: 'Nombre de Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '3',
				columnOfTable: 'transactionDescription',
				display: 'Descripción de Transaccion',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '11',
				columnOfTable: 'actionMes',
				display: 'Estado',
				columnOfRelationalTable: '',
				innierTable: 'parseStatus'
			},
			{
				id: '12',
				columnOfTable: 'limitAmountMes',
				display: 'Monto',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '13',
				columnOfTable: 'limitAmountDollarMes',
				display: 'Monto ($)',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '14',
				columnOfTable: 'limitTimesMes',
				display: 'Veces',
				columnOfRelationalTable: '',
				innierTable: ''
			},
		];
		return this.showColumns;
	}

	getShowColumnsTestingForActivityLimitMensual(): Column[] {
		this.showColumns = [
			{
				id: '2',
				columnOfTable: 'transactionName',
				display: 'Nombre de Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '11',
				columnOfTable: 'actionMes',
				display: 'Estado',
				columnOfRelationalTable: '',
				innierTable: 'parseStatus'
			},
			{
				id: '12',
				columnOfTable: 'limitAmountMes',
				display: 'Monto',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '13',
				columnOfTable: 'limitAmountDollarMes',
				display: 'Monto ($)',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '14',
				columnOfTable: 'limitTimesMes',
				display: 'Veces',
				columnOfRelationalTable: '',
				innierTable: ''
			},
		];
		return this.showColumns;
	}


	getMenuColumnsTestingForActivityLimitDiario(): Column[] {
		this.showColumns = [
			{
				id: '1',
				columnOfTable: 'transactionId',
				display: 'ID Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '2',
				columnOfTable: 'transactionName',
				display: 'Nombre de Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '3',
				columnOfTable: 'transactionDescription',
				display: 'Descripción de Transaccion',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '11',
				columnOfTable: 'action',
				display: 'Estado',
				columnOfRelationalTable: '',
				innierTable: 'parseStatus'
			},
			{
				id: '12',
				columnOfTable: 'limitAmount',
				display: 'Monto',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '13',
				columnOfTable: 'limitAmountDollar',
				display: 'Monto ($)',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '14',
				columnOfTable: 'limitTimes',
				display: 'Veces',
				columnOfRelationalTable: '',
				innierTable: ''
			},
		];
		return this.showColumns;
	}

	getShowColumnsTestingForActivityLimitDiario(): Column[] {
		this.showColumns = [
			{
				id: '2',
				columnOfTable: 'transactionName',
				display: 'Nombre de Transacción',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '11',
				columnOfTable: 'action',
				display: 'Estado',
				columnOfRelationalTable: '',
				innierTable: 'parseStatus'
			},
			{
				id: '12',
				columnOfTable: 'limitAmount',
				display: 'Monto',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '13',
				columnOfTable: 'limitAmountDollar',
				display: 'Monto ($)',
				columnOfRelationalTable: '',
				innierTable: ''
			},
			{
				id: '14',
				columnOfTable: 'limitTimes',
				display: 'Veces',
				columnOfRelationalTable: '',
				innierTable: ''
			},
		];
		return this.showColumns;
	}

	// LIMITES DE ACTIVIDAD END


}
