### Angular 6 jwt login

##### Built with
1) A service for http communiction (`connector.service.ts`)
2) Routing
3) Route Guard
4) Http Interceptor
5) JWT package: `@auth0/angular-jwt`

##### Setup steps

Create 2 components - login and profile
```
ng g c login --spec false
ng g c profile --spec false
```
Create a service for http connection with backend
```
ng g s connector --spec false
```


