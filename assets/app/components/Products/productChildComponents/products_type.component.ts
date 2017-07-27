import { Component,OnInit,AfterViewInit } from '@angular/core';
import {PaginatePipe,  PaginationService} from 'ng2-pagination';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable,Subscription } from "rxjs";
import { Router } from "@angular/router";
import { OAOadminService} from "../../../services/OAOadmin.service";
import { ProductsTypeInterface} from "../../../interfaces/productType.interface";
declare var jQuery:any;
declare var moment: any;

@Component({
    templateUrl:'./productsTypedisplaycomponent.component.html',
    
})

export class productsDisplayComponent {
    private products_v: ProductsTypeInterface[];
    editprod = new ProductsTypeInterface('', '')
    isLoading: boolean = false;
    productTypes: ProductsTypeInterface[] = [];
    uxThemes: ProductsTypeInterface[] = [];
    addOns: ProductsTypeInterface[] = [];
    productTypeLength: number;
    selectedProductType: any;
    currentTheme: any;
    constructor(private loginservice: OAOadminService, private router: Router) {
        this.selectedProductType = "";
        this.currentTheme = "";

        new Promise((resolve, reject) => {
            this.loginservice.getProductTypeAll().subscribe(
                (products: any) => {
                    this.products_v = products;
                    this.productTypeLength = this.products_v.length;
                   // console.log("Product types: ", this.products_v);
                    resolve("done");
                }

            )
        }).then((e) => {
         //   console.log(e);
           // console.log(this.products_v);
            for (var i = 0; i < (this.products_v).length; i++) {
                if (this.products_v[i].category == 'product') {
                    this.productTypes.push(this.products_v[i]);
                }
                if (this.products_v[i].category == 'add-on') {
                    this.addOns.push(this.products_v[i]);
                }
                if (this.products_v[i].category == 'ux-theme') {
                    this.uxThemes.push(this.products_v[i]);
                }

            }

            this.loginservice.GetPropertyDetails('GENERIC_PROP', 'CURRENT_UXTHEME')
                .subscribe(
                data => {

                    this.currentTheme = data.result[0].property_value;

                }
                );
            if (this.uxThemes.length != 0) {

                this.uxThemes.sort((a, b) => {

                    if (a.product_type_name != "EmpowerDefault") {

                        return 1;
                    }
                    return -1;
                });

            }


        });

        //this.showSlides(this.slideIndex);


    }
    slideIndex: number = 1;
    openmodal() {
        document.getElementById('mymodal-imagegallery').style.display = "block";
    }
    closeimagegallery() {
        document.getElementById('mymodal-imagegallery').style.display = "none";
    }

    plusSlides(n) {
        this.showSlides(this.slideIndex += n);
    }

    currentSlide(n) {
        this.showSlides(this.slideIndex = n);
    }
    showSlides(n) {
        var i;
        var slides = $(".mySlides-imagegallery");
        var dots = $(".demo-imagegallery");
        var captionText = $("#caption");
        //console.log("Lwngth: ", slides.length)
        if (n > slides.length) { this.slideIndex = 1 }
        if (n < 1) { this.slideIndex = slides.length }
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        slides[this.slideIndex - 1].style.display = 'block';

        // captionText.innerHTML = dots[this.slideIndex-1].alt;
    }
    getCurrentTheme() {
       // console.log("call hua");
        this.loginservice.GetPropertyDetails('GENERIC_PROP', 'CURRENT_UXTHEME')
            .subscribe(
            data => {
                console.log("data: ", data);
                this.currentTheme = data.result[0].property_value;
                console.log("current theme", this.currentTheme);
            }
            );
    }
    ngAfterViewInit() {
        jQuery("body").on("click", "#myImg", function () {
      //      console.log("clicked image");

            jQuery('.modal1').css("display", "block");

            jQuery("#img01").attr("src", this.src);

        });

        jQuery("body").on("click", ".close2", function () {

            jQuery('.modal1').css("display", "none");
        });

jQuery(function () {
  jQuery('[data-toggle="tooltip"]').tooltip()
})




    }
    addProd(formRecord: ProductsTypeInterface) {
        this.isLoading = true
        this.loginservice.AddProduct(formRecord).subscribe(
            data => {
               // console.log(data);
                this.loginservice.getProductAll().subscribe(
                    (products: any) => {
                        this.products_v = products;
                     //   console.log(this.products_v);
                        this.isLoading = false;
                        jQuery('#editProd_modal').modal('hide');
                    }
                )
            }
        )
    }
    fetchAppn(Prod_id: string) {
     //   console.log(Prod_id)
        this.loginservice.getProductDetails(Prod_id).subscribe(
            (editprod_v: ProductsTypeInterface) => {
                this.editprod = editprod_v[0];
              //  console.log(this.editprod);
                jQuery('#editProd_modal').modal('show');
            });
    }
}
