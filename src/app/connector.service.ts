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

  public getRequest(params) {
    let res = this.http.get(
      "http://dp.localhost.com/index.php",
      {
        params : params
      }
    ).subscribe(res => {
      //  Update the token in localstorage if available
      this.updateToken(res);
      // Return the response to the invoking method
      return res;
    });
  }

  public postRequest(params) {

  }

  public updateToken(response) {
    if (response["token"] !== undefined) {
      localStorage.setItem("token", response["token"]);
    }
  }

}
