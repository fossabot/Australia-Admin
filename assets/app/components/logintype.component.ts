import { Component,OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators,NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
// import {PasswordAuth} from './helpers/passwordAuth.model';
/*
import { loginModel} from "../../interfaces/login.interface";

import { OAOadminService} from "../../services/OAOadmin.service";

import {responseModel} from "../../interfaces/responseMessage.interface"
*/


@Component({
    host: {'(window:keydown)': 'hotkeys($event)'},
    templateUrl: './logintype.component.html',
})
export class LoginTypeComponent implements OnInit{
    
    constructor(private router: Router,private activatedRoute: ActivatedRoute){
   
		
	}
    hotkeys(event){
      if (event.keyCode == 83 && event.altKey){
         this.router.navigate(['/login/service']);
      }
      else if(event.keyCode==80 && event.altKey)
      {
          this.router.navigate(['/login/product']);
      }
      else if(event.keyCode==73 && event.altKey)
      {
         this.router.navigate(['/login/admin']);
      }
      else
      {
          $("#error").css("visibility","visible").delay(1000).queue(function(n) {
             $(this).css("visibility","hidden"); n();
            });
      }
   }
    redirectTo(redirect_to:string){
    console.log(redirect_to);
    if(redirect_to == '1')
    {
        
        this.router.navigate(['/login/service']);
    }
    else if(redirect_to == '2')
    {
        this.router.navigate(['/login/product']);
    }
    else if(redirect_to == '3')
    {
        this.router.navigate(['/login/admin']);
    }


    
    }
//  ngAfterViewInit() {


//         jQuery(window).load(function() {
// 		// Animate loader off screen
// 		jQuery(".se-pre-con").fadeOut("slow");;
// 	});
//  }

ngOnInit() {
    
    
}

}