import { Injectable } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat';
import { Router } from '@angular/router';
import {
	AngularFirestore,
	AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';

export interface User {
	uid: string;
	email: string;
	displayName: string;
	photoURL: string;
	emailVerified: boolean;
}

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	userData!: User;
	constructor(
		public afAuth: AngularFireAuth,
		private router: Router,
		public afs: AngularFirestore
	) {}
	// Sign in with Google
	GoogleAuth() {
		return this.AuthLogin(new GoogleAuthProvider()).then((res: any) => {
			this.router.navigate(['dashboard']);
		});
	}
	// Auth logic to run auth providers
	AuthLogin(provider: GoogleAuthProvider | firebase.auth.AuthProvider) {
		return this.afAuth
			.signInWithPopup(provider)
			.then(result => {
				this.SetUserData(result.user?.multiFactor);
			})
			.catch(error => {
				console.log(error);
			});
	}

	get isLoggedIn(): boolean {
		const user = localStorage.getItem('user');
		return user !== null;
	}

	SignOut() {
		return this.afAuth.signOut().then(() => {
			localStorage.removeItem('user');
			this.router.navigate(['sign-in']);
		});
	}

	SetUserData(multi: any) {
		const user = multi.user;
		const userRef: AngularFirestoreDocument<any> = this.afs.doc(
			`users/${multi.user.uid}`
		);
		this.userData = {
			uid: user.uid,
			email: user.email,
			displayName: user.displayName,
			photoURL: user.photoURL,
			emailVerified: user.emailVerified,
		};

		localStorage.setItem('user', JSON.stringify(multi.user));

		return userRef.set(this.userData, {
			merge: true,
		});
	}
}
