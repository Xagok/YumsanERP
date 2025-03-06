import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { JobordersService, JobOrder, Customer } from '../joborders.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule, MatDatepickerIntl } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core';
import { ChangeDetectorRef } from '@angular/core';
import { CustomersService } from '../customers.service';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditJobOrderDialogComponent } from './edit-joborder-dialog.component';

import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-joborders',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, MatOptionModule, MatSelectModule, MatIconModule, MatDialogModule],
  templateUrl: './joborders.component.html',
  styleUrls: ['./joborders.component.scss'],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }]
})
export class JobordersComponent implements OnInit {
  displayedColumns: string[] = [
    'jobNumber', 'customerName', 'description',
    'orderDate', 'finishDate', 'deliveryDate', 'invoiceDate',
    'po', 'qty', 'orderedBy', 'deadline', 'price', 'responsible', 'actions'
  ];

  dataSource = new MatTableDataSource<JobOrder>();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private jobordersService: JobordersService,
    private cdr: ChangeDetectorRef,
    private customerService: CustomersService,
    private dialog: MatDialog // Add MatDialog to constructor
  ) { }

  customers: Customer[] = [];

  newJobOrder: JobOrder = {
    //    id: 0,
    jobNumber: 0,
    customerId: 1,
    orderDate: new Date(),
    finishDate: new Date(),
    deliveryDate: new Date(),
    invoiceDate: new Date(),
    qty: 0,
    deadline: new Date(),
    price: 0,
    description: '',
    orderedBy: '',
    po: '',
    employeeId: 1,
    // add defaults or initial values as needed
  };

  addJobOrder() {
    debugger
    this.jobordersService.addJobOrder(this.newJobOrder).subscribe({
      next: (response) => {
        this.dataSource.data = [...this.dataSource.data, response];
        this.newJobOrder = { ...this.newJobOrder, jobNumber: 0, description: '' };
        // reset other fields as needed
      },
      error: (err) => console.error('Error adding job order:', err)
    });
  }

  deleteJobOrder(id: number) {
    if (confirm('Are you sure you want to delete this job order?')) {
      this.jobordersService.deleteJobOrder(id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(order => order.id !== id);
        },
        error: err => console.error('Error deleting job order:', err)
      });
    }
  }

  editJobOrder(order: JobOrder) {
    const dialogRef = this.dialog.open(EditJobOrderDialogComponent, {
      height: '800px', // Increase height
      width: '1600px',  // Increase width
      data: { ...order, customers: this.customers } // Pass customers data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the job order in the database
        this.jobordersService.updateJobOrder(result.id, result).subscribe({
          next: updatedOrder => {
            // Update the job order in the data source
            const index = this.dataSource.data.findIndex((order: any) => order.id === updatedOrder.id);
            if (index !== -1) {
              this.dataSource.data[index] = updatedOrder;
              this.dataSource._updateChangeSubscription();
              this.refreshCustomerNames();
            }
          },
          error: err => console.error('Error updating job order:', err)
        });
      }
    });
  }

  openAddJobOrderDialog() {
    const dialogRef = this.dialog.open(EditJobOrderDialogComponent, {
      height: '800px', // Increase height
      width: '1600px',  // Increase width
      data: { ...this.newJobOrder, customers: this.customers } // Pass customers data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.newJobOrder = result; // Update newJobOrder with form data
        this.addJobOrder();
      }
    });
  }

  updateJobOrder() {
    if (this.newJobOrder.id !== undefined) {
      this.jobordersService.updateJobOrder(this.newJobOrder.id, this.newJobOrder)
        .subscribe({
          next: updatedOrder => {
            debugger
            const index = this.dataSource.data.findIndex(order => order.id === updatedOrder.id);
            if (index !== -1) {
              this.dataSource.data[index] = updatedOrder;
              this.dataSource._updateChangeSubscription(); // Refresh the table
            }
            this.newJobOrder = { ...this.newJobOrder, jobNumber: 0, description: '' };
          },
          error: err => console.error('Error updating job order:', err)
        });
    } else {
      console.error('JobOrder ID is undefined. Cannot update.');
    }
  }

  resetForm() {
    this.newJobOrder = {
      jobNumber: 0,
      customerId: 0,
      description: '',
      orderDate: new Date(),
      finishDate: new Date(),
      deliveryDate: new Date(),
      invoiceDate: new Date(),
      po: '',
      qty: 0,
      orderedBy: '',
      deadline: new Date(),
      price: 0,
      employeeId: 0
    };
  }

  ngOnInit(): void {
    // Fetch customers
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
      },
      error: (err) => console.error('Error fetching customers:', err)
    });

    //fetch job orders
    this.jobordersService.getJobOrders().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.sort = this.sort;
      },
      error: (err) => console.error('Error fetching job orders:', err)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  refreshCustomerNames() {
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.dataSource.data = this.dataSource.data.map(order => {
          order.customer = this.customers.find(customer => customer.id === order.customerId);
          return order;
        });
        this.dataSource._updateChangeSubscription();
      },
      error: (err) => console.error('Error refreshing customer names:', err)
    });
  }
}
