export class UserInterface{
    constructor(
        public username:String,
        public lname:String,
        public password:String,
        public email:String,
        public mobile:String,
        public role:String,
        public newpassword?:String
        ){
            this.username=username;
            this.lname=lname;
            this.password=password;
            this.email=email;
            this.mobile=mobile;
            this.role=role;
            this.newpassword=newpassword;
    }
}
   