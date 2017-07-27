import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OAOadminService } from "../../../services/OAOadmin.service";
import { ProductsTypeInterface } from "../../../interfaces/productType.interface";
@Component({
    templateUrl: './integration.component.html',

})
export class Integrations {
    public openingMode: string;
    public RPAflag: boolean;
    public APIflag: boolean;
    public pushflag: boolean=false;
    private products_v: ProductsTypeInterface[];
    addOns: ProductsTypeInterface[] = [];
    constructor(private service: OAOadminService) {
        this.openingMode = 'NOI';

        new Promise((resolve, reject) => {
            this.service.getProductTypeAll().subscribe(
                (products: any) => {
                    this.products_v = products;
                    console.log("Product types: ", this.products_v);
                    resolve("done");
                }

            )
        }).then((e) => {
            console.log(e);
            console.log(this.products_v);
            for (var i = 0; i < (this.products_v).length; i++) {

                if (this.products_v[i].category == 'add-on') {
                    this.addOns.push(this.products_v[i]);
                }

            }
            for (i = 0; i < (this.addOns).length; i++) {
                if (this.addOns[i].product_type_code == 'RPA') {
                    console.log("RPAflag", this.RPAflag);
                    this.RPAflag = true;
                    console.log("RPAflag", this.RPAflag);
                }
                if (this.addOns[i].product_type_code == 'API') {
                    console.log("APIflag", this.APIflag);
                    this.APIflag = true;
                    console.log("APIflag", this.APIflag);
                }
            }
            console.log(this.addOns[0].product_type_code);
        });


        this.service.GetPropertyDetails('GENERIC_PROP', 'CORE_ACCOUNT_OPENING_MODE')
            .subscribe(
            data => {
                this.openingMode = data.result[0].property_value;
                console.log("current mode", this.openingMode);
            }
            );


    }

    ChangeAccMode() {
        console.log(this.openingMode)
        this.service.updateProprtyDetails('GENERIC_PROP', 'CORE_ACCOUNT_OPENING_MODE', this.openingMode)
            .subscribe(
            data => {
                console.log(data);
                console.log(data.result);
                console.log(data.result.property_value);
                this.openingMode = data.result.property_value;
                console.log("current mode", this.openingMode);
                this.pushflag = true;
                console.log(this.pushflag);
                setTimeout(() => {
                    this.pushflag = false;
                }, 4000);
            }

            );
    }
}