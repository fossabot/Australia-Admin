import { Component,AfterViewInit} from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import {OAOadminService} from "../services/OAOadmin.service";



@Component({
    selector: 'office365',
	template: ``
})
export class office365 implements AfterViewInit{
 
	clientToken:string;
  constructor(private oaoService: OAOadminService,private router: Router,private route: ActivatedRoute)
  {
	  
	

    
  }//constructor

  ngAfterViewInit(){
	  this.route.params.subscribe(params => {
		  let token = params['token'];
		  console.log(token);
		  if(token==undefined)
		  {
			  window.location.replace(this.oaoService.baseURL);
		  }
		  console.log("token>",token);
		  this.clientToken=token;
		  let isValid:boolean;
		   this.oaoService.tokenValidation(this.clientToken)
        .subscribe(
           data =>{
			   console.log(data);
			   isValid=data.success;
			   console.log("isValid>>",isValid);
		this.oaoService.setOfficeAccountLoggedIn(isValid);
	  
		if(isValid){
			this.router.navigate(['/logintype']);
		}
		else{
			//this.router.navigateByUrl('/');
			//this.zone.runOutsideAngular(() => {
    window.location.replace(this.oaoService.baseURL);
			//});
		}
});
		
		   });
		   
      
	  }
  }
  
   
//}
