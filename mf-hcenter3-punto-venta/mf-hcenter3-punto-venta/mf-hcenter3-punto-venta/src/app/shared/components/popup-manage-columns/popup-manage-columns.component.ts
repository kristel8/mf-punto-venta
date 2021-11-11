import {
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Column } from "../../entities/column";

@Component({
  selector: "app-popup-manage-columns",
  templateUrl: "./popup-manage-columns.component.html",
  styleUrls: ["./popup-manage-columns.component.scss"],
})
export class PopupManageColumnsComponent implements OnInit {
  displayedColumns = [];
  showColumns = [];
  mapBlockableColumns = new Set();

  constructor(
    public dialogRef: MatDialogRef<PopupManageColumnsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Array<any>
  ) {}

  ngOnInit() {
    // console.log(this.data);
    this.displayedColumns = this.data[0];
    this.showColumns = this.data[1];
    // console.log(this.displayedColumns);
    // console.log(this.showColumns);
    this.displayedColumns.forEach(disCol => {
      if(disCol.blockAdminCol) {
        this.mapBlockableColumns.add(disCol.display);
      }
    });

  }

  verificarCheckBoxShowColumn(column: string) {

    if(this.mapBlockableColumns.has(column)) {
      return true;
    }

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
    // console.log(this.showColumns);

    // this.hidden = true;
    if (checked) {
      this.showColumns.push(column);
    } else {
      const filter = this.showColumns.filter(
        (col: any) => (col as Column).display === column.display
      );
      // console.log(filter);
      const index: number = this.showColumns.indexOf(filter[0]);
      if (index !== -1) {
        this.showColumns.splice(index, 1);
      }
    }
    // this.hidden = false;
  }

  ocultar(view: any) {
    // document.getElementById(view).style.display = "none";
    // document.getElementById(view).style.visibility = "hidden";
  }

  compareDisplayAndShowColumns(column, showColumn): boolean {
    return column.columnOfRelationalTable == showColumn.columnOfRelationalTable
    &&
    column.columnOfTable == showColumn.columnOfTable
    &&
    column.display == showColumn.display
    &&
    column.id == showColumn.id
    &&
    column.innierTable == showColumn.innierTable
  }

  drop(event: CdkDragDrop<any>) {
    // console.log(lista);
    moveItemInArray(
      this.displayedColumns,
      event.previousIndex,
      event.currentIndex
    );
    // console.log(this.showColumns);
    // console.log(this.displayedColumns);

    let showColumnsAux = [];
    // debugger;
    this.displayedColumns.forEach((column) => {
      // console.log(column);

      // if(this.showColumns.conta(column)!==-1){
      //   showColumnsAux.push(column);
      // }
      // console.log(
      //   this.showColumns.filter((showColumn) => JSON.stringify(column) === JSON.stringify(showColumn))
      // );
      this.showColumns.forEach((showColumn) => {
        //if (JSON.stringify(column) === JSON.stringify(showColumn)) {
        if (this.compareDisplayAndShowColumns(column, showColumn)) {
        showColumnsAux.push(column);
        }
      });
    });

    // console.log("nuevo showColumns: ", showColumnsAux);
    this.showColumns = showColumnsAux;
  }
}
