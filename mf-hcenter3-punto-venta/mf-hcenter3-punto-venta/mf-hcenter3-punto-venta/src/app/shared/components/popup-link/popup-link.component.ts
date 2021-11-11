import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProfileMerchantService } from '../../services/profileMerchant.service';

@Component({
  selector: 'app-popup-link',
  templateUrl: './popup-link.component.html',
  styleUrls: ['./popup-link.component.scss']
})
export class PopupLinkComponent implements OnInit, AfterViewInit  {

  id: string;
  data: any;
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;
  isLoading : boolean = false;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;


  constructor(private profileService: ProfileMerchantService) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {

    this.isLoading = true;
    this.dataSource = new MatTableDataSource(this.data);
    this.isLoading = false;

    // this.profileService.findMerchantByProfile(this.id).subscribe((data: any) => {
    //   this.dataSource = new MatTableDataSource(data);
    //   this.isLoading = false;
    //   this.dataSource.paginator = this.paginator;
    // });

  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
