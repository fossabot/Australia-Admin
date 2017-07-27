import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PaginatePipe, PaginationService } from 'ng2-pagination';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { OAOadminService } from "../../../services/OAOadmin.service";
import { Router } from "@angular/router";
import { ProductsInterface } from "../../../interfaces/product.interface";
import { ProductsTypeInterface } from "../../../interfaces/productType.interface";
import { AppConstants } from "../../../AppConstants";

declare var jQuery: any;
declare var moment: any;

@Component({
    templateUrl: './productsdisplaycomponent.component.html',

})

export class SubProductsDisplayComponent implements OnInit {
    private crossSellingProducts: ProductsInterface[];
    private upSellingProducts: ProductsInterface[];
    myForm: FormGroup;
    myAddOnFrom: FormGroup;
    campaign_code: String;
    campaign_source: String;
    campaign_url:String;
    campaign_prod_id:String;
    isCopied: boolean=false;
    add_campaign:Boolean = true;
    private childOf: String;
    cross_sell_labelname:String;
    up_sell_labelname : String;
    campaign_labelname : String = "Enter Campaign ID";
    private deletedSuccessfully: boolean = false;
    private isAddMode: boolean = true;
    private add_prod = new ProductsInterface('', '', '', '', '');
    public add_addon = new ProductsInterface('', '', '', '', '');
    flag: boolean = false;
    private del_prod = new ProductsInterface('', '', '', '', '');
    isLoading: boolean = false;
    checked_cross_sell: boolean = false;
    checked_up_sell: boolean = false;
    new_crosssell: boolean = true;
    new_upsell: boolean = true;
    configMsg:any;
    // pro_1:any;
    //promise:any;
    no_prods : boolean =false;
    allAddons= new Array <ProductsInterface>();
    const = new AppConstants();
    noCRS: boolean = false;
    noUPS: boolean = false;
    noCRS_length: boolean = true;
    noUPS_length: boolean = true;
    products: ProductsInterface[];
    producttype_all: ProductsTypeInterface[];
    productTypes: ProductsTypeInterface[];
    productTypeCodeNamePair: Map<String, String> = new Map<String, String>();
    crossSellingProductCodeNamePair: Map<String, String> = new Map<String, String>();
    crossSellingDisplayTextPair: Map<String, String> = new Map<String, String>();
    crossSellingNameIDPair: Map<String, String> = new Map<String, String>();
    upSellingProductCodeNamePair: Map<String, String> = new Map<String, String>();
    upSellingDisplayTextPair: Map<String, String> = new Map<String, String>();
    upSellingNameIDPair: Map<String, String> = new Map<String, String>();
    constructor(private loginservice: OAOadminService, private router: Router) {
        console.log(this.const.CROSSSELL)
        this.loginservice.getConfig().subscribe((data) => {
			console.log("in subscribe"); 
		this.configMsg = data.data; 
        console.log("confif file",this.configMsg.url.clientUrl);
        });
        this.loginservice.getProductTypeAll().subscribe(
            (products_all: any) => {
                console.log(products_all);
                this.producttype_all = products_all;
                this.producttype_all.forEach((entry) => {
                    if (entry.category == "add-on") {
                        if (entry.product_type_code == this.const.CROSSSELL) {
                            console.log("Foun crossel");
                            this.noCRS = true;
                        }
                        else if (entry.product_type_code == this.const.UPSELL) {
                            console.log("Foun UPsell");
                            this.noUPS = true;
                        }
                    }
                });
                // this.productTypeLength=this.products_v.length;
                // console.log("Product types: ", this.products_v);
                //  
            }

        )


        this.getProductTypes().then((e) =>
            (this.getCrossSellingProducts()))
            .then((e) => (this.getUpSellingProducts()))
            .then((e) => (this.getProducts()))
            .then((e) => {
                console.log(e);
                this.flag = true;
            });




        // this.promise.then((e)=>{
        //    console.log(e);

        // })
        //}).then((e1)=>{
        //          console.log(e1);
        //          this.flag = true;
        //    });;
    }

    getProductTypes() {
        console.log("in product types");
        var c = 0;
        return new Promise((resolve, reject) => {


            this.loginservice.getProductType().subscribe(
                (productTypes: any) => {
                    console.log(productTypes);
                    this.productTypes = productTypes;
                    console.log("Product types product component m: ", this.productTypes);
                    for (var i = 0; i < this.productTypes.length; i++) {
                        this.productTypeCodeNamePair.set(this.productTypes[i].product_type_code, this.productTypes[i].product_type_name)
                        c++;
                    }
                    if (c == this.productTypes.length)
                        resolve("done producttypes");
                })

        })
        //if(c == this.productTypes.length )
        // return promise;

    }

