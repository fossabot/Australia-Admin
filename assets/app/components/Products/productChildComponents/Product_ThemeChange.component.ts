import { Component,OnInit,AfterViewInit,ChangeDetectorRef  } from '@angular/core';
import { Observable,Subscription } from "rxjs";
import { Router } from "@angular/router";
import { OAOadminService} from "../../../services/OAOadmin.service";

import { CustomeStyleInterface } from "../../../interfaces/customeStyle";


declare var jQuery:any;
declare var moment: any;

@Component({
    templateUrl:'./Product_ThemeChange.component.html',
    
})

export class ProductThemeChangecomponent implements AfterViewInit
{
    private model  = new CustomeStyleInterface();
    private logoContainer:boolean;
    private designContainer:boolean;
    private color1:any;
    private color2:any;
    private color3:any;
    private color4:any;
    private color5:any;
    private font_style:any;
    private pushflag:any;
    private resetflag:any;
    private imgflag:any;

    private xx:any;
    uploadInfoID: string[] = ['document 1'];
    config: any;
    constructor(private oAOadminService: OAOadminService,private chRef:ChangeDetectorRef){
        this.pushflag=false;
        this.resetflag=false;
        this.imgflag=false;

        this.oAOadminService.getCustomeStyle().subscribe((data)=>{
		console.log("custome style record");
			console.log(data);
            if(data.Result.length==0){
                console.log("no record");
            }else{
            this.color1=data.Result[0].background_color;
            this.color2=data.Result[0].text_color;
            this.color3=data.Result[0].bck_btn_color;
            this.font_style=data.Result[0].font_family;
            this.color4=data.Result[0].progress_bar_1;
            this.color5=data.Result[0].progress_bar_2;
            }
			
           
        })

        
         this.config = {
            thumbnailHeight: 70,
            autoReset: '0',
            url: "/api/upload"
        }

        this.logoContainer=true;
        this.designContainer=false;

        var style={
            'font-size':'40px'
        };
    }
    successUpload1(event:any){
          this.imgflag = true;
          this.chRef.detectChanges();
                setTimeout(() => {
                    this.imgflag = false;
                    this.chRef.detectChanges();
                }, 4000);
    }

    showError(){
          this.imgflag = true;
          this.chRef.detectChanges();
                setTimeout(() => {
                    this.imgflag = false;
                    this.chRef.detectChanges();
                }, 4000);
    }
    ngOnInit(){
        jQuery('#uploadBox').show();
    }

    logo(){
       this.designContainer=false;
        this.logoContainer=true;

    }
    Design(){
         this.logoContainer=false;
         this.designContainer=true;
        
    }

    onSubmit(value:any){
        console.log(value);
        this.model.background_color=value.color1;
        this.model.text_color=value.color2;
        this.model.bck_btn_color=value.color3;
        this.model.font_family=value.font_style;
        this.model.progress_bar_1=value.color4;
        this.model.progress_bar_2=value.color5;

        this.oAOadminService.customeStyle(this.model)
        .subscribe(data=>{
            console.log(data);
 jQuery('#apply_style').modal('hide');
           
                   this.pushflag = true;
                setTimeout(() => {
                    this.pushflag = false;
                }, 4000);

               
        })
    }

    resetbtn(){
    jQuery('#reset_style').modal('show');
}

applybtn(){
   jQuery('#apply_style').modal('show');
}
    reset(){
        this.oAOadminService.resetFlagChange()
        .subscribe(data=>{
            console.log(data);
            jQuery('#reset_style').modal('hide');

              this.resetflag = true;
                setTimeout(() => {
                    this.resetflag = false;
                }, 4000);
            
        })
    }

       ngAfterViewInit() {
             jQuery("body").on("click", "#myImg", function () {
            // console.log("clicked image");
            jQuery('.modal1').css("display", "block");
            jQuery("#img01").attr("src", '/assets/images/background-color.PNG');
            // alert("welcome");
        });

              jQuery("body").on("click", "#myImg1", function () {
            // console.log("clicked image");
            jQuery('.modal1').css("display", "block");
            jQuery("#img01").attr("src", '/assets/images/text-color.PNG');
            // alert("welcome");
        });

              jQuery("body").on("click", "#myImg2", function () {
            // console.log("clicked image");
            jQuery('.modal1').css("display", "block");
            jQuery("#img01").attr("src", '/assets/images/text-color.PNG');
            // alert("welcome");
        });

              jQuery("body").on("click", "#myImg3", function () {
            // console.log("clicked image");
            jQuery('.modal1').css("display", "block");
            jQuery("#img01").attr("src", '/assets/images/button.PNG');
            // alert("welcome");
        });

              jQuery("body").on("click", "#myImg4", function () {
            // console.log("clicked image");
            jQuery('.modal1').css("display", "block");
            jQuery("#img01").attr("src", '/assets/images/prgressbar.PNG');
            // alert("welcome");
        });

              jQuery("body").on("click", "#myImg5", function () {
            // console.log("clicked image");
            jQuery('.modal1').css("display", "block");
            jQuery("#img01").attr("src", '/assets/images/prgressbar2.PNG');
            // alert("welcome");
        });

         jQuery("body").on("click", ".close3", function () {
            jQuery('.modal1').css("display", "none");
        });
       }

  
}
