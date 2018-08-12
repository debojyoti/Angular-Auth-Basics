import { Component, OnInit } from '@angular/core';
import { ConnectorService } from '../connector.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public errorMsg;
  public email;
  public password;

  constructor(
    private connector : ConnectorService
  ) { }

  ngOnInit() {
  }

  login() {
    let credentials = {
      "email" : this.email,
      "password" : this.password
    };
    this.connector.getRequest(credentials)
  }

}
