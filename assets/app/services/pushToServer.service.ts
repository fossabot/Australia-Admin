import { Http, Response, Headers } from "@angular/http";
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from "rxjs";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class PushToServer
{
    baseURL:string = "http://localhost:3001";

    constructor(private http: Http){

    }

    zipFileExtractor(){

        return this.http.get(`${this.baseURL}/push_to_server/extractUploadedFile`)
        .map(response => response.json())
        .catch((error: Response) => Observable.throw(error.json()));

    }
    getThemes() {
        return this.http.get(`${this.baseURL}/push_to_server/subscribedTheme`)
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
    switchThemes(filename) {
        console.log(filename);
        return this.http.get(`${this.baseURL}/push_to_server/publishTheme/`+filename)
            .map(response => response.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
        getProcessDataF(){
         return this.http.get(`${this.baseURL}/api/getStatusFileData`)
        .map(response => response.json())
        .catch((error: Response) => Observable.throw(error.json()));
    }
      resetData(){
         return this.http.get(`${this.baseURL}/api/resetFileData`)
        .map(response => response.json())
        .catch((error: Response) => Observable.throw(error.json()));
    }
    
}