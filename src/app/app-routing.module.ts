import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './shared/components/sign-in/sign-in.component';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { LoginGuard } from './core/guards/login/login.guard';

const routes: Routes = [
	{ path: '', redirectTo: '/sign-in', pathMatch: 'full' },
	{ path: 'sign-in', component: SignInComponent },
	{
		path: 'dashboard',
		component: DashboardComponent,
		canActivate: [() => inject(LoginGuard).canActivate()],
		canDeactivate: [() => inject(LoginGuard).canDeactivate()],
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
