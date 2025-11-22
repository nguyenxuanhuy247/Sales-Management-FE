import {Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {DetailProductComponent} from './components/detail-product/detail-product.component';
import {OrderComponent} from './components/order/order.component';
import {OrderDetailComponent} from './components/detail-order/order.detail.component';
import {UserProfileComponent} from './components/user-profile/user.profile.component';
import {AdminComponent} from './components/admin/admin.component';
import {AuthGuardFn} from './guards/auth.guard';
import {AdminGuardFn} from './guards/admin.guard';

export const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'products/:id', component: DetailProductComponent},
  {path: 'orders', component: OrderComponent, canActivate: [AuthGuardFn]},
  {path: 'user-profile/:id', component: UserProfileComponent, canActivate: [AuthGuardFn]},
  {path: 'orders/:id', component: OrderDetailComponent},
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuardFn]
  },
];

 