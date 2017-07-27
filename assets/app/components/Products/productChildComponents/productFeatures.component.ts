import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OAOadminService } from "../../../services/OAOadmin.service";
import { ProductsTypeInterface } from "../../../interfaces/productType.interface";
import { AppConstants } from "../../../AppConstants";
@Component({
    templateUrl: './productFeatures.component.html',

})
export class Features {

    productTypes: ProductsTypeInterface[];
    noselect = true;
    no_prods = false;
    products: any;
    selectedProductType: any;
    featureConfig: any;
    features: any;
    edit: any = [];
    hidebutton: boolean = false;
    editflag: boolean[] = [];
    disableflag: boolean[] = [];
    productTypeCodeNamePair: Map<String, String> = new Map<String, String>();
    allProducts: any = [];
    const = new AppConstants();
    constructor(private loginservice: OAOadminService) {

        this.loginservice.getProductType().subscribe(

            (productTypes: any) => {
                console.log(productTypes);
                this.productTypes = productTypes;
                console.log("Product types product component m: ", this.productTypes);
                for (var i = 0; i < this.productTypes.length; i++) {
                    this.productTypeCodeNamePair.set(this.productTypes[i].product_type_name, this.productTypes[i].product_type_code)

                }

            })
        this.loginservice.getProduct().subscribe(
            (subproducts: any) => {
                if (subproducts.length < 1) {
                    this.no_prods = true;
                }
                else {
                    var c = 0;
                    this.no_prods = false;
                    this.products = subproducts;
                    if(this.products.length >=1)
                    {

                         this.no_prods=false;
                    for (var i = 0; i < this.products.length; i++) {
                        this.disableflag[i] = false;
                        this.editflag[i] = false;
                    }
                    }
                    else
                    {
                        this.no_prods=true;
                    }
                    console.log("All Products")
                    console.log(this.products);
                }
            });

        this.loginservice.getFeatures().subscribe(
            (result: any) => {
                console.log("result in vconfig file", result.data);
                this.featureConfig = result.data;
            }
        )


    }//Constructor ends
    EditFeature(i: any, code: string) {
        console.log("Edit i and code", i, code);
        this.hidebutton = true;
        //$("interest-"+i+"").removeClass("edit_input_feature")
        for (var j = 0; j < this.products.length; j++) {
        this.disableflag[j] = true;
            if (j == i) {
                this.editflag[j] = true;
            }
        }
    }
    cancel() {
        this.hidebutton = false;
        for (var j = 0; j < this.products.length; j++) {
        this.editflag[j] = false;
            this.disableflag[j] = false;
        }
    }
    saveFeatures(i: number, prod_code: string) {
        console.log("saving in prodcutwcode", prod_code);
       
        console.log("min age", $("#min_age-" + i + "").val())
        console.log("#min_age-" + i + "");
        var sendObj = {
            product_code: prod_code,
            min_age: $("#min_age-" + i + "").val(),
            max_age: $("#max_age-" + i + "").val(),
            interest_rate: $("#interest_rate-" + i + "").val(),
            fixed_interest_rate: $("#fixed_interest_rate-" + i + "").val(),
            variable_interest_rate: $("#variable_interest_rate-" + i + "").val(),
            bonus_interest: $("#bonus_interest-" + i + "").val(),
            min_deposit: $("#min_deposit-" + i + "").val(),
            keeping_fees: $("#keeping_fees-" + i + "").val(),
            transaction_fees: $("#transaction_fees-" + i + "").val(),
            comparison_rate: $("#comparison_rate-" + i + "").val(),
            establishment_fees: $("#establishment_fees-" + i + "").val(),
            loan_service_fees: $("#loan_service_fees-" + i + "").val(),
            split_loan: $("#split_loan-" + i + "").val(),
            min_loan_amount: $("#min_loan_amount-" + i + "").val(),
            max_loan_amount: $("#max_loan_amount-" + i + "").val(),
            min_loan_term: $("#min_loan_term-" + i + "").val(),
            max_loan_term: $("#max_loan_term-" + i + "").val(),
            fees_url:$("#fees_url-" + i + "").val()
        }
        console.log("sending ibject", sendObj);
        console.log(JSON.stringify(sendObj));
        this.loginservice.updateFeatures(sendObj)
            .subscribe(
            (result: any) => {
                console.log("result is in subscribe", result);
                this.editflag[i] = false;
                for (var j = 0; j < this.products.length; j++) {
                this.disableflag[j] = false;
                }
            }
            )
    }
    getProductsContent(e: any) {
    this.allProducts = [];
        console.log(e);
        var x: any;
        x = this.productTypeCodeNamePair.get(e);
        console.log("xis", x);
        //console.log("featute",this.featureConfig);
        // console.log("fateu xx",this.featureConfig[x]);
        if (this.featureConfig[x] != undefined) {
            this.features = this.featureConfig[x]
            console.log("printign", this.features);
        }
        this.noselect = false;

        this.products.forEach((element, i) => {
            this.disableflag[i] = false;
            this.editflag[i] = false;
            if (element.child_of == x) {
                console.log("ssas all prods");
                this.allProducts.push(element);

            }

        })
        if(this.allProducts.length == 0)
        this.no_prods=true;
        else
        this.no_prods=false;
        console.log("this all pros", this.allProducts);

    }
}