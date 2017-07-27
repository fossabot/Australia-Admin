import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OAOadminService } from "../../../services/OAOadmin.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AddFieldInterface } from "../../../interfaces/addfield.interface";
@Component({
    templateUrl: './addnewField.component.html'

})
export class AddNewField {
    products: string;
    sectionList: any;
    sectionArray: any[];
    myForm: FormGroup;
    sectionfilter: any[] = [];
    productType: string;
    section: string;
    prodtype_name: string;
    public model = new AddFieldInterface('', '', '', '', '', '', '');
    pageList: any[] = [];
    items: any[] = [];
    editflag1: boolean[] = [];
    editflag2: boolean[] = [];
    disableflag1: boolean[] = [];
    disableflag2: boolean[] = [];
    public noData: any;
    constructor(private service: OAOadminService, private chRef: ChangeDetectorRef) {

        this.productType = '0';
        //this.chRef.detectChanges();
        this.section = '0';

        this.sectionfilter = [];
        this.service.getProductType().subscribe(
            (subproducts: any) => {
                this.products = subproducts;
                console.log("All Products")
                console.log(this.products);

            });
        this.service.getSectionConfig().subscribe(
            (data: any) => {
                this.sectionList = data.data;
                console.log("sectionList", this.sectionList)

            });
        this.service.getFreeFieldDetails().subscribe(
            (data: any) => {
                console.log(data.Result);
                console.log(data.Result.SAV);
                console.log(data.Result[0]);
                console.log(data.Result[0].SAV);
                console.log(data.Result[0]['SAV']);
                this.sectionArray = data.Result[0];
                console.log("sectionarray", this.sectionArray);
            }
        )

    }
    getProductsContent(prodtype_name: string) {
        console.log("prodtype_name");
        this.productType = prodtype_name;
        this.chRef.detectChanges();
        this.section = '0';
        console.log(prodtype_name);
        this.prodtype_name = prodtype_name;
        this.sectionfilter = [];
        console.log(this.sectionList.number_of_sections[this.prodtype_name])
        for (var i = 1; i <= this.sectionList.number_of_sections[this.prodtype_name]; i++) {
            var a = "section_" + i;
            console.log(this.sectionList[this.prodtype_name][0][a].name);
            this.sectionfilter.push({ "name": this.sectionList[this.prodtype_name][0][a].name, "value": a });

        }
        console.log("sec", this.sectionfilter)
    }
    ngOnInit() {
        this.myForm = new FormGroup({
            'labelName': new FormControl("", Validators.required),
            'Placeholder': new FormControl({ value: "", disable: false }, Validators.required),
            'InputType': new FormControl
        });
    }
    getProductsection(section: string) {
        this.section = section;
        this.chRef.detectChanges();
        this.pageList = [];
        console.log(section);
        try {
            if (this.section != '0') {
                console.log(this.sectionArray);
                console.log(this.sectionArray[this.prodtype_name].section)
                console.log(this.sectionArray[this.prodtype_name][0])
                console.log(this.sectionArray[this.prodtype_name][0][section][0]);
                console.log("length", this.sectionArray[this.prodtype_name][0][section][0].length);
                //this.pageList=this.sectionArray[this.prodtype_name][0][section][0];
                var i = 0;
                for (var item in this.sectionArray[this.prodtype_name][0][section][0]) {

                    console.log("item", this.sectionArray[this.prodtype_name][0][section][0][item]);
                    if (item != "_id") {
                        this.pageList.push({ "key": item, "freetext1": this.sectionArray[this.prodtype_name][0][section][0][item][0]['freetext1'], "freetext2": this.sectionArray[this.prodtype_name][0][section][0][item][0]['freetext2'] });
                        console.log("freetext", this.sectionArray[this.prodtype_name][0][section][0][item][0]['freetext1'][0])
                        this.editflag1[i] = false;
                        this.editflag2[i] = false;
                        this.disableflag1[i] = false;
                        this.disableflag2[i] = false;
                        console.log(i);
                        i++;
                    }

                }
            }
            this.noData = this.pageList.length;
        } catch (e) {
            this.noData = this.pageList.length;
            console.log(e);
        }
        console.log("pagelist", this.pageList);
        console.log("pagelist length", this.pageList.length);
    }


    EditFeature(i: any, flag: string) {
        console.log("Edit i and flag", i, flag);
        //$("interest-"+i+"").removeClass("edit_input_feature")
        if (flag == 'editflag1') {
            console.log("editfalg1-");
            this.editflag1[i] = true;
            this.disableflag1[i] = true;
        } else {
            this.editflag2[i] = true;
            this.disableflag2[i] = true;
        }
    }
    cancel(i) {

        this.editflag1[i] = false;
        this.disableflag1[i] = false;
        this.editflag2[i] = false;
        this.disableflag2[i] = false;
    }
    saveFeatures(i: number, flag: string, label: string, placeholder: string, status: string, freetext: string, section_name: string) {
        console.log("i", i);
        console.log("label", label);
        console.log("placeholder", placeholder);
        console.log("status", status);
        if (flag == 'editflag1') {
            console.log("editfalg1-");
            this.editflag1[i] = false;
            this.disableflag1[i] = false;
        } else {
            this.editflag2[i] = false;
            this.disableflag2[i] = false;
        }
        this.model.label = label;
        this.model.placeholder = placeholder;
        this.model.status = status;
        this.model.section = this.section;
        this.model.section_name = section_name;
        this.model.freetext = freetext;
        this.model.product_type = this.productType;

        console.log(this.model);
        this.service.AddField(this.model).subscribe(
            data => {
                console.log(data);
            }
        )

    }

}