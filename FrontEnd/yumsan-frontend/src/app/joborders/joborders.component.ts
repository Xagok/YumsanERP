import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { JobordersService, JobOrder } from '../joborders.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-joborders',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSortModule, MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule],
  templateUrl: './joborders.component.html',
  styleUrls: ['./joborders.component.scss']
})
export class JobordersComponent implements OnInit {
  displayedColumns: string[] = [
    'jobNumber', 'customerName', 'description',
    'orderDate', 'finishDate', 'deliveryDate', 'invoiceDate',
    'po', 'qty', 'orderedBy', 'deadline', 'price', 'responsible'
  ];
  
  dataSource = new MatTableDataSource<JobOrder>();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private jobordersService: JobordersService) { }

  newJobOrder: JobOrder = {
    id: 0,
    jobNumber: 0,
    customerId: 0,
    orderDate: new Date().toISOString(),
    finishDate: new Date().toISOString(),
    deliveryDate: new Date().toISOString(),
    invoiceDate: new Date().toISOString(),
    qty: 0,
    deadline: new Date().toISOString(),
    price: 0,
    description: '',
    orderedBy: '',
    po: ''
    // add defaults or initial values as needed
  };

  addJobOrder() {
    this.jobordersService.addJobOrder(this.newJobOrder).subscribe({
      next: (response) => {
        this.dataSource.data = [...this.dataSource.data, response];
        this.newJobOrder = { ...this.newJobOrder, jobNumber: 0, description: '' };
        // reset other fields as needed
      },
      error: (err) => console.error('Error adding job order:', err)
    });
  }

  ngOnInit(): void {
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
  
}
