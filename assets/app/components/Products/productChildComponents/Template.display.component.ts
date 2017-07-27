import { Component,OnInit,AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';

import { PushToServer } from "../../../services/pushToServer.service";
import { OAOadminService } from "../../../services/OAOadmin.service";
declare var jQuery: any;

@Component({
    templateUrl:'./templatesdisplaycomponent.component.html',
    
})

export class TemplatesDisplayComponent  {
    myForm:FormGroup;
    isLoading:boolean=false;
    uploadInfoID: string[] = ['document 1'];
    inf_003: string;
    config: any
    urlString: string
    fileName: string;
    isfileExist: boolean;
    ispushFileExist: boolean;
     msgFlag:boolean;
     delFlag:boolean;
    constructor(private router: Router, private route: ActivatedRoute,private pushToServer: PushToServer, private service: OAOadminService){
        this.isfileExist = false;
         this.msgFlag=false;
         this.delFlag=false;
        this.ispushFileExist = false;
		
        console.log("const m: " + this.fileName);
        this.config = {
            thumbnailHeight: 70,
            autoReset: '0',
            url: "/api/upload"
        }
        this.fileExists();
        this.pushFileExists();
       
    }
    ngOnInit() {
       
        jQuery('#uploadBox').show();
        jQuery('#errorMessage').hide();
        jQuery("#successMessage").hide();
         jQuery('.overlay-loading').hide();
         jQuery('.spin-above').hide();
    }
     push(){
      this.isLoading=true;
      this.pushToServer.zipFileExtractor().subscribe(data=>{			 
      console.log("success");
      
 this.service.renameFile().subscribe(
            (data) => {
                this.fileExists();
                this.pushFileExists();
                this.isLoading=false;
            }
        )
		this.msgFlag=true;
                        setTimeout(() => {  
                            this.msgFlag=false;
                        }, 6000);
 
      });
 
    }
 fileExists() {
        this.service.fileExists().subscribe(
            (data) => {
                this.isfileExist = data.success;
                console.log("file exists: "+this.isfileExist);
            }
        )
    }
    pushFileExists() {
        this.service.pushFileExists().subscribe(
            (data) => {
                this.ispushFileExist = data.success;
                console.log("push file exists: "+this.ispushFileExist);
            }
        )
    }
    addRow1() {


        this.uploadInfoID.push('document' + this.uploadInfoID.length + 1);
        setTimeout(function () { jQuery(".scrollcls").scrollTop(10000); }, 200);
        jQuery("#addAnotherDoc1").css('display', 'none');

    }



    successUpload1(data) {
     jQuery('.overlay-loading').show();
      jQuery('.spin-above').show();
        console.log("upload");
        console.log(data);
        var fName = data[0].name.split(' ');
        this.fileName = fName[0];
        if(data[1].success==true){
           jQuery('.overlay-loading').hide();
            jQuery('.spin-above').hide();
        }
        
             this.isfileExist=true;
             this.ispushFileExist=false;
       
       
        console.log("done upload with flag update");


        // jQuery("#successMessage").show();
        //  jQuery("#successMessage").text(this.fileName + " got added.");
        // setTimeout(function(){
        //  jQuery("#successMessage").hide();

        // },4000);

    }

    showError(data) {
        jQuery('#errorMessage').show();
        jQuery('#errorMessage').text(data[1]);
        setTimeout(function () {
            jQuery("#errorMessage").hide();
        }, 4000);

    }

    deleteFile() {
         this.isLoading=true;
        this.service.deleteFile().subscribe(
            (data: any) => {
                var data = data;
                console.log(data);
               
                this.fileExists();
                this.pushFileExists();
                this.isLoading=false;
                this.delFlag=true;
                        setTimeout(() => {  
                            this.delFlag=false;
                        }, 6000);
 
                jQuery('#successMessage1').hide();
            }
        )
    }
         
     }

