import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-job-order-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './edit-joborder-dialog.component.html',
  styleUrls: ['./edit-joborder-dialog.component.scss']
})
export class EditJobOrderDialogComponent {
  jobOrderForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditJobOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.jobOrderForm = this.fb.group({
      jobNumber: [data.jobNumber, Validators.required],
      customerId: [data.customerId, Validators.required],
      description: [data.description],
      orderDate: [data.orderDate, Validators.required],
      finishDate: [data.finishDate],
      deliveryDate: [data.deliveryDate],
      invoiceDate: [data.invoiceDate],
      po: [data.po],
      qty: [data.qty],
      orderedBy: [data.orderedBy],
      deadline: [data.deadline],
      price: [data.price],
      employeeId: [data.employeeId]
      // Add other fields as necessary
    });
  }

  onSave() {
    if (this.jobOrderForm.valid) {
      this.dialogRef.close(this.jobOrderForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
