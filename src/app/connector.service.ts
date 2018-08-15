import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ConnectorService {

  constructor(
    private http: HttpClient
  ) { }

  public getRequest(url,params) : Observable<any> {
    let res = this.http.get(
      url,
      {
        params : params
      }
    )
    //  Update the token in localstorage if available
    this.updateToken(res);
    // Return the response to the invoking method
    return res;
  }

  public postRequest(url, params) : Observable<any> {
    let res = this.http.post(
      url,
      {
        params : params
      }
    )
    //  Update the token in localstorage if available
    this.updateToken(res);
    // Return the response to the invoking method
    return res;
  }

  public updateToken(response) {
    if (response["auth"] !== undefined) {
      localStorage.setItem("auth", response["token"]);
    }
  }

}
