import { Component } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
	constructor(public auth: AuthService, private titleService: Title) {
		this.titleService.setTitle('Cal Track');
	}

	ngOnInit() {}
}