    validateProductCode() {
        if (this.add_prod.product_code.match(/^[a-zA-Z0-9]{3}$/)) {
            return true;
        }
        return false;
    }
    clearData() {
       // console.log("First", this.products);
        this.isAddMode = true;
        jQuery('.product_code_label').addClass('control-label');
        jQuery('.product_code_label').removeClass('label-disable');
        this.add_prod.dummy_crosssell_name = "";
        this.add_prod.dummy_upsell_name = "";
        this.myForm.get('display_text').enable();
        this.add_prod.core_identifier='';
        // $('#disable_display_text_label').css('display', 'none'); 
        this.myForm.get('display_text_upsell').enable();
        // $('#disable_display_text_label').css('display', 'none'); 
        //this.myForm.reset();
      //  console.log("Second", this.products);
        // this.myForm.get('product_code').enable();
        this.myForm.get('child_of').enable();
        this.myAddOnFrom.get('child_of').enable();
        jQuery("#cross_sell_id_dummy").val("");
        this.checked_cross_sell = false;
        this.checked_up_sell = false;
        $('#check_cross_sell').prop('checked', false);
        $('#check_up_sell').prop('checked', false);
        this.add_addon = new ProductsInterface('', '', '', '', '', '');
        this.add_prod.product_code = "";
        this.add_prod.product_name = "";
        this.add_prod.linked_crossselling_product_name = "";
        this.add_prod.linked_upselling_product_name = "";
        this.add_prod.display_text = "";
        this.add_prod.display_text_upsell = "";
        this.add_prod.child_of = "";
    }

    /*disableProductType(child_of: String) {
        this.childOf = child_of;
        if (this.isAddMode == false) {
            return true;
        }
        return false;
    }
    disableProductCode(product_code:String){
        if(this.isAddMode==false){
        this.add_prod.product_code=product_code;
        return true;
        }
         return false;
    }

    disableAddOrEdit(){
        if(this.isAddMode){
            if(this.add_prod.product_code=='' || this.add_prod.product_code==null || this.add_prod.product_name=='' ||  this.add_prod.product_name==null || this.add_prod.child_of=='' || this.add_prod.child_of==null){
                return true;
            }
            if(this.add_prod.child_of=="CRS" && (this.add_prod.display_text=="" || this.add_prod.display_text==null)){
                return true;
            }
        }
        return false;
    }
*/
    getProducts() {
        var c = 0;
        return new Promise((resolve, reject) => {
            this.loginservice.getProduct().subscribe(
                (subproducts: any) => {
                    if(subproducts.length < 1){
                    this.no_prods = true;
                    resolve("No Products Found");    
                }
                    else{
                    var c = 0;
                    this.no_prods = false;
                    this.products = subproducts;
                   // console.log("Products: ", this.products);
                    for (var i = 0; i < this.products.length; i++) {
                        this.products[i].product_type_name = this.productTypeCodeNamePair.get(this.products[i].child_of);
                        this.products[i].linked_crossselling_product_name = this.crossSellingProductCodeNamePair.get(this.products[i].linked_crossselling_product);
                        this.products[i].linked_upselling_product_name = this.upSellingProductCodeNamePair.get(this.products[i].linked_upsell_product);
                        this.products[i].display_text = this.crossSellingDisplayTextPair.get(this.products[i].linked_crossselling_product);
                        this.products[i].display_text_upsell = this.upSellingDisplayTextPair.get(this.products[i].linked_upsell_product);
                        c++;
                    }
                   // console.log("All Products")
                   // console.log(this.products);
                    if (c == this.products.length)
                        resolve("done");
                            
                    }

                }
            );

        });

    }

