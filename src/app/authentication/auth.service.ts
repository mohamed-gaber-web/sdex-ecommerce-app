import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { RegisterCustomer } from "src/app/shared/models/customer-register";
import { LoginCustomer } from "src/app/shared/models/customer-login";
import { userRegister } from "src/app/shared/api/api";
import { userLogin } from "src/app/shared/api/api";
import { StorageService } from "src/app/shared/services/storage.service";




@Injectable({
    providedIn: 'root',
  })

  export class AuthService {

  constructor(private http: HttpClient, private storageService: StorageService ) {}

  get IsLoggedIn() {
    return this.storageService.existsStorage('user'); 
  }

  signInUser(user: LoginCustomer) {
    return this.http.post(`${userLogin}`, user);
  }

  getUser() {
    if (this.storageService.existsStorage('user')) {
      return this.storageService.getUser();
    }
  }

  registerCustomer(user: RegisterCustomer) {
    return this.http.post(`${userRegister}`, user);
  }

}