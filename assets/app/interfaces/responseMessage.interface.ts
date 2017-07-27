export class responseModel
{
    status:string;
    username?:string;
    token?:string;
    constructor(status:string,username:string,token:string){
        this.status=status;
        this.username=username;
        this.token=token;
    }
}