    ngOnInit() {
        this.myForm = new FormGroup({
            'product_code': new FormControl("", Validators.required),
            'product_name': new FormControl({ value: "", disable: false }, Validators.required),
            'child_of': new FormControl({ value: null, disable: true }, Validators.required),
            'linked_crossselling_product': new FormControl({ value: null, disable: false }),
            'linked_upsell_product': new FormControl({ value: null, disable: false }),
            'verification_mode': new FormControl,
            "display_text": new FormControl({ value: "", disable: false }, Validators.required),
            'core_identifier':new FormControl("",Validators.required),
            'display_text_upsell': new FormControl({ value: "", disable: false }, Validators.required)
        });
        this.myAddOnFrom = new FormGroup({
            'product_code': new FormControl("", Validators.required),
            'product_name': new FormControl({ value: "", disable: false }, Validators.required),
            'child_of': new FormControl({ value: null, disable: true }, Validators.required),
            "display_text": new FormControl({ value: "", disable: false }, Validators.required),
            'display_text_upsell': new FormControl("", Validators.required)
        });


    }
    getUpSellingProducts() {
      //  console.log("inside upselling");
        var c = 0;
        return new Promise((resolve, reject) => {
            this.loginservice.getAllUpSellingProducts().subscribe(
                (upSellingProducts: any) => {
                    this.upSellingProducts = upSellingProducts;
                    console.log("up selling products: ", upSellingProducts);
                    if (this.upSellingProducts.length <= 0) {
                    //    console.log("NO Upselling");
                     this.up_sell_labelname = "Enter the Up Selling Product Name";
                        this.noUPS_length = false;
                    }
                    else {
                        this.noUPS_length = true;
                        this.up_sell_labelname = "Enter or Select from the Up Selling Products"
                    }
                    for (var i = 0; i < this.upSellingProducts.length; i++) {
                        this.allAddons.push(this.upSellingProducts[i]);
                        this.upSellingProductCodeNamePair.set(this.upSellingProducts[i].product_code, this.upSellingProducts[i].product_name);
                        this.upSellingDisplayTextPair.set(this.upSellingProducts[i].product_code, this.upSellingProducts[i].display_text_upsell)
                        this.upSellingNameIDPair.set(this.upSellingProducts[i].product_name, this.upSellingProducts[i].product_code)
                        c++;
                    }
                 //   console.log("Upsell displatext", this.upSellingDisplayTextPair);
                    if (c == this.upSellingProducts.length) {
                     //   console.log("all addons", this.allAddons);
                        resolve("done upselling");
                    }
                }

            )
        });


    }
    getCrossSellingProducts() {
        var c = 0;
        return new Promise((resolve, reject) => {


            this.loginservice.getAllCrossSellingProducts().subscribe(
                (crossSellingProducts: any) => {
                    this.crossSellingProducts = crossSellingProducts;
                     this.allAddons = [];
                  //  console.log("Cross selling products: " , crossSellingProducts);
                    if (this.crossSellingProducts.length <= 0)
                       { this.noCRS_length = false;
                       this.cross_sell_labelname = "Enter the Cross Selling Product Name";
                    }
                        
                    else {
                        this.noCRS_length = true;
                         this.cross_sell_labelname = "Enter or Select from the Cross Selling Products"
                    }
                    for (var i = 0; i < this.crossSellingProducts.length; i++) {
                         this.allAddons.push(this.crossSellingProducts[i]); 
                        this.crossSellingProductCodeNamePair.set(this.crossSellingProducts[i].product_code, this.crossSellingProducts[i].product_name);
                        this.crossSellingDisplayTextPair.set(this.crossSellingProducts[i].product_code, this.crossSellingProducts[i].display_text)
                        this.crossSellingNameIDPair.set(this.crossSellingProducts[i].product_name, this.crossSellingProducts[i].product_code)
                        c++;
                    }
                 //   console.log("CRosssell displatext", this.crossSellingDisplayTextPair);
                    if (c == this.crossSellingProducts.length) {
                        resolve("done crossseliing prods");
                        //this.allAddons = this.crossSellingProducts;
                    }
                }

            )
        });
        //if(c == this.crossSellingProducts.length)
        //return promise;

    }
    addAddOn(formRecord: ProductsInterface) {
        jQuery('#createAddon_modal').modal('hide');
        jQuery('.overlay').show();
        jQuery('#load').show();
        if (!this.isAddMode) {
            formRecord.child_of = this.add_addon.child_of;
            formRecord.product_code = this.add_addon.product_code;
        }
       // console.log("Form recrod in add-on is", JSON.stringify(formRecord));
        this.loginservice.Add_AddOn(formRecord).subscribe(
            data => {
                console.log("Added add-on data: " + JSON.stringify(data));
                this.getProductTypes().then((e) =>
                    (this.getCrossSellingProducts()))
                    .then((e) => (this.getUpSellingProducts()))
                    .then((e) => {
                        console.log(e);
                        this.flag = true;
                        jQuery('.overlay').hide();
                        jQuery('#load').hide();
                    });
                this.isLoading = false;
                if (this.isAddMode == false) {
                    this.isAddMode = true;
                }

            });
    }
    addProd(formRecord: ProductsInterface) {
        this.isLoading = true;
        jQuery('#createProd_modal').modal('hide');
        jQuery('.overlay').show();
        jQuery('#load').show();
        if (!this.isAddMode) {
            formRecord.child_of = this.add_prod.child_of;
            formRecord.product_code = this.add_prod.product_code;
        }
     //   console.log("Formrecotds: " + JSON.stringify(formRecord));
     //   console.log("child_of: " + formRecord.child_of);

        var promise = new Promise((resolve, reject) => {
            if (this.checked_cross_sell) {
           //     console.log("length of crossel1111", this.crossSellingProducts.length);
                if (this.crossSellingProducts.length > 0) {
                    var c = 0;
                    jQuery.each(this.crossSellingProducts, function (index, value) {
                        if (value.product_code == formRecord.linked_crossselling_product) {
                            formRecord.new_cross_sell = false;
                            resolve("1");
                        }
                        c++;
                    })
            //        console.log("length of crossel", this.crossSellingProducts.length, c);
                    if (c == this.crossSellingProducts.length) {
                        console.log("in c");
                        formRecord.new_cross_sell = true;
                        resolve("2");
                    }
                }
                else {
                    console.log("in else c");
                    formRecord.new_cross_sell = true;
                    resolve("2");
                }
            }
            else {
                formRecord.new_cross_sell = false;
                //console.log("No input for crossell");
                resolve("1");
            }
        }).then((e) => {
            console.log(e);
            if (e == "1")
                formRecord.new_cross_sell = false
            else
                formRecord.new_cross_sell = true


            return new Promise((resolve, reject) => {
                if (this.checked_up_sell) {
           //         console.log("linked upsell",formRecord.linked_upsell_product);
                    if (this.upSellingProducts.length > 0) {
                        var c = 0;
                        jQuery.each(this.upSellingProducts, function (index, value) {
                            if (value.product_code == formRecord.linked_upsell_product) {
                                formRecord.new_up_sell = false;
                                resolve("1");
                            }
                            c++;
                        })
                        if (c == this.upSellingProducts.length) {
                            formRecord.new_up_sell = true;
                            resolve("2");
                        }
                    }
                    else {
                        formRecord.new_up_sell = true;
                        resolve("2");
                    }
                }
                else {
                    formRecord.new_up_sell = false;
                    // console.log("No input for upsell");
                    resolve("1");
                }
            });
        }).then((e) => {
            console.log(e);
          //  console.log("chcking in then");
            if (e == "1")
                formRecord.new_up_sell = false
            else
                formRecord.new_up_sell = true

            // formRecord.new_cross_sell = this.new_crosssell;
            // formRecord.new_up_sell = this.new_upsell;
            if (!this.checked_cross_sell) {
                formRecord.linked_crossselling_product = "";
                formRecord.display_text = "";
            }
            if (!this.checked_up_sell) {
                formRecord.linked_upsell_product = "";
                formRecord.display_text_upsell = "";
            }
            //if(this.isAddMode==false){
            //formRecord.child_of=formRecord.product_type_name;
            //}
            /*  if(formRecord.child_of !="CRS" && formRecord.child_of !="UPS" ){
                  formRecord.display_text="";
                  formRecord.display_text_upsell="";
              }       
               if(formRecord.child_of=="CRS" || formRecord.child_of=="UPS" ){
                   formRecord.linked_crossselling_product="";
                   formRecord.linked_upsell_product="";
              }    */
           // console.log("form record in butoon", formRecord);
            this.loginservice.AddProduct(formRecord).subscribe(
                data => {
                    console.log("Add m data: " + JSON.stringify(data));
                    this.getProductTypes().then((e) =>
                        (this.getCrossSellingProducts()))
                        .then((e) => (this.getUpSellingProducts()))
                        .then((e) => (this.getProducts()))
                        .then((e) => {
                            console.log(e);
                            this.flag = true;
                            jQuery('.overlay').hide();
                            jQuery('#load').hide();
                        });
                    this.isLoading = false;
                    if (this.isAddMode == false) {
                        this.isAddMode = true;
                    }


                });
        })

    }

