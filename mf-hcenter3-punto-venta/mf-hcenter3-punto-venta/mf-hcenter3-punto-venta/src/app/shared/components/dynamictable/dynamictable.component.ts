import {
  Component,
  ViewChild,
  Input,
  Output,
  AfterViewChecked,
  ChangeDetectorRef,
  OnInit,
  EventEmitter,
  HostListener,
  OnChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, NavigationExtras } from '@angular/router';
import { DatePipe } from '@angular/common';
import { utils, WorkBook, writeFile } from 'xlsx';
import { SelectionModel } from '@angular/cdk/collections';
import { Column } from '../../entities/column';
import { ColumnDefinition } from '../../entities/column-definition';
import { Utils } from '../../entities/utils';
import { QuotaService } from '../../services/quota.service';
import { LimiteActividadService } from '../../services/limite-actividad.service';
import { SupervisorService } from '../../services/supervisor.service';
import { PopupLinkComponent } from '../popup-link/popup-link.component';
import { Terminal } from '../../entities/terminal';
import { ProfileMerchantService } from '../../services/profileMerchant.service';
import { MerchantQuota } from '../../entities/merchant-quota';
import { GroupCardLimit } from '../../entities/group-card-limit';
import { Supervisor } from '../../entities/supervisor';
import { PopupManageColumnsComponent } from '../popup-manage-columns/popup-manage-columns.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTableDataSource } from '@angular/material/table';
import { Role } from '../../entities/role';
import { RolePos } from '../../entities/role-pos';
import { UserPos } from '../../entities/user-pos';

