import { Component,OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators,NgForm } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
// import {PasswordAuth} from './helpers/passwordAuth.model';

import { loginModel} from "../../interfaces/login.interface";

import { OAOadminService} from "../../services/OAOadmin.service";

import {responseModel} from "../../interfaces/responseMessage.interface"



@Component({
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit{
    myForm: FormGroup;
    name:string;
    pass:string;

    u_name:string;
    status:string;
    route:string;
    menu: number;
    
    private loginmodel:loginModel;

     ResponseModel:responseModel;

    constructor(private loginservice:OAOadminService,private router: Router,private activatedRoute: ActivatedRoute){
    console.log("url is");
		console.log(this.activatedRoute.snapshot);
        if((this.activatedRoute.snapshot.url).length > 1)
        this.route = this.activatedRoute.snapshot.url[1].path;
        else
        this.route = '';
        console.log(this.route);

		if(this.loginservice.getOfficeAccountLoggedIn()==undefined){
			console.log('Check Office account logged in');
			//router.navigate(['/office365']);
		}else if (this.loginservice.getOfficeAccountLoggedIn()==true){
			// Do nothing
		} else{
			console.log("setting office account to False");
			this.loginservice.setOfficeAccountLoggedIn(false);
		}
		
	}

sha512(msg:string)
{
    var sha512 = require('sha512')
    var hash = sha512(msg);
    return hash.toString('hex');
}


onSubmit() 
{
    this.pass=this.sha512(this.myForm.value.password);
    // console.log(this.myForm.value.username);
    // console.log(this.pass);
 //console.log("hello url is "+this.activatedRoute.snapshot.url[0].path);
    const loginmodel = new loginModel(this.myForm.value.username, this.pass);

    this.loginservice.Login(loginmodel)
                .subscribe( data => {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('status', data.status);
                    console.log("USERNAE AFTER LOGIN",data.username);

                    // console.log("token"+data.token);
                    // console.log("username"+data.username);
                    // console.log("status"+data.status);

                    if(data.status=="Authenticated" && this.route == '')
                    {
                    localStorage.setItem("menu", '1');
                    this.router.navigateByUrl('/dashboard');
                    
                    
                    }
                    else if(data.status=="Authenticated" && this.route == 'service')
                    {
                     localStorage.setItem("menu", '2');
                    this.router.navigateByUrl('/application');
                    }
                    else if(data.status=="Authenticated" && this.route == 'product')
                    {
                    localStorage.setItem("menu", '3');
                    this.router.navigateByUrl('/dashboard');
                    }
                    else if(data.status=="Authenticated" && this.route == 'admin')
                    {
                    localStorage.setItem("menu", '4');
                    this.router.navigateByUrl('/users');
                    }
                    this.u_name=data.username;
                    this.status=data.status;
                    // console.log(this.status);

                    this.pass="";
                    this.myForm.reset();
                    
                },
                error => console.error(error)
                );

}
  ngAfterViewInit() {

    if(this.route == "service")
        {
            console.log("ins ervice ");
            jQuery(".panel-subheading").css("background","none");
            jQuery(".login-content .login-form .panel-heading").css("background","none");
            jQuery("#header_login").css("background","#1bbc9b");
            $("#image").attr("src","/assets/images/Services.png");
        }
        if(this.route == "product")
        {
            console.log("ins ervice ");
            jQuery(".panel-subheading").css("background","none");
            jQuery(".login-content .login-form .panel-heading").css("background","none");
            jQuery("#header_login").css("background","#eb974e");
            $("#image").attr("src","/assets/images/ProductManager.png");
        }
        if(this.route == "admin")
        {
            console.log("ins ervice ");
            jQuery(".panel-subheading").css("background","none");
            jQuery(".login-content .login-form .panel-heading").css("background","none");
            jQuery("#header_login").css("background","#385996");
            $("#image").attr("src","/assets/images/Sys_Admin_new.png");
        }
        }
//         jQuery(window).load(function() {
// 		// Animate loader off screen
// 		jQuery(".se-pre-con").fadeOut("slow");;
// 	});
//  }

ngOnInit() {
    this.myForm = new FormGroup({
        username: new FormControl(null, Validators.required),
        password: new FormControl(null, Validators.required)
    });
    
}

}