    removeCross_sell() {
        this.checked_cross_sell = !this.checked_cross_sell;
        if (this.isAddMode) {
            this.add_prod.linked_crossselling_product = "";
            this.add_prod.display_text = "";
        }

    }
    removeUp_sell() {
        this.checked_up_sell = !this.checked_up_sell;
        if (this.isAddMode) {
            this.add_prod.linked_upsell_product = "";
            this.add_prod.display_text_upsell = "";
        }

    }
    fetchAddOn(prod_id: string) {
        console.log("infetchAPP addon", prod_id)
        this.isAddMode = false;
        var x = this.allAddons;
        /**/ 
        jQuery.each(x,(index,value)=>{
             
               // this.add_addon = edit_prod_v[0];
               if(value.product_code == prod_id){
               //    console.log("edit addondetails", value);
                this.add_addon.product_code=value.product_code;
                this.add_addon.product_name = value.product_name;
                this.add_addon.dummy_addon_name=value.product_name;
                this.add_addon.child_of = value.child_of;
                if (value.display_text_upsell != "" && value.display_text_upsell != undefined)
                    this.add_addon.display_text = value.display_text_upsell;
                else
                    this.add_addon.display_text = value.display_text;   
               } 
        })
        // var x = this.products;
        /*this.loginservice.getProductDetails(prod_id).subscribe(
            (edit_prod_v: ProductsInterface) => {
                console.log("edit addondetails", edit_prod_v);
                this.add_addon = edit_prod_v[0];
                this.add_addon.product_code=edit_prod_v[0].product_code;
                this.add_addon.product_name = edit_prod_v[0].product_name;
                this.add_addon.dummy_addon_name=edit_prod_v[0].product_name;
                if (this.add_addon.display_text_upsell != "" && this.add_addon.display_text_upsell != undefined)
                    this.add_addon.display_text = this.add_addon.display_text_upsell;
                /*this.add_prod.product_type_name = this.productTypeCodeNamePair.get(this.add_prod.child_of);
                this.add_prod.linked_crossselling_product_name = this.crossSellingProductCodeNamePair.get(this.add_prod.linked_crossselling_product);
                 this.add_prod.linked_upselling_product_name = this.upSellingProductCodeNamePair.get(this.add_prod.linked_upsell_product);
                this.add_prod.display_text=this.crossSellingDisplayTextPair.get(this.add_prod.linked_crossselling_product);
                 this.add_prod.display_text_upsell=this.upSellingDisplayTextPair.get(this.add_prod.linked_upsell_product);
                console.log(this.add_prod);*/
            //});
        // this.myForm.get('product_code').disable();
        this.myAddOnFrom.get('child_of').disable();
        jQuery('.product_code_label').removeClass('control-label');
        jQuery('.product_code_label').addClass('label-disable');
        jQuery('#createAddon_modal').modal('show');
    }
    delAddOn(prod_id: string, prod_name: string) {
        console.log("Addon delete", prod_id, prod_name);
        //this.del_prod.product_name =prod_name 
        //this.del_prod.product_code = prod_id;
        return new Promise((resolve, reject) => {
            console.log("all profts in deladon", this.products);
            jQuery.each(this.products, (index, value) => {
                console.log("value is ", value);
                if (value.linked_crossselling_product == prod_id) {
                    console.log("Inside each", value);
                    console.log("Sorry we cant delete this CRosssell ");
                    this.del_prod.product_name = prod_name
                    this.del_prod.product_code = prod_id;
                    //jQuery('#cannot_del_modal').modal('show');
                    reject("Sorry we cant delete this crossell");
                    return false;



                }
                else if (value.linked_upsell_product == prod_id) {   //console.log("Inside each",value);

                    console.log("Sorry we cant delete this Upsell");
                    // this.del_prod = value ;
                    this.del_prod.product_name = prod_name
                    this.del_prod.product_code = prod_id;
                    //jQuery('#cannot_del_modal').modal('show');
                    reject("Sorry we cant delete this Upsell");
                    return false;


                }
                else if (index == (this.products.length) - 1) {
                    //this.del_prod= value ;
                    this.del_prod.product_name = prod_name
                    this.del_prod.product_code = prod_id;
                    console.log("Can be deleted");
                    resolve("can be deleted");
                    return false;

                }

            })
        }).then((e) => {
            console.log(e);

            // this.loginservice.getProductDetails(prod_id).subscribe(
            //    (product: ProductsInterface) => {
            //      this.del_prod = product[0];
            //     console.log("*****************" + this.del_prod.product_code);
            jQuery('#del_modal').modal('show');

            // });
        }).catch((e) => {
            //console.log(e);
            jQuery('#cannot_del_modal').modal('show');

        })
        //jQuery('#del_modal').modal('show');
    }
    fetchAppn(prod_id: string) {
        console.log("infetchAPP", prod_id)
        this.isAddMode = false;
        var x = this.products;
        this.checked_cross_sell = false;
        this.checked_up_sell = false;
        $('#check_cross_sell').prop('checked', false);
        
        $('#check_up_sell').prop('checked', false);
         this.myForm.get('display_text').enable();
         this.myForm.get('display_text_upsell').enable();
        /*  x.forEach((entry)=>{
               if(entry.product_code === prod_id)
              {
                  let y = entry
                  this.add_prod = y ;
                  console.log("Add PROD",this.add_prod);
                  //console.log("Add PROD",this.add_prod.product_code);
                  //return false;
              }
          })*///jQuery('#disable_display_text_label').removeClass('control-label');
        // jQuery('#disable_display_upselltext_label').addClass('label-disable');
        //console.log("fetchApp",this.products[0]);
         jQuery.each(x,(index,value1)=> {
            // console.log("in jquery each");
            // console.log(value);
            //console.log(index);
             //console.log("Product code is",value.product_code);
             if(value1.product_code === prod_id)
             {
                 //this.add_prod = value1 ;
                 console.log("Add PROD",value1);
              ////
                  if(value1.linked_crossselling_product != "" && value1.linked_crossselling_product != undefined) {
                    this.checked_cross_sell = true;
                    $('#check_cross_sell').prop('checked', true)
                    this.myForm.get('display_text').disable();
                    this.add_prod.linked_crossselling_product_name = value1.linked_crossselling_product;
                    setTimeout(()=> {
                         jQuery('#disable_display_text_label').removeClass('control-label');
                    jQuery('#disable_display_text_label').addClass('label-disable');   
                    }, 200);
                }
                if (value1.linked_upsell_product != "" && value1.linked_upsell_product != undefined) {
                    this.checked_up_sell = true;
                    $('#check_up_sell').prop('checked', true);
                    this.add_prod.linked_upselling_product_name = value1.linked_upsell_product;
                    this.myForm.get('display_text_upsell').disable();
                    setTimeout(function() {
                        jQuery('#disable_display_upselltext_label').removeClass('control-label');
                    jQuery('#disable_display_upselltext_label').addClass('label-disable');
                        
                    }, 200);    
                }
                this.add_prod.core_identifier=value1.core_identifier;
                this.add_prod.product_code = value1.product_code;
                this.add_prod.product_name = value1.product_name;
                this.add_prod.child_of = value1.child_of;
                this.add_prod.product_type_name = this.productTypeCodeNamePair.get(value1.child_of);
                this.add_prod.verification_mode= value1.verification_mode;
                this.add_prod.display_text = this.crossSellingDisplayTextPair.get(value1.linked_crossselling_product);
                this.add_prod.display_text_upsell = this.upSellingDisplayTextPair.get(value1.linked_upsell_product);
          //      console.log("crosssellingceode is", value1.linked_crossselling_product);
                  
//
          //      console.log("crossel code nameis", this.crossSellingProductCodeNamePair.get(value1.linked_crossselling_product));
                this.add_prod.dummy_crosssell_name = this.crossSellingProductCodeNamePair.get(value1.linked_crossselling_product);
                this.add_prod.dummy_upsell_name = this.upSellingProductCodeNamePair.get(value1.linked_upsell_product);
               
                console.log("this.addprods", this.add_prod);
                this.myForm.get('product_code').disable();
                this.myForm.get('child_of').disable();
                jQuery('.product_code_label').removeClass('control-label');
                jQuery('.product_code_label').addClass('label-disable');
        jQuery('#createProd_modal').modal('show');
        /////
                 //console.log("Add PROD",this.add_prod.product_code);
                 return false;
             }
 
         });
      /*  this.loginservice.getProductDetails(prod_id).subscribe(
            (edit_prod_v: ProductsInterface) => {
                console.log("edit data", edit_prod_v[0]);
                this.add_prod = edit_prod_v[0];
                if (this.add_prod.linked_crossselling_product != "" && this.add_prod.linked_crossselling_product != undefined) {
                    this.checked_cross_sell = true;
                    $('#check_cross_sell').prop('checked', true)
                    this.myForm.get('display_text').disable();
                    this.add_prod.linked_crossselling_product_name = edit_prod_v[0].linked_crossselling_product;
                    setTimeout(()=> {
                         jQuery('#disable_display_text_label').removeClass('control-label');
                    jQuery('#disable_display_text_label').addClass('label-disable');   
                    }, 200);
                }
                if (this.add_prod.linked_upsell_product != "" && this.add_prod.linked_upsell_product != undefined) {
                    this.checked_up_sell = true;
                    $('#check_up_sell').prop('checked', true);
                    this.add_prod.linked_upselling_product_name = edit_prod_v[0].linked_upsell_product;
                    this.myForm.get('display_text_upsell').disable();
                    setTimeout(function() {
                        jQuery('#disable_display_upselltext_label').removeClass('control-label');
                    jQuery('#disable_display_upselltext_label').addClass('label-disable');
                        
                    }, 200);    
                }
                this.add_prod.product_type_name = this.productTypeCodeNamePair.get(this.add_prod.child_of);
             
                this.add_prod.display_text = this.crossSellingDisplayTextPair.get(this.add_prod.linked_crossselling_product);
                this.add_prod.display_text_upsell = this.upSellingDisplayTextPair.get(this.add_prod.linked_upsell_product);
                console.log("crosssellingceode is", edit_prod_v[0].linked_crossselling_product);
                  

                console.log("crossel code nameis", this.crossSellingProductCodeNamePair.get(this.add_prod.linked_crossselling_product));
                this.add_prod.dummy_crosssell_name = this.crossSellingProductCodeNamePair.get(this.add_prod.linked_crossselling_product);
                this.add_prod.dummy_upsell_name = this.upSellingProductCodeNamePair.get(this.add_prod.linked_upsell_product);
               
                console.log("this.addprods", this.add_prod);
                this.myForm.get('product_code').disable();
                this.myForm.get('child_of').disable();
                jQuery('.product_code_label').removeClass('control-label');
                jQuery('.product_code_label').addClass('label-disable');
        jQuery('#createProd_modal').modal('show');*/
               /* if (this.checked_up_sell) {
                   this.myForm.get('display_text_upsell').disable();
        
                    jQuery('#disable_display_upselltext_label').removeClass('control-label');
                    jQuery('#disable_display_upselltext_label').addClass('label-disable');
                }
                if (this.checked_cross_sell) {
                    this.myForm.get('display_text').disable();
        
                    jQuery('#disable_display_text_label').removeClass('control-label');
                    jQuery('#disable_display_text_label').addClass('label-disable');

                }*/
                //this.myForm.patchValue({linked_crossselling_product:edit_prod_v[0].linked_crossselling_product});
                //jQuery("#cross_sell_id_dummy").val(this.crossSellingProductCodeNamePair.get(this.add_prod.linked_crossselling_product));
                 //this.add_prod.dummy_upsell_name=this.get
                // this.add_prod.linked_crossselling_product_name = this.crossSellingProductCodeNamePair.get(this.add_prod.linked_crossselling_product);
                //this.add_prod.linked_upselling_product_name = this.upSellingProductCodeNamePair.get(this.add_prod.linked_upsell_product);
                //this.myForm.patchValue({linked_crossselling_product:this.crossSellingNameIDPair.get(val)});
            //});

    }