@Component({
  selector: 'app-dynamictable',
  templateUrl: './dynamictable.component.html',
  styleUrls: ['./dynamictable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamictableComponent
  implements AfterViewChecked, OnInit, OnChanges
{
  // public static filterObject = new Set();

  myInnerHeight: number;
  sort: MatSort;
  paginator: MatPaginator;
  contextMenu: MatMenuTrigger;
  positionSplice: number = 0;
  selection: SelectionModel<any>;
  //INCIDENCIA EL2909
  dataTableOrigin: string = '';
  @Input() dataTable: any[]; // Informacion que va en la Tabla -> se inyecta directamente al dataSource
  @Input() showColumns: Column[]; // Columnas visibles
  @Input() menuColumns: Column[]; // Menu de Opciones de columnas posiblemente visibles
  @Input() componenteDialog: string; // Nombre del componente que se abrira como Dialog
  // (este componente se apertura cuando se da click en un registro)
  @Input() selectIdValue: string; // Valor de seleccion de la fila al momento de hacer click en el checkbox
  @Input() checkBox: boolean; // flag que indica si se permite visualizar checkbox o no
  @Input() deleteMany: boolean = false; // flag que indica si se permite eliminar varios
  @Input() arrayOfTable = [5, 20, 50, 100]; // array de de comparadores de la tabla
  @Input() clearFilter = true; // activa/desactiva el clear filtro
  @Input() checkBoxColor = 'red'; // color del checkbox

  @Input() animal: string; // variable que utilzia el modal (aun no he descubierto para que sirve)
  @Input() name: string; // variable que utilzia el modal (aun no he descubierto para que sirve)

  @Input() porcentajeTamaño? = 0.758;
  @Input() margenButtonPx? = 20;

  @Input() dataSelect?: any[]; // informacion para marcar select
  @Input() uniqueSelect?: boolean = false; // flag que indica que solo se permite seleccionar un registro de la tabla
  @Input() permiteAllSelect?: boolean; // flag que indica que se permite seleccionar todos los registros de la tabla
  @Input() disableCheck?: boolean; // flag que deshabilida las filas para no ser enviadas

  @Input() havePaginator?: boolean; // flag que indica si se muestra la paginacion

  @Input() flagOrderSelectionItems?: boolean; // flag que indica si se ordenan los items al seleccionarlos

  @Output() outPutEventEmitter = new EventEmitter<any>();

  @Input() typeHeight?: string = 'default';

  @Input() flgShowFilters: boolean = true;

  @Input() disableButtonDelete: boolean = false; //flag que indique si el boton de eliminar debe estar deshabilitado, por defecto es false

  @Output() clickRowEventEmitter = new EventEmitter<any>();

  // Impouts para export excel
  @Input() export: boolean = false;
  @Input() module: any;
  @Input() funcNameExport: Function;

  columnsUpdated = false;

  paint: boolean = false;
  EmitResult = {
    pageNumber: '',
    pageSize: '',
  };
  sizePaginate = 2;
  pageIndex = 0;

  // p: number = 1;
  // size = 1;

  pageSize = 20;
  pageEvent: PageEvent;
  @Input() eliminationMode = false;
  @Output() isEliminationMode = new EventEmitter<boolean>(false); //Comunica que se activó el modo eliminación masiva
  @Output() requestDeleteRow = new EventEmitter<any>(); //Comunica que se quiere eliminar un registro de la tabla.
  @Input() isMasterTable = false; //Para saber si es una tabla maestra (con eliminar-editar) o sólo muestra datos (dentro de edits)
  @Input() isModifyOnlyTable = false;
  @Input() isClickableRow = false; //Para saber si se puede acceder al editar dando click en el row (por defecto solo dando click en el icono editar)
  @Input() showActions = true;

  columnsaux: ColumnDefinition[] = [];
  displayedColumns = []; //this.columnsaux.map((c) => c.columnDef);

  idColumnsWithDisplayColumns: any = {
    // displayedColumns: this.displayedColumns,
    // displayedColumnsValues: this.menuColumns,
  };
  dataSource: MatTableDataSource<any>;
  hidden: boolean;
  columndisplay: Column;
  show = false;
  contextMenuPosition = { x: '0px', y: '0px', index: -1, value: '' };

  filter: any;

  fomrControlFilter = new Map<string, FormControl>();
  keyOfData = new Map<string, string>();
  activeKeySearch: string;
  filterValues = {};
  activateLink: boolean = false; // Verifica si hace click en la fila o en el enlace

  @ViewChild(MatMenuTrigger, { static: false }) set matMenu(
    contextMenu: MatMenuTrigger
  ) {
    this.contextMenu = contextMenu;
    // this.selection = new SelectionModel<any>(true, []);
    // this.selection.clear();
    // DynamictableComponent.filterObject.clear();
  }

  @ViewChild(MatSort, { static: false }) set matSort(sort: MatSort) {
    this.sort = sort;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator, { static: false }) set matPaginator(
    paginator: MatPaginator
  ) {
    this.paginator = paginator;
    this.setDataSourceAttributes();
  }

  constructor(
    public dialog: MatDialog,
    public utils: Utils,
    private cdRef: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private router: Router,
    private quotaService: QuotaService,
    private limitService: LimiteActividadService,
    private supervisorService: SupervisorService,
    public datepipe: DatePipe,
    private profileService: ProfileMerchantService
  ) {
    // DynamictableComponent.filterObject = new Set();
    this.hidden = false;
    this.uniqueSelect = false;
    this.permiteAllSelect = true;
    this.disableCheck = true;
    this.havePaginator = true;
    this.flagOrderSelectionItems = false;
    this.selection = new SelectionModel();
    this.dataSource = new MatTableDataSource();

    console.log(this.uniqueSelect);
  }

  ngOnInit() {
    this.refreshData(false);
    this.selection.isSelected = this.isChecked.bind(this);
    console.log(this.showColumns);
    console.log(this.menuColumns);
  }

  paginate(event: any) {
    this.pageIndex = event;
    this.dataSource = this.dataSource.data.slice(
      event * this.sizePaginate - this.sizePaginate,
      event * this.sizePaginate
    ) as any;
  }

  public cleanFormInputsFilters() {
    console.log('cleanFormInputsFilters');
    this.menuColumns.forEach((menuColumn) => {
      this.fomrControlFilter.forEach((value: FormControl, key: string) => {
        if (key != menuColumn.columnOfTable) {
          (value as FormControl).setValue('');
        }
      });
    });
  }

  cloneObject(o: any) {
    return JSON.parse(JSON.stringify(o));
  }
  //INCIDENCIA EL2909
  //Formateando data antes de render a la tabla
  async cargarData(updateColumnas) {
    if (!updateColumnas) {
      for (let element of this.dataTable) {
        for (const column of this.menuColumns as Column[]) {
          const inputb1 = this.cloneObject(element[column.columnOfTable]);
          const inputb2 = this.cloneObject(column.columnOfTable);

          const b = this.formatDataSync(inputb1, inputb2);

          element[column.columnOfTable] = b;
        }
        const cloneElement = this.cloneObject(element);
        element = cloneElement;
      }
      console.log('FIN CARGA');
      // const fakePromise = Promise.resolve(3);
      // return await Promise.all([fakePromise]);
    }
  }

  public refreshData(updateColumnas: boolean = false) {
    //Guardando información sin formato
    this.dataTableOrigin = JSON.stringify(this.dataTable);
    this.myInnerHeight =
      this.porcentajeTamaño * window.innerHeight - this.margenButtonPx;
    //INCIDENCIA EL2909
    this.createColumns();
    this.cargarData(updateColumnas).then(() => {
      this.dataSource = new MatTableDataSource(this.dataTable);
      this.selection = new SelectionModel<any>(true, []);
      if (
        this.dataSelect != undefined &&
        this.dataSelect != null &&
        this.dataSelect.length > 0
      ) {
        this.llenarSelection();
      }
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.idColumnsWithDisplayColumns = {
        displayedColumns: this.displayedColumns,
        displayedColumnsValues: this.menuColumns,
      };

      this.menuColumns.forEach((menuColumn) => {
        this.getFormControl(menuColumn.display);
        // console.log(menuColumn);
        if (
          menuColumn.display.includes('Estado') &&
          menuColumn.columnOfTable !== 'enabled'
        ) {
          this.columndisplay = menuColumn;
        }
      });

      this.dataSource.data = this.dataTable;

      this.dataSource.filterPredicate = this.createFilter(this.keyOfData);

      this.dataSource._updateChangeSubscription();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.myInnerHeight =
      this.porcentajeTamaño * event.target.innerHeight - this.margenButtonPx;
  }
  ngAfterViewChecked() {
    const show = this.isShowExpand();
    if (show != this.show) {
      // verifica si show cambia, llama CD (cooldown) actualiza vista

      this.show = show;
      this.cdRef.detectChanges();
    }
  }

  ngOnChanges() {
    this.refreshData(true);
    this.cleanFormInputsFilters();
  }

  isShowExpand() {
    const show = this.dataSource === undefined ? false : true;
    return show;
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.createColumns();
  }

  createColumns() {
    this.columnsaux = [];
    if (
      this.showColumns != undefined &&
      this.showColumns != null &&
      (this.showColumns as Column[]).length >= 1
    ) {
      (this.showColumns as Column[]).forEach((col) => {
        const aux = {};
        (aux as ColumnDefinition).columnDef = col.columnOfTable;
        (aux as ColumnDefinition).header = col.display;
        (aux as ColumnDefinition).linkModal = col.linkModal
          ? col.linkModal
          : false;

        (aux as ColumnDefinition).cell = (element: any) =>
          `${element[col.columnOfTable]}`;

        if (col.filterActive) {
          (aux as ColumnDefinition).filterActive =
            col.filterActive === undefined || col.filterActive; //Añadido para agregar o quitar campoFiltro
        } else {
          (aux as ColumnDefinition).filterActive = this.flgShowFilters;
        }

        this.columnsaux.push(aux as ColumnDefinition);
      }, this);
      if (this.checkBox) {
        const aux = {};
        (aux as ColumnDefinition).columnDef = 'checkbox';
        (aux as ColumnDefinition).header = 'checkbox';
        (aux as ColumnDefinition).cell = (element: any) => undefined;
        this.columnsaux.unshift(aux as ColumnDefinition);
        this.positionSplice = 1;
      }

      this.displayedColumns = this.columnsaux.map((c) => c.columnDef);
    } else {
      this.columnsaux = [];
      this.displayedColumns = this.columnsaux.map((c) => c.columnDef);
    }
    // if (this.isMasterTable) this.displayedColumns.push("action"); //Para que este al final de la tabla

    if (this.isMasterTable)
      this.displayedColumns.splice(this.positionSplice, 0, 'action');

    //Para ponerla después de la columna checbox
    console.log(this.columnsaux);
  }

  isAllSelected_old() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle_old() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  isAllSelectedWithoutFilter() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      let selecteds = 0;
      this.dataSource.filteredData.forEach((row) => {
        if (this.selection.isSelected(row)) {
          selecteds++;
        }
      });

      if (selecteds === this.dataSource.filteredData.length) {
        this.dataSource.filteredData.forEach((row) => {
          this.selection.deselect(row);
        });
      } else {
        this.dataSource.filteredData.forEach((row) => {
          this.selection.select(row);
        });
      }
    }
  }

  selCheckBoxUnit(row) {
    //this.uniqueSelect = false;
    console.log('seleccion unica', this.uniqueSelect);
    if (
      this.uniqueSelect &&
      (this.dataSelect == undefined ? 0 : this.dataSelect.length) !=
        this.dataTable.length
    ) {
      if (this.selection.isSelected(row)) {
        this.selection.deselect(row);
        return;
      }
      if (!this.isAllSelected()) {
        this.selection.clear();
      }
    }
    this.selection.toggle(row);
    this.ordenar(row);
    /*if (!this.selection.isSelected(row)) {
      DynamictableComponent.filterObject.delete(row);
    } else {
      DynamictableComponent.filterObject.add(row);
    }*/
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      /*if (!this.isAllSelected()) {
        DynamictableComponent.filterObject.clear();
      }*/
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row[this.selectIdValue] + 1
    }`;
  }

  onRightClick(event: MouseEvent, index: number, column: string) {
    // debugger;
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenuPosition.index = index;
    this.contextMenuPosition.value = column;
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  onContextMenuAction() {
    // console.log("onContextMenuAction");
    // console.log(
    //   "Se debe agregar a la visualizacion de la tabla las columnas selecionadas"
    // );
  }

  ocultar(view: any) {
    document.getElementById(view).style.display = 'none';
    document.getElementById(view).style.visibility = 'hidden';
  }

  openDialogEditarRow(row) {
    this.clickRowEventEmitter.emit(row);
  }

  openDialogEditar(row, rowObject: any): void {
    const rowEntity = JSON.parse(this.dataTableOrigin).filter(
      (element) => rowObject[this.selectIdValue] == element[this.selectIdValue]
    )[0];
    this.openDialogEditarRow(rowEntity);
    // Se filtra la entidad en la data original guardada
    const entity = JSON.parse(this.dataTableOrigin).filter(
      (element) => row == element[this.selectIdValue]
    )[0];
    console.log(
      JSON.parse(this.dataTableOrigin),
      entity,
      this.componenteDialog
    );

    let dialogRef: any;
    if (this.componenteDialog === undefined || this.componenteDialog == null) {
      return;
    }
    if (this.componenteDialog === this.utils.EDITAR_USER) {
      let userSerd: any;
      //se reemplazó JSON.parse(this.dataTableOrigin) por this.datatable
      userSerd = JSON.parse(this.dataTableOrigin).filter(
        (element) => row == element.id
      )[0];
      const navigationExtras: NavigationExtras = { state: userSerd };
      this.router.navigate(['/user/editar-usuario'], navigationExtras);
      return;
    }
    // VERSION
    if (this.componenteDialog === this.utils.EDITAR_VERSION) {
      //se reemplazó JSON.parse(this.dataTableOrigin) por this.datatable
      let rolCurrent: any = JSON.parse(this.dataTableOrigin).filter(
        (item: UserPos) => item.id == row
      )[0];

      const navigationExtras: NavigationExtras = { state: rolCurrent };
      this.router.navigate(
        ['/download/version/editar-version'],
        navigationExtras
      );
      return;
    }

    if (this.componenteDialog === this.utils.FILE_VERSION) {
      //se reemplazó JSON.parse(this.dataTableOrigin) por this.datatable
      let rolCurrent: any = JSON.parse(this.dataTableOrigin).filter(
        (item: UserPos) => item.id == row
      )[0];

      const navigationExtras: NavigationExtras = { state: rolCurrent };
      this.router.navigate(
        ['/download/version/editar-version'],
        navigationExtras
      );
      return;
    }

    if (this.componenteDialog === this.utils.NUEVO_VERSION) {
      //se reemplazó JSON.parse(this.dataTableOrigin) por this.datatable
      let rolCurrent: any = JSON.parse(this.dataTableOrigin).filter(
        (item: UserPos) => item.id == row
      )[0];

      const navigationExtras: NavigationExtras = { state: rolCurrent };
      this.router.navigate(
        ['/download/version/crear-version'],
        navigationExtras
      );
      return;
    }

    // USERPOS
    if (this.componenteDialog === this.utils.EDITAR_USER_POS) {
      //se reemplazó JSON.parse(this.dataTableOrigin) por this.datatable
      let rolCurrent: any = JSON.parse(this.dataTableOrigin).filter(
        (item: UserPos) => item.id == row
      )[0];

      const navigationExtras: NavigationExtras = { state: rolCurrent };
      this.router.navigate(['/operador/editar-usuariopos'], navigationExtras);
      return;
    }

    if (this.componenteDialog === this.utils.NUEVO_USER_POS) {
      //se reemplazó JSON.parse(this.dataTableOrigin) por this.datatable
      let rolCurrent: any = JSON.parse(this.dataTableOrigin).filter(
        (item: UserPos) => item.id == row
      )[0];

      const navigationExtras: NavigationExtras = { state: rolCurrent };
      this.router.navigate(['/operador/crear-usuariopos'], navigationExtras);
      return;
    }

    // ROLPOS
    if (this.componenteDialog === this.utils.EDITAR_ROLPOS) {
      //se reemplazó JSON.parse(this.dataTableOrigin) por this.datatable
      let rolCurrent: any = JSON.parse(this.dataTableOrigin).filter(
        (item: RolePos) => item.id == row
      )[0];

      const navigationExtras: NavigationExtras = { state: rolCurrent };
      this.router.navigate(['/rolpos/editar-rolpos'], navigationExtras);
      return;
    }

    if (this.componenteDialog === this.utils.EDITAR_ROL) {
      //se reemplazó JSON.parse(this.dataTableOrigin) por this.datatable
      let rolCurrent: any = JSON.parse(this.dataTableOrigin).filter(
        (item: Role) => item.id == row
      )[0];

      const navigationExtras: NavigationExtras = { state: rolCurrent };
      this.router.navigate(['/rolAdmin/editar-rol'], navigationExtras);
      return;
    }

    if (this.componenteDialog === this.utils.EDITAR_CADENA_COMERCIO) {
      /*let requestEditRalliedCurrent: MerchantChain;
      this.merchantChain.forEach(element => {
        if (row == element.cmcchainID) {
          requestEditRalliedCurrent = element;
        }
      });*/
      this.router.navigate(['/config-red/cadena-comercio/editar-cadena', row]);
      return;
    }

    if (this.componenteDialog === this.utils.EDITAR_COMERCIO) {
      /*let requestEditRalliedCurrent: MerchantChain;
      this.merchantChain.forEach(element => {
        if (row == element.cmcchainID) {
          requestEditRalliedCurrent = element;
        }
      });*/
      this.router.navigate(['/config-red/comercio/editar-comercio', row]);
      return;
    }

    if (this.componenteDialog === this.utils.EDITAR_PERFIL_COMERCIO) {
      let datasend: any;
      datasend = entity;
      // datasend = this.dataTable.filter(
      //   (element) => row == element[this.selectIdValue]
      // )[0];
      const navigationExtras: NavigationExtras = { state: datasend };
      this.router.navigate(
        ['/config-red/perfil-comercio/editar-perfil'],
        navigationExtras
      );
      return;
    }

    if (this.componenteDialog === this.utils.EDITAR_TERMINAL) {
      let composeID: string[] = row.split('-');
      //se reemplazó JSON.parse(this.dataTableOrigin) por this.datatable
      let terminalCurrent: any = JSON.parse(this.dataTableOrigin).filter(
        (item: Terminal) =>
          item.ctrMerchantId == composeID[0] &&
          item.ctrTerminalNum == composeID[1]
      )[0];

      const navigationExtras: NavigationExtras = { state: terminalCurrent };
      this.router.navigate(
        ['config-red/terminal/editar-terminal'],
        navigationExtras
      );
      return;
    }

    if (this.componenteDialog === this.utils.APROBACION_SOLICITUD) {
      let reqApprCurrent: any = entity;
      // let reqApprCurrent: any = this.dataTable.filter(
      //   (element) => row == element[this.selectIdValue]
      // )[0];
      const navigationExtras: NavigationExtras = { state: reqApprCurrent };
      this.router.navigate(['/approvalRequestDetails'], navigationExtras);

      return;
    }

    if (this.componenteDialog === this.utils.EDITAR_LDAP) {
      let datasend: any;
      datasend = entity;
      // datasend = this.dataTable.filter(
      //   (element) => row == element[this.selectIdValue]
      // )[0];
      const navigationExtras: NavigationExtras = { state: datasend };
      this.router.navigate(['/ldap/editar-ldpa'], navigationExtras);
      return;
    }

    if (this.componenteDialog === this.utils.EDITAR_CUPO_COMERCIO) {
      let nav = {} as NavigationExtras;
      const merchant = entity as MerchantQuota;
      //const merchant = rowObject as MerchantQuota;
      nav.state = merchant;

      const navigationExtras: NavigationExtras = { state: rowObject };
      this.quotaService.nextMerchant(merchant);
      this.quotaService.nexMerchantLS(merchant);
      this.router.navigate(['/config-red/cupo-comercio/editar-cupo'], nav);
      return;
    }

    if (this.componenteDialog === this.utils.EDITAR_LIMITE_ACTIVIDAD) {
      let nav = {} as NavigationExtras;
      const groupCard = entity as GroupCardLimit;
      //const groupCard = rowObject as GroupCardLimit;
      nav.state = groupCard;
      const navigationExtras: NavigationExtras = { state: rowObject };
      this.limitService.nexGroupCardLS(groupCard);
      this.router.navigate(
        ['/config-red/limite-comercio/editar-limite-comercio'],
        nav
      );
      return;
    }

    if (this.componenteDialog === this.utils.EDITAR_SUPERVISOR_MANCOMUNADO) {
      let nav = {} as NavigationExtras;
      const supervisor = entity as Supervisor;
      //const supervisor = rowObject as Supervisor;
      this.supervisorService.nextSupervisorLS(supervisor);
      this.router.navigate([`/mancomunado/supervisor/editar`]);
      return;
    }

    if (this.componenteDialog === this.utils.EDITAR_COMMISSION) {
      let nav = {} as NavigationExtras;
      //Se reemplazó a rowObject por entity
      nav.state = entity;
      this.router.navigate([`/liquidation/mantComissionEditar`], nav);
      return;
    }

    // Editar Transaccion
    if (this.componenteDialog === this.utils.EDITAR_TRANSACCION) {
      let nav = {} as NavigationExtras;
      //Se reemplazó a rowObject por entity
      nav.state = entity;
      this.router.navigate([`/transaction/mantTransactionListar/editar`], nav);
      return;
    }

    if (this.componenteDialog === this.utils.EDITAR_APLICATION) {
      let nav = {} as NavigationExtras;
      //Se reemplazó a rowObject por entity
      nav.state = entity;
      // this.router.navigate([`/transaction/mantAplicationEditar`], nav);
      this.router.navigate([`/transaction/mantAplicationListar/editar`], nav);
      return;
    }

    if (this.componenteDialog === this.utils.EDITAR_GROUP_CARD) {
      let nav = {} as NavigationExtras;
      //Se reemplazó a rowObject por entity
      nav.state = entity;
      this.router.navigate([`/config-card/group-card-editar`], nav);
      return;
    }

    if (this.componenteDialog === this.utils.EDITAR_BINES_OPERADOR) {
      let nav = {} as NavigationExtras;
      //Se reemplazó a rowObject por entity
      nav.state = entity;
      this.router.navigate([`/config-red/bines/editar`], nav);
      return;
    }

    if (this.componenteDialog === this.utils.EDITAR_CATEGORIA) {
      let nav = {} as NavigationExtras;
      //Se reemplazó a rowObject por entity
      nav.state = entity;
      this.router.navigate([`/config-public/categorias/editar`], nav);
      return;
    }

    if (this.componenteDialog === this.utils.EDITAR_SUB_CATEGORIA) {
      let nav = {} as NavigationExtras;
      //Se reemplazó a rowObject por entity
      nav.state = entity;
      this.router.navigate([`/config-public/subCategorias/editar`], nav);
      return;
    }

    if (this.componenteDialog === this.utils.EDITAR_AFILIADO) {
      let nav = {} as NavigationExtras;
      //Se reemplazó a rowObject por entity
      nav.state = entity;
      this.router.navigate([`/config-public/afiliados-editar`], nav);
      return;
    }
    if (this.componenteDialog === this.utils.EDITAR_TIPO_CAMBIO) {
      let nav = {} as NavigationExtras;
      //Se reemplazó a rowObject por entity
      //nav.state = entity;
      nav.state = rowObject;

      this.router.navigate([`/parametros/tipo-cambioEditar`], nav);
      return;
    }

    if (this.componenteDialog === this.utils.EDITAR_CAMPO_LISTA) {
      let nav = {} as NavigationExtras;
      //Se reemplazó a rowObject por entity
      // nav.state = entity;
      nav.state = rowObject;
      this.router.navigate([`/parametros/campo-lista/edit`], nav);
      return;
    }

    if (this.componenteDialog === this.utils.EDITAR_AFILIADO_UBICACION) {
      let nav = {} as NavigationExtras;
      //Se reemplazó a rowObject por entity
      nav.state = entity;
      this.router.navigate([`/config-public/UbicacionAfiliados-editar`], nav);
      return;
    }

    // console.log(dialogRef);

    if (this.componenteDialog === this.utils.EDITAR_OPCION_AFILIADO) {
      let nav = {} as NavigationExtras;
      //Se reemplazó a rowObject por entity
      nav.state = entity;
      this.router.navigate([`/config-public/opciones-afiliados-editar`], nav);
    }
    if (this.componenteDialog === this.utils.EDITAR_AFILIADO_CADENA) {
      let nav = {} as NavigationExtras;
      //Se reemplazó a rowObject por entity
      nav.state = entity;
      this.router.navigate([`/config-public/afiliados-cadena-editar`], nav);
      return;
    }

    if (this.componenteDialog === this.utils.EDITAR_POPCOMERCIO) {
      //Se reemplazó a rowObject por entity
      this.dataSelect = entity;
      this.selCheckBoxUnit(this.dataSelect);
      return entity;
    }

    dialogRef.afterClosed().subscribe((result) => {
      // console.log("The dialog was closed");
      this.animal = result;
    });
  }
  verificarCheckBoxShowColumn(column: string) {
    let bRet = true;
    const filter = this.showColumns.filter(
      (col: any) => (col as Column).display === column
    );
    if (filter === undefined || filter == null || filter.length <= 0) {
      bRet = false;
    }
    return bRet;
  }

  changeShowColumn(column: Column, checked: boolean) {
    this.hidden = true;
    if (checked) {
      this.showColumns.push(column);
    } else {
      const filter = this.showColumns.filter(
        (col: any) => (col as Column).display === column.display
      );
      const index: number = this.showColumns.indexOf(filter[0]);
      if (index !== -1) {
        this.showColumns.splice(index, 1);
      }
    }
    this.hidden = false;
  }
  getFormControl(columnName: string) {
    if (this.columndisplay != undefined) {
      //console.log(this.columndisplay);
      //console.log(this.keyOfData.get(this.columndisplay.display));
      //console.log(this.fomrControlFilter.get(this.columndisplay.display));
      //console.log(this.fomrControlFilter.get(this.columndisplay.display).value);
      /*if(this.fomrControlFilter.get(this.columndisplay.display).value!==""){
        if("habilitado".includes(this.fomrControlFilter.get(this.columndisplay.display).value)){
          this.fomrControlFilter.get(this.columndisplay.display).setValue("0");
        }else if("deshabilitado".includes(this.fomrControlFilter.get(this.columndisplay.display).value)){
          this.fomrControlFilter.get(this.columndisplay.display).setValue("1");
        }else{
          this.fomrControlFilter.get(this.columndisplay.display).setValue("");
        }
      }*/
      //console.log(this.fomrControlFilter.get(this.columndisplay.display).value);
    }

    if (
      this.keyOfData.get(columnName) == undefined ||
      this.keyOfData.get(columnName) == null
    ) {
      const columnSearch = this.menuColumns.filter(
        (col) => col.display === columnName
      )[0];
      this.keyOfData.set(columnName, columnSearch.columnOfTable);
      this.filterValues[this.keyOfData.get(columnName)] = '';
    }
    if (
      this.fomrControlFilter.get(columnName) == undefined ||
      this.fomrControlFilter.get(columnName) == null
    ) {
      const formControl = new FormControl('');
      formControl.valueChanges.subscribe((value) => {
        //INCIDENCIA EL2809
        // if (this.columndisplay != undefined) {
        //   if (
        //     this.keyOfData.get(columnName) === this.columndisplay.columnOfTable
        //   ) {
        //     console.log(value)
        //     if (
        //       this.fomrControlFilter.get(this.columndisplay.display).value !==
        //       ""
        //     ) {
        //       console.log(value)
        //       if ("habilitado".toLowerCase().includes(value.toLowerCase())) {
        //         value = "0";
        //       } else if (
        //         "deshabilitado".toLowerCase().includes(value.toLowerCase())
        //       ) {
        //         if (
        //           this.columndisplay.columnOfTable === "cmrStatus" ||
        //           this.columndisplay.columnOfTable === "statusmerq"
        //         ) {
        //           value = "2";
        //           console.log(value)
        //         } else {
        //           value = "1";
        //           console.log(value)
        //         }
        //       } else {
        //         value = value;
        //         console.log(value)
        //       }
        //     } else {
        //       value = value;
        //       console.log(value)
        //     }
        //   }
        // }

        //Incidencia #33019 > No se debe reemplazar caracteres del valor del Filtro.
        if (value) {
          if (value === '') return;
        }
        this.filterValues[this.keyOfData.get(columnName)] = value
          .toLowerCase()
          .trim();

        this.dataSource.filter = JSON.stringify(this.filterValues);
      });
      this.fomrControlFilter.set(columnName, formControl);
    }
    return this.fomrControlFilter.get(columnName);
  }

  createFilter(
    mapKeySearch: Map<string, string>
  ): (data: any, filter: string) => boolean {
    const filterFunction = (data: any, filter: string): boolean => {
      let bRet = true;
      const searchTerms = JSON.parse(filter);

      mapKeySearch.forEach((value: string, key: string) => {
        let compareData;
        if (data[value]) {
          compareData = data[value]
            .toString()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
        } else {
          compareData = data[value];
        }

        if (
          this.showColumns.find(
            (x) =>
              x.columnOfTable === 'application' &&
              x.innierTable === 'castApplicationAll'
          ) != null &&
          value == 'application' &&
          searchTerms['application'] != ''
        ) {
          console.log('----------------------------------');
          console.log('value', value);
          console.log('compareData', compareData);
          console.log('this.showColumns', this.showColumns);
          console.log('bRet', bRet);
          console.log('compareData', compareData);
          console.log('searchTerms', searchTerms);
          console.log('searchTerms[value]', searchTerms[value]);
          compareData = this.utils.castApplicationAll(compareData);
          console.log('----------------------------------');
        }

        bRet =
          bRet &&
          (compareData + '')
            .toLowerCase()
            .indexOf(
              searchTerms[value]
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') + ''
            ) !== -1;
      });
      if (bRet) {
        // DynamictableComponent.filterObject.add(data);
      }
      return bRet;
    };

    return filterFunction;
  }

  asigKeySearch(columnName: string) {
    this.activeKeySearch = columnName;

    this.clearFormsControl(columnName, this.filterValues);
  }

  private clearFormsControl(columnName: string, filterValues: any) {
    if (this.clearFilter) {
      this.fomrControlFilter.forEach((value: FormControl, key: string) => {
        if (key != columnName) {
          (value as FormControl).setValue('');
        }
      });

      this.fomrControlFilter
        .get(columnName)
        .setValue(this.fomrControlFilter.get(columnName).value);
    }
  }

  public pickDataCheck() {
    /*const numberOfTotalSelection = this.utils.getDataOutPut(this.selection[this.utils.SELECTION_ARRAY]).length;
    const numberOfTotalFiltered = this.utils.getDataOutPut(DynamictableComponent.filterObject).length;

    if (numberOfTotalSelection === numberOfTotalFiltered) {
      this.outPutEventEmitter.emit(this.selection[this.utils.SELECTION_ARRAY]);
    } else if (numberOfTotalSelection === 0 && numberOfTotalFiltered >= 0) {
      this.outPutEventEmitter.emit(this.selection[this.utils.SELECTION_ARRAY]);
    } else if (numberOfTotalSelection >= 0 && numberOfTotalFiltered === 0) {
      this.outPutEventEmitter.emit(this.selection[this.utils.SELECTION_ARRAY]);
    } else if (numberOfTotalSelection >= 0 && numberOfTotalFiltered >= 0 && numberOfTotalFiltered < numberOfTotalSelection) {
      this.outPutEventEmitter.emit(this.selection[this.utils.SELECTION_ARRAY]);
    } else if (numberOfTotalSelection >= 0 && numberOfTotalFiltered >= 0 && numberOfTotalFiltered > numberOfTotalSelection) {
      this.outPutEventEmitter.emit(DynamictableComponent.filterObject);
    } else {
      this.outPutEventEmitter.emit(this.selection[this.utils.SELECTION_ARRAY]);
    }*/
    if (this.uniqueSelect) {
      if (
        this.permiteAllSelect &&
        !this.isAllSelected() &&
        this.utils.getDataOutPut(this.selection[this.utils.SELECTION_ARRAY])
          .length > 1
      ) {
        this.selection.clear();
      }
    }

    this.outPutEventEmitter.emit(this.selection[this.utils.SELECTION_ARRAY]);
  }

  get setCheckBoxColor() {
    // return this.sanitizer.bypassSecurityTrustStyle(
    //   `--checkboxcolor: ${this.checkBoxColor};`
    // );

    return this.sanitizer.bypassSecurityTrustStyle(`--checkboxcolor: #E4002B;`);
  }

  exportExcel2() {
    //Establecer el nombre con el que saldra el archivo
    var d = new Date();
    let latest_date = this.datepipe.transform(d, 'yyyyMMddhhmmss');

    //Para obtener la data Filtrada, igual a como se muestra en la tabla
    let newArray: any = new Array();
    let Objetoprueba = Object.create(Object.prototype);

    for (let i = 0; i < this.dataSource.filteredData.length; i++) {
      for (let k = 2; k < this.displayedColumns.length; k++) {
        Objetoprueba[this.displayedColumns[k]] =
          this.dataSource.filteredData[i][this.displayedColumns[k]];

        if (k == this.displayedColumns.length - 1) {
          newArray[i] = Objetoprueba;
          Objetoprueba = {};
        }
      }
    }

    //Para realizar la exportacion a Excel
    const workSheet = utils.json_to_sheet(newArray);
    const workBook: WorkBook = utils.book_new();
    utils.book_append_sheet(workBook, workSheet, 'reporte');
    writeFile(workBook, 'xlsx_' + latest_date + '.xlsx');
  }

  getStyleClass_old(column: string, row: any) {
    if (column === 'checkbox') {
      return 'header-cell-left';
    } else if (this.utils.isNumber(row)) {
      return 'header-cell-center';
    } else {
      return 'header-cell-left';
    }
  }

  getStyleClass(column: string, existFiler: boolean, row: any) {
    //INCIDENCIA EL2909
    //Se creó esta validación para reporte detallado
    if (this.componenteDialog == this.utils.REPORT_COMISSION_COMPONENT) {
      return 'header-cell-normal';
    }
    if (column === 'checkbox') {
      return 'header-cell-left';
    } else if (!existFiler) {
      return 'header-cell-center';
    } else if (this.utils.isNumber(row)) {
      return 'header-cell-left';
    } else {
      return 'header-cell-left';
    }
  }

  getStyleClassHeader(column: string) {
    if (column === 'checkbox') {
      return 'mat-column-checkbox ';
    } else {
      return '';
    }
  }

  //Se cambió a asíncrono para formatear antes de renderizar la tabla
  async formatData(value: string, columnHeader: string) {
    let sRet = '';
    // debugger;
    const menuColumn: Column = this.menuColumns.filter(
      (x) => x.columnOfTable === columnHeader
    )[0];
    if (
      menuColumn === undefined ||
      menuColumn == null ||
      menuColumn.innierTable === undefined ||
      menuColumn.innierTable == null
    ) {
      sRet = value;
    } else {
      if (this.utils[menuColumn.innierTable]) {
        sRet = this.utils[menuColumn.innierTable](value);
      } else {
        sRet = value;
      }
    }
    sRet = this.utils.castNullPorValor(sRet, ' ');
    return sRet;
  }

  formatDataSync(value: string, columnHeader: string) {
    let sRet = '';
    // debugger;
    const menuColumn: Column = this.menuColumns.filter(
      (x) => x.columnOfTable === columnHeader
    )[0];
    if (
      menuColumn === undefined ||
      menuColumn == null ||
      menuColumn.innierTable === undefined ||
      menuColumn.innierTable == null
    ) {
      sRet = value;
    } else {
      if (this.utils[menuColumn.innierTable]) {
        sRet = this.utils[menuColumn.innierTable](value);
      } else {
        sRet = value;
      }
    }
    sRet = this.utils.castNullPorValor(sRet, ' ');
    return sRet;
  }

  isChecked(row: any): boolean {
    const found = this.selection.selected.find(
      (el) => el[this.selectIdValue] === row[this.selectIdValue]
    );
    if (found) {
      return true;
    }
    return false;
  }

  llenarSelection() {
    this.dataSelect.forEach((row) => {
      this.selCheckBoxUnit(row);
      // this.selection.toggle(row);
      // this.ordenar(row);
    });
    this.pickDataCheck();
  }

  ordenar(row) {
    if (this.selection.isSelected(row) && this.flagOrderSelectionItems) {
      const index = this.dataSource.data.indexOf(row);
      this.dataSource.data = this.array_move(this.dataSource.data, index, 0);
    }
  }

  array_move(arr: any[], oldIndex: number, newIndex: number): any[] {
    if (oldIndex >= arr.length) {
      let k = newIndex - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
  }

  //Añadido para agregar o quitar campoFiltro
  showFilter(value: boolean): boolean {
    return value;
  }

  showTestEmit = ($event) => {
    this.EmitResult = {
      pageNumber: $event.pageIndex,
      pageSize: $event.pageSize,
    };
  };

  toggleEliminationMode() {
    this.eliminationMode = !this.eliminationMode;
    if (!this.eliminationMode) this.selection.clear();
    this.isEliminationMode.emit(this.eliminationMode);
  }

  requestDeleteData(row) {
    if (!this.disableButtonDelete) {
      this.requestDeleteRow.emit([row]);
    }
  }

  openManageColumns() {
    const dialogRef = this.dialog.open(PopupManageColumnsComponent, {
      width: '400px',
      height: '544px',
      panelClass: 'my-popup-manage-columns-container',
      data: [
        this.idColumnsWithDisplayColumns.displayedColumnsValues,
        this.showColumns,
      ],
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.showColumns = result;
        this.columnsaux = result;
        this.refreshData(true);
      }
    });
  }

  clickOnRow(selectIdValue, element) {
    if (!this.activateLink) {
      if (this.isClickableRow) {
        this.openDialogEditar(selectIdValue, element);
        // this.openDialogEditarRow(element);
      }
    }

    this.activateLink = false;
  }

  exportData() {
    this.module.exportData();
  }

  async openModalDetail(row: any) {
    this.activateLink = true;
    const data = await this.profileService
      .findMerchantByProfile(row.cmpprofileId)
      .toPromise();
    const dialogRef = this.dialog.open(PopupLinkComponent, {
      width: '80%',
      disableClose: false,
    });

    dialogRef.componentInstance.id = row.cmpprofileId;
    dialogRef.componentInstance.data = data;
    dialogRef.componentInstance.displayedColumns = [
      'cmrmerchantid',
      'dmrmerchantname',
      'dmcchainname',
      'cmrprofileid',
      'cmrstatus',
    ];
  }
}
