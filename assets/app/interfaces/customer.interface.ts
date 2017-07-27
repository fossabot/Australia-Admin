export class Customers {
  customer_id:number;
		 name:string;
		 email:string;
		 dob:string;
		 address:string;
		 mobile_no:number;
		 id_type:string;
		 id_number:string;
		 id_state:number;
		 username:string;
		 password:string;
		 core_customer_id:string;
		 core_account_number:string;
		 create_time:string;
		 modify_time:string;
		 created_by:string;
		 modified_by:string;
		 delete_flag:string;
		  product_type_name:String; 
		  child_of: String;
		  product_code_name:String;
		  product_code:String
		 
		 constructor( customer_id:number,
		 name:string,
		 email:string,
		 dob:string,
		 address:string,
		 mobile_no:number,
		 id_type:string,
		 id_number:string,
		 id_state:number,
		 username:string,
		 password:string,
		 core_customer_id:string,
		 core_account_number:string,
		 create_time:string,
		 modify_time:string,
		 created_by:string,
		 modified_by:string,
		 delete_flag:string,
		 product_type_name:String, 
		  child_of: String,
		  product_code_name:String,
		  product_code:String)
		 {
		 this.customer_id=customer_id;
		 this.name=name;
		 this.email=email;
		 this.dob=dob;
		 this.address=address;
		 this.mobile_no=mobile_no;
		 this.id_type=id_type;
		 this.id_number=id_number;
		 this.id_state=id_state;
		 this.username=username;
		 this.password=password;
		 this.core_customer_id=core_customer_id;
		 this.core_account_number=core_account_number;
		 this.create_time=create_time;
		 this.modify_time=modify_time;
		 this.created_by=created_by;
		 this.modified_by=modified_by;
		 this.delete_flag=delete_flag;
		 this.product_type_name=product_type_name;
		 this.child_of=child_of;
		 this.product_code_name=product_code_name;
		 this.product_code=product_code;
		 }
}


