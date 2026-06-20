import { Routes } from '@angular/router';
import { MainLayout } from '../components/main-layout/main-layout';
import { Login } from '../components/login/login';
import { SignUp } from '../components/sign-up/sign-up';
import { authGuard } from '../guards/auth.guard';
import { adminGuard } from '../guards/admin.guard'; // Import new admin guard

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'signup', component: SignUp },
  {
    path: '',
    component: MainLayout,
    canActivateChild: [authGuard], 
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      
      { path: 'products', loadComponent: () => import('../components/master-products/master-products').then(c => c.MasterProducts) },
      
      { 
        path: 'wishlist', 
        loadComponent: () => import('../components/wishlist/wishlist').then(c => c.Wishlist) 
      },
      { 
        path: 'cart', 
        loadComponent: () => import('../components/cart/cart').then(c => c.Cart) 
      },
      { 
        path: 'orders', 
        loadComponent: () => import('../components/orders/orders').then(c => c.Orders) 
      },
      
      // Routes protected by the admin guard
      { path: 'admin', loadComponent: () => import('../components/admin-dashboard/admin-dashboard').then(c => c.AdminDashboard), canActivate: [adminGuard] },
      { path: 'admin/orders', loadComponent: () => import('../components/admin-orders/admin-orders').then(c => c.AdminOrders), canActivate: [adminGuard] },
      { path: 'product/add', loadComponent: () => import('../components/product-form/product-form').then(c => c.ProductForm), canActivate: [adminGuard] },
      { path: 'product/edit/:id', loadComponent: () => import('../components/product-form/product-form').then(c => c.ProductForm), canActivate: [adminGuard] }
    ]
  },
  { path: '**', loadComponent: () => import('../components/error/error').then(c => c.ErrorComponent) }
];