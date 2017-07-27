export class Admins {
    constructor(
        public username?: string,
       
    ){
        
        this.username=username
    }
}
export class LogsForm{
    constructor(
    public app_id?: string,
    public status?: string,
    public assign?: string,
    public comments?: string
    ){
        this.app_id = app_id;
        this.status = status;
        this.assign = assign;
        this.comments = comments;
}
}

export class Logs{
    constructor(
    public who?: string,
    public change_type?:string,
    public from?:string,
    public to?:string,
    public comment?:string,
    public updated_time?:Date
    ){
    this.who = who;
    this.change_type = change_type;
    this.from=from;
    this.to=to;
    this.comment=comment;
    this.updated_time=updated_time;

    }
}
