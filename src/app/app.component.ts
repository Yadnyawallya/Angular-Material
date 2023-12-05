import { Component, OnInit,ViewChild,AfterViewInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { DialogComponent } from './dialog/dialog.component';

import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { ApiService } from './services/api.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'project';

  displayedColumns: string[] = ['productName', 'Category', 'Date', 'Freshness','comment','price','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private  dialog :MatDialog , private api:ApiService ) {}
  ngOnInit(): void {
   this.getAllProduct();
  }
  
  openDialog() {
    this.dialog.open(DialogComponent, {
      width:'30%'
    }).afterClosed().subscribe(val=>{
      if(val==='save'){
        this.getAllProduct();
      }
    })
  }

  getAllProduct(){
      this.api.getproduct()
      .subscribe({
        next:(res)=>{
          //console.log("get all product api",res);
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error:(err)=>{
            alert("Error while Fetching the Records!!");
        }
      })
  }
  editProduct (row : any ){
    this.dialog.open(DialogComponent,{
      width:'30%',
      data:row

    }).afterClosed().subscribe(val=>{
      if(val === 'update'){
        this.getAllProduct();
      }
    })
  }

  deleteProduct(id : number){
    this.api.deleteProduct(id)
    .subscribe({
      next:(res)=>{
        alert("product deleted Sucessfully");
        this.getAllProduct();
      },
      error:(res)=>{
        alert("error while deleting the record");
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
