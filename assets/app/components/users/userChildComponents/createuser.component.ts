import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserInterface } from "../../../interfaces/userinterface";
import { OAOadminService } from "../../../services/OAOadmin.service";
import { NgForm } from "@angular/forms";
import { FormGroup, FormControl, Validators } from "@angular/forms";
@Component({
    templateUrl: './createuser.component.html',

})
export class CreateUserComponent {
  myForm: FormGroup;
    public addStatus:String;
    public user = new UserInterface('', '', '', '', '', '');
    constructor(private loginservice: OAOadminService, private router: Router) {
        this.addStatus = "false";
    }
    sha512(msg:String)
{
    var sha512 = require('sha512')
    var hash = sha512(msg);
    return hash.toString('hex');
}
ngOnInit(){
  
    this.myForm = new FormGroup({
        'username': new FormControl(null, Validators.required),
        'lname': new FormControl(null, Validators.required),
        'email': new FormControl(null, [Validators.required]),
        'contactNumber': new FormControl(null, Validators.required),
        'role': new FormControl(null, Validators.required),
        'password': new FormControl(null, Validators.required),
        'cp': new FormControl(null, Validators.required),

        });
}

validateEmail(){
   
    if(this.user.email.match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/)){
     
        return true;
    }
      return false;
}
    addUser(formRecord: UserInterface) {
     formRecord.password=this.sha512(this.user.password);  
        console.log("adding..")     
        console.log(formRecord);
        // formRecord.password=this.sha512(formRecord.password);
        console.log(formRecord.password)
        this.loginservice.AddUser(formRecord).subscribe(
            data => {
                this.addStatus = data.result;
                console.log(data);
                console.log(this.addStatus);
                if (this.addStatus == "success") {
                    console.log("clearing field")
                    this.user = new UserInterface('', '', '', '', '', '');
                }


            }
        )

    }

}