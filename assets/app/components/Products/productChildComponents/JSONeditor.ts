import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { PaginatePipe, PaginationService } from 'ng2-pagination';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { OAOadminService } from "../../../services/OAOadmin.service";
import { Router } from "@angular/router";
import { ProductsInterface } from "../../../interfaces/product.interface";
import { ProductsTypeInterface } from "../../../interfaces/productType.interface";

declare var jQuery: any;
declare var moment: any;

@Component({
    templateUrl: './JsonEditor.component.html',

})

export class JsonEditor implements AfterViewInit {
    myForm: FormGroup;
    jsonEdit: any = {};
    editedData: any = {};
    addStatus: boolean = false;
    downloadStatus: boolean = false;
    error: boolean = false;
    selectedProduct: string;
    products: string;
    noselect:boolean =true;
    no_prods: boolean;
    child_of:string;
    notin_alfresco: boolean = false;
    text1_changed: boolean = false;
    text2_changed: boolean = false;
    text3_changed: boolean = false;
    text4_changed: boolean = false;
    text1: string;
    text2: string;
    text3: string;
    text4: string;
    constructor(private loginservice: OAOadminService, private router: Router) {
        this.myForm = new FormGroup({
            'jsonEdit': new FormControl({ value: "", disable: true })
        });
        this.getDataFromLoacal();
        this.getProducts();

    }

    getProductsContent(prod_name: string) {
        console.log("prod_name");
        console.log(prod_name);
        //console.log(e.target.selected);
        this.selectedProduct = prod_name;
        if(prod_name== "")
        {
            this.noselect=true;
        }
        else{
            this.noselect= false;        
        jQuery.each(this.products,(index,value)=>{
            if(value.product_name == prod_name)
            {
                this.child_of= value.child_of;
            }
        })
        //console.log(this.jsonEdit[this.selectedProduct]);
        if (this.jsonEdit != undefined ) {
            console.log("some contents are there");
            if (this.jsonEdit[this.selectedProduct] != undefined && this.jsonEdit[this.selectedProduct] != "undefined") {
                console.log("found product also");
                if (this.jsonEdit[this.selectedProduct].noAlfresco != undefined) {

                    this.notin_alfresco = true;
                }
                else {
                    this.notin_alfresco = false;
                }

                if (this.jsonEdit[this.selectedProduct].text1 != undefined){
                    console.log("inside if text1",this.jsonEdit[this.selectedProduct].text1);
                    this.text1 = this.jsonEdit[this.selectedProduct].text1;
                }
                else
                    this.text1 = "This is a dummy text.Please provide the description for this field herr or describe in Alfresco";
                if (this.jsonEdit[this.selectedProduct].text2 != undefined)
                    this.text2 = this.jsonEdit[this.selectedProduct].text2;
                else
                    this.text2 = "This is a dummy text.Please provide the description for this field herr or describe in Alfresco";
                if (this.jsonEdit[this.selectedProduct].text3 != undefined)
                    this.text3 = this.jsonEdit[this.selectedProduct].text3;
                else
                    this.text3 = "This is a dummy text.Please provide the description for this field herr or describe in Alfresco";
                if (this.jsonEdit[this.selectedProduct].text4 != undefined)
                    this.text4 = this.jsonEdit[this.selectedProduct].text4;
                else
                    this.text4 = "This is a dummy text.Please provide the description for this field herr or describe in Alfresco";
            }
            else {
                console.log('product not found doc');
                this.notin_alfresco = true;
                this.text1 = "This is a dummy text.Please provide the description here or Describe the product in Alfresco";
                this.text2 = "This is a dummy text.Please provide the description here or Describe the product in Alfresco";
                this.text3 = "This is a dummy text.Please provide the description here or Describe the product in Alfresco";
                this.text4 = "This is a dummy text.Please provide the description here or Describe the product in Alfresco";

            }
        }
        else {
            console.log("not  contents found");
            this.notin_alfresco = true;
            this.text1 = "This is a dummy text.Please provide the description here or Describe the product in Alfresco";
            this.text2 = "This is a dummy text.Please provide the description here or Describe the product in Alfresco";
            this.text3 = "This is a dummy text.Please provide the description here or Describe the product in Alfresco";
            this.text4 = "This is a dummy text.Please provide the description here or Describe the product in Alfresco";
        }
        }

        //console.log(this.jsonEdit[this.selectedProduct].text1);
    }

