import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { publishFacade } from '@angular/compiler';


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  freshnessList = ["Brand New" , "Second Hand", "Refurbished"];
  ProductForm !:FormGroup;
  actionBtn : string = "Save";
  constructor( private formBuilder:FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public editData:any, 
    private api:ApiService , 
    private dialogRef : MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.ProductForm = this.formBuilder.group({
      productName : ['',Validators.required],
      Category : ['',Validators.required],
      Freshness : ['',Validators.required],
      price : ['',Validators.required],
      comment : ['',Validators.required],
      Date : ['',Validators.required]
    })

    //console.log(this.editData);
    if(this.editData){
      this.actionBtn = "Update"
      this.ProductForm.controls['productName'].setValue(this.editData.productName);
      this.ProductForm.controls['Category'].setValue(this.editData.Category);
      this.ProductForm.controls['Freshness'].setValue(this.editData.Freshness);
      this.ProductForm.controls['price'].setValue(this.editData.price);
      this.ProductForm.controls['comment'].setValue(this.editData.comment);
      this.ProductForm.controls['Date'].setValue(this.editData.Date);
    }
  }

 
  addProduct(){
    console.log("product value",this.ProductForm.value);
  if(!this.editData){
    if(this.ProductForm.valid){
      this.api.postProduct(this.ProductForm.value)
      .subscribe({
        next:(res)=>{
          alert("product added successfully");
          this.ProductForm.reset();
          this.dialogRef.close('save');
        },
        error:()=>{
          alert("error while adding the product");
        }
      })
    }
  }else{
    this.UpdateData()
  }
    //console.log("product value",this.ProductForm.value);
  }
  UpdateData(){
    this.api.putProduct(this.ProductForm.value,this.editData.id)
    .subscribe({
      next:(res)=>{
        console.log("update the data responce",res);
        alert("product updated sucessfully");
        this.ProductForm.reset();
        this.dialogRef.close('update');
      },
      error:(err)=>{
        alert("Error While updating the records");
      }

    })
  }

}
