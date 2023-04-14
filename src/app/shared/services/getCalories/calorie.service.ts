import { Injectable } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';
import { HttpClient } from '@angular/common/http';
import {
	AngularFirestore,
	AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { map } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class CalorieService {
	constructor(private http: HttpClient, public afs: AngularFirestore) {}

	readonly configuration = new Configuration({
		apiKey: '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',
	});

	readonly openai = new OpenAIApi(this.configuration);

	getDataFromOpenAI(text: string) {
		return this.openai
			.createCompletion({
				model: 'text-davinci-003',
				prompt: text,
				max_tokens: 256,
			})
			.then(resp => {
				return resp.data.choices[0].text;
			});
	}
	generateImage(prompt: string) {
		const apiKey = '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';
		const endpoint = 'https://api.openai.com/v1/images/generations';

		const headers = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		};

		const data = {
			model: 'image-alpha-001',
			prompt: prompt,
			num_images: 1,
			size: '256x256',
			response_format: 'url',
		};

		return this.http.post(endpoint, data, { headers });
	}

	saveItem(id: string, foodEntry: any) {
		this.afs
			.collection('History')
			.doc(id)
			.update({
				userFoodHistory: firebase.firestore.FieldValue.arrayUnion(foodEntry),
			});
	}

	getData(id: string) {
		return this.afs
			.collection('History')
			.doc(`${id}`)
			.get()
			.pipe(
				map(docSnapshot => {
					if (docSnapshot.data()) {
						const data = JSON.parse(JSON.stringify(docSnapshot.data()));
						return data;
					} else {
						this.setHistoryDb(id);
						return {};
					}
				})
			);
	}

	deleteItem(id: string, foodItem: any) {
		let docRef = this.afs.doc(`History/${id}`);

		docRef.update({
			userFoodHistory: firebase.firestore.FieldValue.arrayRemove(foodItem),
		});
	}

	setHistoryDb(id: string) {
		const ref: AngularFirestoreDocument<any> = this.afs.doc(`History/${id}`);

		this.afs.collection('History').doc(id).set({
			userFoodHistory: [],
		});

		return ref.set(
			{},
			{
				merge: true,
			}
		);
	}
}
