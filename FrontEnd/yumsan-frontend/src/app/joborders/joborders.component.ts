import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { JobordersService, JobOrder } from '../joborders.service';

@Component({
  selector: 'app-joborders',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './joborders.component.html',
  styleUrls: ['./joborders.component.scss']
})
export class JobordersComponent implements OnInit {
  jobOrders: JobOrder[] = [];
  displayedColumns: string[] = [
    'jobNumber', 'customerName', 'description',
    'orderDate', 'finishDate', 'deliveryDate', 'invoiceDate',
    'po', 'qty', 'orderedBy', 'deadline', 'price', 'responsible'
  ];

  constructor(private jobordersService: JobordersService) { }

  ngOnInit(): void {
    this.jobordersService.getJobOrders().subscribe({
      next: (data) => this.jobOrders = data,
      error: (err) => console.error('Error fetching job orders:', err)
    });
  }
}
