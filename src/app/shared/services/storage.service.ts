import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { Subject } from 'rxjs';
import { baseUrl } from '../api/api';
import { CartItem } from '../models/cartItem';
import { User } from '../models/user';



// import User from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  cartItems: CartItem[];
  cartItemsChange: Subject<CartItem[]> = new Subject<CartItem[]>();
  constructor()  {
    this.cartItemsChange.subscribe((value) => {
        this.cartItems = value;
    });
}
  baseUrl = baseUrl;
  arabicFlag = {
    code: 'ar-EG',
    image: 'assets/images/flags/ar.svg',
    name: 'العربية',
  };
  englishFlag = {
    code: 'en-US',
    image: 'assets/images/flags/gb.svg',
    name: 'English',
  };

  danishFlag = {
    code: 'da-DA',
    image: 'assets/images/flags/da.svg',
    name: 'Danish',
  };

  user: User;

  // Lang Direction rtl and ltr
  getLangDirection() {
    if (this.existsStorage('lang')) {
      if (JSON.parse(this.getStorage('lang')).name == 'العربية') return true;
    }
    // this.setLang({
    //   name: 'English',
    //   image: 'assets/images/flags/gb.svg',
    //   code: 'en-US',
    // });
    return false;
  }

  // create lang in local
  setLang(value) {
    return this.setStorage('lang', JSON.stringify(value)); // value // {name: 'العربية', image: flag}
  }

  // get lang
  getLang() {
    const langFound = this.existsStorage('lang');
    if (langFound) {
      return JSON.parse(this.getStorage('lang'));
    } else {
      this.setLang({
        name: 'English',
        image: 'assets/images/flags/gb.svg',
        code: 'en-US',
      });
      return JSON.parse(this.getStorage('lang'));
    }
  }
  
  getStorage(key: string) { // get LocalStorage
    return localStorage.getItem(key);
  }

  setStorage(key, value) { // create LocalStorage
    return localStorage.setItem(key, value);
  }

  removeStorage(key: string) { // Remove LocalStorage By key
    return localStorage.removeItem(key);
  }

  removeKeysStorage(keys: string[]) {
    keys.forEach((key) => this.removeStorage(key));
  }

  existsStorage(key) { // Check on key in localStorage
    return !!localStorage.getItem(key); // return true or false
  }

  clearStorage() {
    return localStorage.clear();
  }

  setAccessToken(value) {
    var tokenInfo = this.getDecodedAccessToken(value); // decode token
    this.setUser(tokenInfo);
    return this.setStorage('access_token', value);
  }

  setUser(value) {
    return this.setStorage('user', JSON.stringify(value));
  }
  setLanguage(value) {
    return this.setStorage('language', JSON.stringify(value));
  }

  setExpiresIn(value) {
    return this.setStorage('expires_in', value);
  }

  getAccessToken() {
    return this.getStorage('access_token');
  }

  getExpiresIn() {
    return this.getStorage('expires_in');
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }
  getUser(): User {
    var value = JSON.parse(this.getStorage('user')); // Json.parse convert text or string to javascript object '{}' >> {}
    this.user = new User();
    this.user.FirstName = value.firstname;
    this.user.LastName = value.lastname;
    // this.user.Role = value.role;
    this.user.Email = value.email;
    // this.user.permissions = value.permissions;
    return this.user;
  }

  getFlag(langName: string) {
    if (langName === 'ar-EG') {
      return this.arabicFlag;
    } else if (langName === 'en-US') {
      return this.englishFlag;
    }else if (langName === 'da-DA') {
      return this.danishFlag;
    }
  }
  
  getCartItems():CartItem[]{
    if(this.existsStorage('cartList')){
      this.cartItems =  JSON.parse(this.getStorage('cartList'));
      return this.cartItems;
    }else{
      return [];
    }

  }
 
  getCartTotal():number{
   let totalCost = 0;
    for (let item of this.cartItems) {
      totalCost += item.pricePerItem * item.amount;
    }
    return totalCost;
  }
  setCartItems(value){
    this.cartItemsChange.next(value);
    return this.setStorage('cartList', JSON.stringify(value));

  }
  validBase64(value: string): string {
    return value.substr(value.indexOf(',') + 1);
  }

  // handle image base64 
  toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  correctImageUrl(...args) {
    if (typeof args[0] === 'string') {
      const url = args[0].replace(/\\/g, '/');
      const newUrl = `${this.baseUrl}/${url}`;
      return newUrl;
    } else if (args[0] instanceof Array) {
      const images = [];
      args[0].forEach((img) => images.push(this.correctImageUrl(img)));
      return images;
    }
  }
}
