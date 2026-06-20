import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toastService = inject(ToastService);
  const userRole = localStorage.getItem('userRole');

  if (userRole === 'admin') {
    return true; // Allow access if admin
  } else {
    toastService.show('Access denied! This section is for administrators only.', 'danger');
    return router.createUrlTree(['/products']);
  }
};