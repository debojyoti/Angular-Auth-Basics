import { Component, OnInit } from '@angular/core';
import { ConnectorService } from '../connector.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public errorMsg;
  public email;
  public password;
  public loginUrl;

  constructor(
    private connector : ConnectorService,
    private router : Router
  ) { }

  ngOnInit() {
    this.loginUrl = "http://localhost/index.php"
  }

  login() {
    let credentials = {
      "email" : this.email,
      "password" : this.password
    };
    this.connector.getRequest(this.loginUrl, credentials).subscribe(res => {
      if (res["auth"] !== undefined) {
        
        localStorage.setItem("auth", res["auth"]);
        
        // redirect to profile page
        this.router.navigate(["/profile"]);
      }
    })
    
    
  }

}
