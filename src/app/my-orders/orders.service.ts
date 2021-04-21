import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getOrderDetails, listOfOrder } from 'src/app/shared/api/api';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient) { }

  // get orders list
  getListOfOrders(currentPage: number, orderPerPage: number) {
    const params = `?Offset=${currentPage}&Limit=${orderPerPage}`
    return this.http.get(`${listOfOrder}` + params);
  }

  // get orders details
  getOrderDetails(orderId: number) {
    return this.http.get(`${getOrderDetails}?orderId=${orderId}`);
  }
}
