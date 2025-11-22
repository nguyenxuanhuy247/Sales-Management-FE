import {Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {DetailProductComponent} from './components/detail-product/detail-product.component';
import {OrderComponent} from './components/order/order.component';
import {OrderDetailComponent} from './components/detail-order/order.detail.component';
import {UserProfileComponent} from './components/user-profile/user.profile.component';
import {AdminComponent} from './components/admin/admin.component';
import {AuthGuardFn} from './guards/auth.guard';
import {AdminGuardFn} from './guards/admin.guard';
import {AuthCallbackComponent} from './components/auth-callback/auth-callback.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },  
  { path: 'auth/google/callback', component: AuthCallbackComponent },
  { path: 'auth/facebook/callback', component: AuthCallbackComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products/:id', component: DetailProductComponent },  
  { path: 'orders', component: OrderComponent, canActivate:[AuthGuardFn] },
  { path: 'user-profile/:id', component: UserProfileComponent, canActivate:[AuthGuardFn] },
  { path: 'orders/:id', component: OrderDetailComponent },
  //Admin   
  { 
    path: 'admin', 
    component: AdminComponent, 
    canActivate:[AdminGuardFn] 
  },      
];
