import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesService, Employee } from '../employees.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'surname', 'email', 'mobile', 'address'];
  dataSource = new MatTableDataSource<Employee>();

  newEmployee: Employee = {
    id: 0,
    name: '',
    surname: '',
    email: '',
    mobile: '',
    address: ''
  };

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private employeesService: EmployeesService) {}

  ngOnInit(): void {
    this.employeesService.getEmployees().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.sort = this.sort;
      },
      error: (err) => console.error('Error fetching employees:', err)
    });
  }

  addEmployee() {
    this.employeesService.addEmployee(this.newEmployee).subscribe({
      next: (employee) => {
        this.dataSource.data = [...this.dataSource.data, employee];
        this.newEmployee = { id: 0, name: '', surname: '', email: '', mobile: '', address: '' };
      },
      error: (err) => console.error('Error adding employee:', err)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
