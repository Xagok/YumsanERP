import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JobordersComponent } from './joborders/joborders.component';
import { EmployeesComponent } from './employees/employees.component';
import { CustomersComponent } from './customers/customers.component';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay()), provideAnimationsAsync(), provideHttpClient(), provideRouter([
    { path: 'dashboard', component: DashboardComponent},
    { path: 'joborders', component: JobordersComponent},
    { path: 'employees', component: EmployeesComponent},
    { path: 'customers', component: CustomersComponent},
    { path: '**', redirectTo: 'dashboard'}
    //add other components like this
  ])]
};
