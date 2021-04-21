import { Injectable } from "@angular/core";

import { HttpClient } from '@angular/common/http';

import { 
    createOrder, 
    createShippingAddress, 
    getShippingByUserId, 
    removeShippingAddress, updateShippingAddress } from '../shared/api/api';
import { CheckoutModel } from './checkout.model';



@Injectable({
    providedIn: 'root'
})

export class CheckoutService {

    constructor(private http: HttpClient) {}

    // Create Order
    createOrder(checkoutInfo) {
        return this.http.post<CheckoutModel>(`${createOrder}`, checkoutInfo);
    }

    // create shipping address
    createShippingAddress(address) {
        return this.http.post<CheckoutModel>(`${createShippingAddress}`, address);
    }

    // get shipping address
    getShippingAddressByUserId() {
        // const params = `?userId=${userToken}`;
        return this.http.get(`${getShippingByUserId}`);
    }

    // remove shipping address
    removeShippingAddressByUserId(id: number) {
        return this.http.delete(`${removeShippingAddress}` + id);
    }

    // update shipping address
    updatedShippingAddress(address: CheckoutModel) {
        return this.http.put(`${updateShippingAddress}` , address);
    }

    // create payment
    createPayment(orderId: number) {
        return this.http.post(`${createShippingAddress}`, orderId);
    }
}