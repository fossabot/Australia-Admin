import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { OAOadminService} from "../../services/OAOadmin.service";



declare var jQuery: any;
@Component({
  selector: 'docs-upload',
  templateUrl: './docsUpload.component.html'
})
export class DocumentsUpload implements AfterViewInit {

  uploadInfoID: string[] = ['document 1'];
  inf_003: string;
  // private baseUrl:String = '';
  config: any
  urlString:string
  file_type:string

fileName:string;
  constructor(private oaoService: OAOadminService,private router: Router, private route: ActivatedRoute) {
   
    this.urlString=this.router.url;
   
var componenturl:string[]=this.urlString.split('/');
 
this.file_type=componenturl[3];
    console.log("const m: "+this.fileName);
    this.config = {
      thumbnailHeight: 70,
      url: "/api/upload",
      previewTemplate: `<div class="dz-preview dz-file-preview">
                        <p id="successMessage"></p>
                      </div>`
     
    }

    // this.baseUrl = oaoService.getBaseUrl();

     
  }



  addRow1() {


    this.uploadInfoID.push('document' + this.uploadInfoID.length + 1);
 setTimeout(function(){ jQuery(".scrollcls").scrollTop(10000); }, 200);
    jQuery("#addAnotherDoc1").css('display', 'none');
   
  }


  successUpload1(data) {
    console.log(data);
    console.log("Data0: "+data[0].name);
    var fName=data[0].name.split(' ');
    this.fileName=fName[0];
    console.log("fileName: "+this.fileName);
     console.log("Data1: "+data[1].toString());
      console.log("Data2: "+data[2].toString());
       setTimeout(function(){ jQuery(".scrollcls").scrollTop(10000); }, 200);
       jQuery("#successMessage").text(this.fileName+" got added.");
    jQuery("#addAnotherDoc1").css('display', '');

  }


  ngAfterViewInit() {

    jQuery("#addAnotherDoc1").css('display', 'none');


  }

}
