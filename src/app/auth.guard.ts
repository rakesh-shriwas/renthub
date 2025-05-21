import { CanActivateChildFn, Router } from '@angular/router';
import { CommonService } from './services/common.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateChildFn = (childRoute, state) => {
  const authService = inject(CommonService);
  const routerRef = inject(Router);
  const authDetails = localStorage.getItem('loggedInUser');
  if(authDetails){
    return true
  }
  routerRef.navigate(['/public', 'post'])
  return false;
};