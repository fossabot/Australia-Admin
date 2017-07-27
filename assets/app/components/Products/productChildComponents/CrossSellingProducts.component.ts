/*import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PaginatePipe, PaginationService } from 'ng2-pagination';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { OAOadminService } from "../../../services/OAOadmin.service";
import { CrossSellingProductsInterface } from "../../../interfaces/crosssellingproducts.interface";

declare var jQuery: any;
declare var moment: any;

@Component({
    templateUrl: './crosssellingproducts.component.html',

})

export class CrossSellingProductsDisplayComponent {
    private csproducts_v: CrossSellingProductsInterface;
    csaddprod = new CrossSellingProductsInterface('', '', '');
    cseditprod = new CrossSellingProductsInterface('', '', '');
    csLinkprod = new CrossSellingProductsInterface('', '', '');
    isLoading: boolean = false;
    public source_arr: any[] = [];
    public destination_arr: string[] = [];
    public linked_arr: string[] = [];
    keepSorted = true;
	key:string;
	display:string;
	filter = false;
	source:Array<any>;
	confirmed:Array<any>;
    constructor(private loginservice: OAOadminService, private router: Router) {
        /*this.loginservice.getCrossSellingProduct().subscribe(
            (csproducts: CrossSellingProductsInterface) => {
                this.csproducts_v = csproducts;
            }
        );

        //prepare array of sub products
        this.loginservice.getSubProduct().subscribe(
            data => {
                console.log("in ssss")
                console.log(data);
                var count = Object.keys(data).length;
                for (var i = 0; i < count; i++) {
                    this.source_arr.push({
                        subproduct_name: data[i].subproduct_name,
                        subproduct_id:data[i].subproduct_id
                    })
                     console.log(this.source_arr);
                }
                this.useLinked()
                console.log(this.source_arr);
                console.log("data");
                
            }
        );

       
    }
     private useLinked() {
		this.key = 'subproduct_id';
		this.display = 'subproduct_name';
		this.keepSorted = true;
		this.source = this.source_arr;
		this.confirmed = this.destination_arr;
	}
    addCrossellingProd(formRecord: CrossSellingProductsInterface) {
        this.isLoading = true
        this.loginservice.AddCrossSellingProduct(formRecord).subscribe(
            data => {
                console.log(data);
                this.loginservice.getCrossSellingProduct().subscribe(
                    (csproducts: CrossSellingProductsInterface) => {
                        this.csproducts_v = csproducts;
                        this.isLoading = false
                        jQuery('#createCSProd_modal').modal('hide');
                        jQuery('#editCSProd_modal').modal('hide');
                    }
                )
            }
        )
    }
    fetchAppn(CsProd_id: string) {
        this.loginservice.getCrossSellingProductDetails(CsProd_id).subscribe(
            (cseditprod_v: CrossSellingProductsInterface) => {
                this.cseditprod = cseditprod_v[0];
                console.log(this.cseditprod);
                jQuery('#editCSProd_modal').modal('show');
            });
    }
   
   
}
*/