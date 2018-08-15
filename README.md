### Angular 6 jwt login

##### Built with
1) A service for http communiction (`connector.service.ts`)
2) Routes and Routing Module 
3) Route Guard
4) Http Interceptor
5) JWT package: `@auth0/angular-jwt` (Optional)

##### Setup steps

Create 2 components : login and profile
```
ng g c login --spec false
ng g c profile --spec false
```
Create a service for http connection with backend
```
ng g s connector --spec false
```
Add `@auth0/angular-jwt` package to play with jwt (Optional)
```
npm i --save @auth0/angular-jwt
```
Create a Routing Module
```
ng g m app-routing --flat --module=app --spec false
```
Modify the routing module as following
```typescript
import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

```
Put the `<router-outlet></router-outlet>` in `app.component.html`


# 1  &nbsp;  &nbsp; Use http interceptor

### 1.1  &nbsp;  &nbsp; Create a service to intercept token in each requests

```
ng g s token-interceptor --spec false
```

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req, next) {
    
    if (this.getToken()) {
      let tokenizedReq = req.clone({
        setHeaders : {
          Authorization : "Bearer "
        }
      })
  
      return next.handle(tokenizedReq);
    } else {
      return next.handle(req);
    }

  }

  private getToken() {
    if (!!localStorage.getItem("token")) {
      return localStorage.getItem("token")
    } else {
      return false;
    }
  }
}
```
### 1.2   &nbsp;  &nbsp; Register the interceptor service in the module

```typescript
...
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from './token-interceptor.service';
...

@NgModule({
  ...
  providers: [
    ...,
    TokenInterceptorService, 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ]
})
export class AppRoutingModule { }

```


# 2  &nbsp;  &nbsp; Create a service to handle all http requests

We will create a seperate service that will handle all http requests(get + post) and will also take care of authorization token

### 2.1  &nbsp;  &nbsp; Create the service

```
ng g s connector --spec false
```
Content of `connector.service.ts`

```typescript

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
```

# 3  &nbsp;  &nbsp; Create a router guard to protect authorized pages

### 3.1  &nbsp;  &nbsp; Create the guard class

```
ng g guard auth --spec false
```
Content of `auth.guard.ts`

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private router : Router
  ) {}

  canActivate()  {
    
    if (!this.checkToken()) {
      // not allowed, redirect to login
      this.router.navigate(["/login"]);
      return false;
    } else {
      // allowed
      return true;
    } 
  }

  public checkToken() {
    return !!localStorage.getItem("auth");
  }
}

```

# 4  &nbsp;  &nbsp; Create a separate routing module

```
ng g module app-routing 
```
Content of `app-routing.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { TokenInterceptorService } from './token-interceptor.service';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { 
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [AuthGuard] 
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full'
  },
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  providers: [
    TokenInterceptorService, 
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ]
})
export class AppRoutingModule { }

```

# 5  &nbsp;  &nbsp; Modify the content of login component

Content of `login.component.ts`

```typescript
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

```