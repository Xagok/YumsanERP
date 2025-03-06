import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { CustomersService, Customer } from '../customers.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditCustomerDialogComponent } from '../customers/edit-customer-dialog.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'actions'];
  dataSource = new MatTableDataSource<Customer>();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private customersService: CustomersService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchCustomers();
  }

  fetchCustomers() {
    this.customersService.getCustomers().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.sort = this.sort;
      },
      error: (err) => console.error('Error fetching customers:', err)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addCustomer() {
    const dialogRef = this.dialog.open(EditCustomerDialogComponent, {
      height: '800px',
      width: '1000px',
      data: { id: null, name: '', email: '', phone: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customersService.addCustomer(result).subscribe({
          next: (response) => {
            this.dataSource.data = [...this.dataSource.data, response];
          },
          error: (err) => console.error('Error adding customer:', err)
        });
      }
    });
  }

  editCustomer(customer: Customer) {
    const dialogRef = this.dialog.open(EditCustomerDialogComponent, {
      height: '800px',
      width: '1000px',
      data: { ...customer }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customersService.updateCustomer(result.id, result).subscribe({
          next: (updatedCustomer) => {
            const index = this.dataSource.data.findIndex(c => c.id === updatedCustomer.id);
            if (index !== -1) {
              this.dataSource.data[index] = updatedCustomer;
              this.dataSource._updateChangeSubscription();
            }
          },
          error: (err) => console.error('Error updating customer:', err)
        });
      }
    });
  }

  deleteCustomer(id: number) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customersService.deleteCustomer(id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(customer => customer.id !== id);
        },
        error: (err) => console.error('Error deleting customer:', err)
      });
    }
  }
}
