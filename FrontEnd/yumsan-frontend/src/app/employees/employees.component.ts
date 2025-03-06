import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesService, Employee } from '../employees.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditEmployeeDialogComponent } from '../employees/edit-employee-dialog.component';
import { MatIconModule } from '@angular/material/icon';

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
    FormsModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'surname', 'email', 'mobile', 'address', 'actions'];
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

  constructor(private employeesService: EmployeesService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees() {
    this.employeesService.getEmployees().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.sort = this.sort;
      },
      error: (err) => console.error('Error fetching employees:', err)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddEmployeeDialog() {
    const dialogRef = this.dialog.open(EditEmployeeDialogComponent, {
      height: '800px',
      width: '1000px',
      data: { ...this.newEmployee }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeesService.addEmployee(result).subscribe({
          next: (response) => {
            this.dataSource.data = [...this.dataSource.data, response];
          },
          error: (err) => console.error('Error adding employee:', err)
        });
      }
    });
  }

  addEmployee() {
    const dialogRef = this.dialog.open(EditEmployeeDialogComponent, {
      height: '800px',
      width: '1000px',
      data: { ...this.newEmployee }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeesService.addEmployee(result).subscribe({
          next: (response) => {
            this.dataSource.data = [...this.dataSource.data, response];
          },
          error: (err) => console.error('Error adding employee:', err)
        });
      }
    });
  }

  editEmployee(employee: Employee) {
    const dialogRef = this.dialog.open(EditEmployeeDialogComponent, {
      height: '800px',
      width: '1000px',
      data: { ...employee }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeesService.updateEmployee(result.id, result).subscribe({
          next: (updatedEmployee) => {
            const index = this.dataSource.data.findIndex(e => e.id === updatedEmployee.id);
            if (index !== -1) {
              this.dataSource.data[index] = updatedEmployee;
              this.dataSource._updateChangeSubscription();
            }
          },
          error: (err) => console.error('Error updating employee:', err)
        });
      }
    });
  }

  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeesService.deleteEmployee(id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(employee => employee.id !== id);
        },
        error: (err) => console.error('Error deleting employee:', err)
      });
    }
  }
}