    delProd(prod_id: string, prod_name: string) {
        console.log(prod_id);

        return new Promise((resolve, reject) => {
            jQuery.each(this.products, (index, value) => {
                if (value.product_code == prod_id) {
       //             console.log("Inside each", value);
                    if (value.linked_upsell_product != "" && value.linked_upsell_product != undefined) {
                        console.log("Sorry we cant delete this flag as upsellis linked");
                        //this.del_prod = value ;
                        this.del_prod.product_name = prod_name
                        this.del_prod.product_code = prod_id;
                        //jQuery('#cannot_del_modal').modal('show');
                        reject("Sorry we cant delete this flag as upsellis linked");
                        return false;

                    }
                    else if (value.linked_crossselling_product != "" && value.linked_crossselling_product != undefined) {
                        this.del_prod.product_name = prod_name
                        this.del_prod.product_code = prod_id;
                        console.log("Sorry we cant delete this flag as croseell is linked");
                        // jQuery('#cannot_del_modal').modal('show');
                        reject("Sorry we cant delete this flag as croseell is linked");
                        return false;
                    }
                    else {
                        this.del_prod.product_name = prod_name
                        this.del_prod.product_code = prod_id;
                        console.log("Can be deleted");
                        resolve("can be deleted");
                        return false;

                    }
                }

            })
        }).then((e) => {
            console.log(e);

            // this.loginservice.getProductDetails(prod_id).subscribe(
            //    (product: ProductsInterface) => {
            //      this.del_prod = product[0];
            //     console.log("*****************" + this.del_prod.product_code);
            jQuery('#del_modal').modal('show');

            // });
        }).catch((e) => {
            //console.log(e);
            jQuery('#cannot_del_modal').modal('show');

        })
    }

