import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Customer {
  id?: number;
  name?: string;
  address?: string;
  contact?: string;
}


export interface Employee {
  id?: number;
  name?: string;
  surname?: string;
  address?: string;
  email?: string;
  mobile?: string;
}


export interface JobOrder {
  id?: number;
  jobNumber: number;
  customerId: number;
  customer?: Customer;
  description?: string;
  orderDate: Date;     // Consider using ISO strings or converting to Date objects as needed
  finishDate: Date;
  deliveryDate: Date;
  invoiceDate: Date;
  po?: string;
  qty: number;
  orderedBy?: string;
  deadline: Date;
  price: number;
  employeeId?: number;
  employee?: Employee;
}


@Injectable({
  providedIn: 'root'
})
export class JobordersService {
  private apiUrl = 'http://localhost:5199/api/joborders'; // Update with your actual API endpoint

  constructor(private http: HttpClient) {}

  getJobOrders(): Observable<JobOrder[]> {
    return this.http.get<JobOrder[]>(this.apiUrl);
  }
  addJobOrder(jobOrder: JobOrder): Observable<JobOrder> {
    return this.http.post<JobOrder>(this.apiUrl, jobOrder);
  }
  deleteJobOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  updateJobOrder(id: number, jobOrder: JobOrder): Observable<JobOrder> {
    return this.http.put<JobOrder>(`${this.apiUrl}/${id}`, jobOrder);
  }
}
