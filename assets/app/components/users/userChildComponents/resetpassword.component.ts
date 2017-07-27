import { Component,OnInit,AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserInterface } from "../../../interfaces/userinterface";
import { OAOadminService } from "../../../services/OAOadmin.service";
import { NgForm } from "@angular/forms";
import { FormGroup, FormControl, Validators } from "@angular/forms";
@Component({
    templateUrl:'./resetpassword.component.html',

})

export class ResetpasswordComponent {
    public user = new UserInterface('', '', '', '', '', '', '');
    myForm:FormGroup;
    public changeStatus:String;
    constructor(private loginservice: OAOadminService, private router: Router) {
this.changeStatus='false';
    }
    sha512(msg: String) {
        var sha512 = require('sha512')
        var hash = sha512(msg);
        return hash.toString('hex');
    }
    ngOnInit(){
    
    this.myForm = new FormGroup({
        'password': new FormControl(null, Validators.required),
        'newpassword': new FormControl(null, Validators.required),
        'cp': new FormControl(null, Validators.required)
        

        });
}
    changePassword(formRecord: UserInterface) {
        console.log(localStorage.getItem('username'));
        console.log(formRecord)
        formRecord.username = localStorage.getItem('username');
        console.log(formRecord.username)
        formRecord.password = this.sha512(this.user.password);
        formRecord.newpassword = this.sha512(this.user.newpassword);
        this.loginservice.changePassword(formRecord).subscribe(
            data => {

                console.log(data);
                if (data.Result == "Password changed") {
                    this.changeStatus=data.Result;
                    console.log("clearing field")
                    this.user = new UserInterface('', '', '', '', '', '', '');
                }
            }
        )

}
}