    getProducts() {

        // return new Promise((resolve, reject) => {
        this.loginservice.getProduct().subscribe(
            (subproducts: any) => {
                if (subproducts.length < 1) {
                    this.no_prods = true;
                }
                else {
                    var c = 0;
                    this.no_prods = false;
                    this.products = subproducts;
                    console.log("All Products")
                    console.log(this.products);
                }
            });
    }
    getDataFromLoacal() {
        this.loginservice.getLocalContents()
            .subscribe((data) => {
                console.log(data);
                this.text1_changed = false;
                this.text2_changed = false;
                this.text3_changed = false;
                this.text4_changed = false;

                //this.jsonEdit = JSON.stringify(data.result, undefined, 4);
                this.jsonEdit = data.result;
            });
    }
    getDataFromCMIS() {
        this.loginservice.getContents()
            .subscribe((data) => {
                console.log(data);
                this.text1_changed = false;
                this.text2_changed = false;
                this.text3_changed = false;
                this.text4_changed = false;
                this.jsonEdit = data.result;
                console.log(this.selectedProduct);
                this.getProductsContent(this.selectedProduct);
                if (data.success == true) {
                    this.downloadStatus = true;
                    //this.getDataFromLoacal();
                    setTimeout(() => {
                        this.downloadStatus = false;
                    }, 3000);
                } else {
                    this.error = true;
                    setTimeout(() => {
                        this.error = false;
                    }, 3000);
                }
            });
    }
    saveData() {
        var text1 = this.text1;
        var text2 = this.text2;
        var text3 = this.text3;
        var text4 = this.text4;
        console.log(text1, text2, text3, text4);
        //console.log(this.jsonEdit[this.selectedProduct]);
        if (this.jsonEdit != undefined ) {
            if (this.jsonEdit[this.selectedProduct] != undefined && this.jsonEdit[this.selectedProduct] != "undefined") {
                this.jsonEdit[this.selectedProduct].text1 = text1;
                this.jsonEdit[this.selectedProduct].text2 = text2;
                this.jsonEdit[this.selectedProduct].text3 = text3;
                this.jsonEdit[this.selectedProduct].text4 = text4;
                this.jsonEdit[this.selectedProduct].noAlfresco = true;
                console.log("this.jsonEdit", this.jsonEdit);
                this.editedData = this.jsonEdit;
            }
            else {
                console.log("in else 11");
                var y = this.selectedProduct;
                var x = {};
                var z = {};
                x[y] = z;
                z["text1"] = text1;
                z["text2"] = text2;
                z["text3"] = text3;
                z["text4"] = text4;
                z["noAlfresco"] = true;


                console.log(x);
                this.jsonEdit[y] = z;
                console.log(this.jsonEdit);
                this.editedData = this.jsonEdit;

            }

        }
        else {
            console.log("in else  332");
            var y = this.selectedProduct;
            var x = {};
            var z = {};
            x[y] = z;
            z["text1"] = text1;
            z["text2"] = text2;
            z["text3"] = text3;
            z["text4"] = text4;
            z["noAlfresco"] = true;
            this.jsonEdit = {};
            this.editedData = {};

            console.log(x);
            this.jsonEdit[y] = z;
            console.log(this.jsonEdit);
            this.editedData = this.jsonEdit;

        }
        //JSON.parse(formdata.jsonEdit)
        this.loginservice.setLocalContent(this.editedData)
            .subscribe((data) => {
                console.log(data);
                if (data.success == true) {
                    this.addStatus = true;
                    setTimeout(() => {
                        this.addStatus = false;
                    }, 3000);
                    this.notin_alfresco=true;
                    this.getDataFromLoacal();
                } else {
                    this.error = true;
                    setTimeout(() => {
                        this.error = false;
                    }, 3000);
                }
            });
    }
    confirmation() {
        this.getDataFromCMIS();
        jQuery('#download_modal').modal('hide');

    }
    openConfModal() {
        jQuery('#download_modal').modal('show');
    }
    ngAfterViewInit() {
        var text1 = jQuery("#text1");
        //jQuery.trim(jQuery("#text1").text())
        
        var text2 = jQuery("#text2");
       
        var text3 = jQuery("#text3");
        
        var text4 = jQuery("#text4");
       
        text1.on("change keyup paste", () => {
            var text1_value = jQuery.trim(text1.val());
            console.log('label',this.text1);
                console.log('label2',text1_value);
                //this.text1_changed = true;
            if (this.jsonEdit[this.selectedProduct].text1!== text1_value) {
                
                console.log("text1 changed");
                this.text1_changed = true;
            }
            else{
                console.log("same as before in text1");
                this.text1_changed =false;
            }
        });
        text2.on("change keyup paste", () => {
             var text2_value = jQuery.trim(text2.val());
            // this.text1_changed = true;
            if (this.jsonEdit[this.selectedProduct].text2 != text2_value) {
                console.log("text2 changed");
                this.text2_changed = true;
            }
             else{
                  console.log("same as before in text2");
                this.text2_changed =false;
            }
        });
        text3.on("change keyup paste", () => {
            var text3_value = jQuery.trim(text3.val());
           // this.text1_changed = true;
            if (this.jsonEdit[this.selectedProduct].text3 != text3_value) {
                console.log("text3 changed")
                this.text3_changed = true;
            }
             else{
                  console.log("same as before in text3");
                this.text3_changed =false;
            }
        });
        text4.on("change keyup paste", () => {
             var text4_value = jQuery.trim(text4.val());
            // this.text1_changed = true;

            if (this.jsonEdit[this.selectedProduct].text4 != text4_value) {
                console.log("text4 changed")
                this.text4_changed = true;
            }
             else{
                  console.log("same as before in text4");
                this.text4_changed =false;
            }
        });


    }

}