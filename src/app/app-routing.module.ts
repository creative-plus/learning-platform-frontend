import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';
import { SignedInGuard } from './guards/signed-in.guard';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  { 
    path: 'login',
    component: LoginComponent,
    data: { hideDrawer: true, hideToolbar: true, animate: false },
    //canActivate: [NotSignedInGuard]
  },
  { 
    path: 'login/token/:token',
    component: ChangePasswordComponent,
    data: { hideDrawer: true, hideToolbar: true, animate: false },
    //canActivate: [NotSignedInGuard]
  },
  { path: 'trainer',
    loadChildren: () => import('./trainer/trainer.module').then(m => m.TrainerModule),
    canActivate: [SignedInGuard, RoleGuard],
    data: { role: 'trainer' }
  },
  { path: 'trainee',
    loadChildren: () => import('./trainee/trainee.module').then(m => m.TraineeModule),
    canActivate: [SignedInGuard, RoleGuard],
    data: { role: 'trainee' }
  },
  { path: '**', redirectTo: '', canActivate: [SignedInGuard, RoleGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
