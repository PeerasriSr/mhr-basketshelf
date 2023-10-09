import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NavbarComponent } from './component/navbar/navbar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PickupComponent } from './pages/pickup/pickup.component';

const routes: Routes = [
  {
    path: '',
    component: NavbarComponent,
    children: [
      {
        path: 'Dashboard',
        component: DashboardComponent,
      },
      {
        path: 'Pickup',
        component: PickupComponent,
      },

      {
        path: '',
        redirectTo: 'Dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