    delConf() {
        console.log(this.del_prod.product_code);
        jQuery('#del_modal').modal('hide');
        jQuery('.overlay').show();
        jQuery('#load').show();
        this.loginservice.isProductDeletable(this.del_prod.product_code, false).subscribe(
            (isProductDeletableFlag: Boolean) => {
                console.log("thk h")
                console.log(isProductDeletableFlag);
                this.getProductTypes().then((e) =>
                    (this.getCrossSellingProducts()))
                    .then((e) => (this.getUpSellingProducts()))
                    .then((e) => (this.getProducts()))
                    .then((e) => {
                        console.log(e);
                        this.flag = true;
                        jQuery('.overlay').hide();
                        jQuery('#load').hide();
                    });
                /* if (!isProductDeletableFlag) {
                     console.log("Sorry we cant delete this flag");
                     jQuery('#cannot_del_modal').modal('show');
                 } else {
                     this.del_prod.del_flg = true;
                    // this.addProd(this.del_prod);
                     this.deletedSuccessfully = true;
                     setTimeout(() => {
                         this.deletedSuccessfully = false;
                     }, 3000);
 
                 }
 
                 /*
                  if(isProductDeletableFlag){
                     
                  }*/
            }
        )

    }
    showCampaignModal(prod_id:string){
     //   console.log("xsad");
        this.campaign_prod_id =prod_id;
        this.campaign_code="";
        this.campaign_source=""
        this.add_campaign=true;
        this.isCopied=false;
        jQuery("#url_modal").show();
        
    }
    getCampaignURL()
    {
     //   console.log(this.campaign_code);
     //   console.log(this.campaign_source);

        this.campaign_url = this.configMsg.url.clientUrl+'/'+'campaign?utm_source='+this.campaign_source+
        '&utm_medium='+this.campaign_prod_id+'&utm_campaign='+this.campaign_code ;
        this.add_campaign=false;
        
    }
    cal_success()
    {   
    //    console.log("suceesss sdas");
        this.isCopied=true;
    }
    ngAfterViewInit() {
        jQuery("body").on('change', '#cross_sell_id_dummy', () => {
            //console.log(this.val());
            this.crossSellingNameIDPair.has(val);
            var val = $("#cross_sell_id_dummy").val();
     //       console.log("has value", this.crossSellingDisplayTextPair.has(val));
     //       console.log("ID from text", this.crossSellingNameIDPair.get(val));
            // if(this.crossSellingDisplayTextPair.has(val)){
            if (this.crossSellingNameIDPair.has(val)) {
                this.add_prod.display_text = this.crossSellingDisplayTextPair.get(this.crossSellingNameIDPair.get(val));
                this.add_prod.linked_crossselling_product_name = this.crossSellingNameIDPair.get(val);
                this.myForm.get('display_text').disable();
                jQuery('#disable_display_text_label').removeClass('control-label');
                jQuery('#disable_display_text_label').addClass('label-disable');
                //this.myForm.patchValue
                this.myForm.patchValue({ linked_crossselling_product: this.crossSellingNameIDPair.get(val) });
                // $('#disable_display_text_label').css('display', 'none');
            }
            else {
                this.myForm.get('display_text').enable();
                jQuery('#disable_display_text_label').removeClass('label-disable');
                jQuery('#disable_display_text_label').addClass('control-label');
                this.add_prod.display_text = '';
                this.myForm.patchValue({ linked_crossselling_product: val });
                // $('#disable_display_text_label').css('display', 'block');
            }
            console.log("value is", val);
        })

        jQuery("body").on('change', '#upsell_id_dummy', () => {
            var val = $("#upsell_id_dummy").val();
       //     console.log("has value", this.upSellingDisplayTextPair.has(val))
      //      console.log("ID from text", this.upSellingNameIDPair.get(val));
      //      console.log("display text is", this.upSellingDisplayTextPair.get(this.upSellingNameIDPair.get(val)));
            if (this.upSellingNameIDPair.has(val)) {
                this.add_prod.display_text_upsell = this.upSellingDisplayTextPair.get(this.upSellingNameIDPair.get(val));
                this.myForm.get('display_text_upsell').disable();
                jQuery('#disable_display_upselltext_label').removeClass('control-label');
                jQuery('#disable_display_upselltext_label').addClass('label-disable');
                this.add_prod.linked_upselling_product_name = this.upSellingNameIDPair.get(val);
                //$('#disable_display_upselltext_label').css('display', 'none');
            }
            else {
                this.myForm.get('display_text_upsell').enable();
                this.add_prod.display_text_upsell = '';
                // $('#disable_display_upselltext_label').css('display', 'block');
                jQuery('#disable_display_upselltext_label').removeClass('label-disable');
                jQuery('#disable_display_upselltext_label').addClass('control-label');
                 this.myForm.patchValue({ linked_upsell_product: val });
            }
            console.log("value is", val);
            // console.log("halua");
        })
/// ADDON ON CHANGE
         jQuery("body").on('change', '#addcrossorup', () => {
            var val = $("#addcrossorup").val();
            //console.log("has name in add-on",this.allAddons.find(val));
        //    console.log("already has this crosssell",this.crossSellingNameIDPair.has(val));
       //     console.log("already has this crosssell",this.upSellingNameIDPair.has(val));
            if(this.crossSellingNameIDPair.has(val)){
                 this.add_addon.display_text = this.crossSellingDisplayTextPair.get(this.crossSellingNameIDPair.get(val));
                this.add_addon.child_of=this.const.CROSSSELL;
                //this.add_addon.child_of = this.allAddons.indexOf(this.cro;
                //this.myAddOnFrom.get('display_text').disable();
                this.myAddOnFrom.get('child_of').disable();
                this.isAddMode=false;
                jQuery('#disable_display_text_label').removeClass('control-label');
                jQuery('#disable_display_text_label').addClass('label-disable');
                this.add_addon.product_code = this.crossSellingNameIDPair.get(val);
                this.add_addon.product_name = val;
                //this.myForm.patchValue
                //this.myForm.patchValue({ linked_crossselling_product: this.crossSellingNameIDPair.get(val) });
            }
            else if(this.upSellingNameIDPair.has(val))
            {   
                 this.add_addon.display_text = this.upSellingDisplayTextPair.get(this.upSellingNameIDPair.get(val));
                  this.add_addon.child_of=this.const.UPSELL;
                  this.isAddMode=false;
                  this.myAddOnFrom.get('child_of').disable();
                //this.myAddOnFrom.get('display_text').disable();
                jQuery('#disable_display_text_label').removeClass('control-label');
                jQuery('#disable_display_text_label').addClass('label-disable');
                 this.add_addon.product_code = this.upSellingNameIDPair.get(val);
                 this.add_addon.product_name = val

            }
            else{
                // this.myAddOnFrom.get('display_text').enable();
                this.add_addon.display_text = '';
                 this.add_addon.child_of='';
                this.isAddMode=true;
                this.myAddOnFrom.get('child_of').enable();
                // $('#disable_display_upselltext_label').css('display', 'block');
                jQuery('#disable_display_text_label').removeClass('label-disable');
                jQuery('#disable_display_text_label').addClass('control-label');
                  this.add_addon.product_code = "";
                  this.add_addon.product_name = val
            }

           /* console.log("has value", this.upSellingDisplayTextPair.has(val))
            console.log("ID from text", this.upSellingNameIDPair.get(val));
            console.log("display text is", this.upSellingDisplayTextPair.get(this.upSellingNameIDPair.get(val)));
            if (this.upSellingNameIDPair.has(val)) {
                this.add_prod.display_text_upsell = this.upSellingDisplayTextPair.get(this.upSellingNameIDPair.get(val));
                this.myForm.get('display_text_upsell').disable();
                jQuery('#disable_display_upselltext_label').removeClass('control-label');
                jQuery('#disable_display_upselltext_label').addClass('label-disable');
                this.add_prod.linked_upselling_product_name = this.upSellingNameIDPair.get(val);
                //$('#disable_display_upselltext_label').css('display', 'none');
            }
            else {
                this.myForm.get('display_text_upsell').enable();
                this.add_prod.display_text_upsell = '';
                // $('#disable_display_upselltext_label').css('display', 'block');
                jQuery('#disable_display_upselltext_label').removeClass('label-disable');
                jQuery('#disable_display_upselltext_label').addClass('control-label');
                 this.myForm.patchValue({ linked_upsell_product: val });
            }
            console.log("value is", val);
            // console.log("halua");*/
        })

    }

}
