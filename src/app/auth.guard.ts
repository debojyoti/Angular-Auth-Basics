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
