import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  id?: number;
  name?: string;
  surname?: string;
  address?: string;
  email?: string;
  mobile?: string;
}

@Injectable({ providedIn: 'root' })
export class EmployeesService {
  private apiUrl = 'http://localhost:5199/api/employees';

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.apiUrl);
  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.apiUrl, employee);
  }
}
