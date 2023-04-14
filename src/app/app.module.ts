import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SignInComponent } from './shared/components/sign-in/sign-in.component';
import { AuthService } from './shared/services/auth/auth.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { LoginGuard } from './core/guards/login/login.guard';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

@NgModule({
	declarations: [AppComponent, SignInComponent, DashboardComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		HttpClientModule,
		AngularFireModule.initializeApp(environment.firebase),
		AngularFireAuthModule,
		NgbModule,
		AngularFirestoreModule,
	],
	providers: [AuthService, { provide: LoginGuard, useClass: LoginGuard }],
	bootstrap: [AppComponent],
})
export class AppModule {}
