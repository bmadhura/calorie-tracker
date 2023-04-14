import { AuthService, User } from '../../services/auth/auth.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CalorieService } from './../../services/getCalories/calorie.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
	Alert,
	DashboardModel,
	FoodItemPayloadForDatabase,
	IFoodItem,
} from './dashboard.model';
import { Title } from '@angular/platform-browser';

declare var webkitSpeechRecognition: any;

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
	input!: string;
	response: any;
	imageUrl!: any;

	recognition = new webkitSpeechRecognition();
	speechToText: any;
	recordingStarted: any;
	dashboardModel = new DashboardModel();
	alerts: Alert[] = [];

	foodEntry: any;
	userInfo!: User;
	indexTobeDeleted!: number;

	constructor(
		private calService: CalorieService,
		private modalService: NgbModal,
		private ref: ChangeDetectorRef,
		private authservice: AuthService,
		private titleService: Title
	) {
		this.recognition.lang = 'en-US';
		this.recognition.interimResults = false;
		this.recognition.maxAlternatives = 1;
		this.titleService.setTitle('Dashboard');
	}

	ngOnInit(): void {
		this.recognition.onresult = (event: any) => {
			this.speechToText = event?.results[0][0].transcript;
			console.log(this.speechToText);
			// setTimeout(() => this.speechToText = event?.results[0][0].transcript, 0);
			// this.ref.detectChanges();
		};

		this.userInfo = this.authservice.userData;

		if (!this.userInfo) {
			const userfromLocal = JSON.parse(localStorage.getItem('user')!);
			this.userInfo = userfromLocal;
		}

		this.calService.getData(this.userInfo.uid).subscribe(res => {
			this.dashboardModel.foodItems = res.userFoodHistory;
		});
	}

	onDoneClick() {
		const inputText = this.input;
		this.input = '';
		const prompt = `Please create a JSON parsable string that contains information on the calorie content of a ${inputText}. The string should include the following fields: "foodItemName", "caloriesPerServing", and "totalServings". Please populate the "foodItemName" field with the name of the food item provided, and provide the corresponding calorie information for a single serving size. For example, if I wanted to know the calorie content of a banana, the string would look something like this: {"foodItemName":"banana", "caloriesPerServing":105, "totalServings":1}. Thank you.`;
		this.calService
			.getDataFromOpenAI(prompt)
			.then((resp: string | undefined) => {
				if (resp) {
					// hack to deal with response which is non json parsable string
					resp = resp.replaceAll('\n', '');
					resp = resp.replaceAll('\\', '');
					const respObj = JSON.parse(resp);
					const caloriesPerServing = respObj.caloriesPerServing;
					if (resp && caloriesPerServing === 0) {
						this.alerts = this.dashboardModel.generateAlert('warning');
					} else {
						let index = this.dashboardModel.foodItems?.length
							? this.dashboardModel.foodItems.length
							: 0;
						let tempArr = this.dashboardModel.foodItems?.length
							? [
									...this.dashboardModel.foodItems,
									{ ...respObj, timeStamp: Date.now(), isImageLoading: true },
							  ]
							: [{ ...respObj, timeStamp: Date.now(), isImageLoading: true }];
						this.dashboardModel.foodItems = tempArr;
						this.calService.generateImage(inputText).subscribe({
							next: (response: any) => {
								this.dashboardModel.foodItems[index].imageUrl =
									response.data[0].url;
								this.dashboardModel.foodItems[index].isImageLoading = false;
								console.log(this.dashboardModel.foodItems);
								// console.log(new Date().toUTCString);
							},
							error: error => {},
							complete: () => {
								const detailsToBeSaved = this.dashboardModel.foodItems[index];
								// payload to save into database
								const foodItemPayload: FoodItemPayloadForDatabase =
									new FoodItemPayloadForDatabase(
										detailsToBeSaved.foodItemName,
										detailsToBeSaved.caloriesPerServing,
										detailsToBeSaved.totalServings,
										detailsToBeSaved.imageUrl,
										Date.now()
									);
								this.calService.saveItem(
									this.userInfo.uid,
									foodItemPayload.getSerializedObject()
								);
							},
						});
					}
				}
			});
	}

	logout() {
		this.authservice.SignOut();
	}
	startRecognition() {
		if (this.recordingStarted) {
			// logic to stop recognition
			this.recognition.stop();
		} else {
			// logic to start recognition
			this.recognition.start();
		}
		this.recordingStarted = !this.recordingStarted;
	}

	openVerticallyCenteredModal(content: any) {
		this.speechToText = '';
		// opening bootstrap modal dialog
		this.modalService
			.open(content, {
				ariaLabelledBy: 'modal-basic-title',
				size: 'lg',
				centered: true,
			})
			.result.then(result => {});
	}

	closeModal(modal: any) {
		this.input = this.speechToText; //populate textarea with spoken text
		modal?.close('Close click');
	}

	close(alert: Alert) {
		this.alerts.splice(this.alerts.indexOf(alert), 1);
	}

	openDeleteConfirmationModal(content: any, index: number) {
		this.speechToText = '';
		// opening bootstrap modal dialog
		this.modalService
			.open(content, {
				ariaLabelledBy: 'modal-basic-title',
				size: 'lg',
				centered: true,
			})
			.result.then(result => {});

		this.indexTobeDeleted = index;
	}

	deleteItem(modal: any) {
		this.calService.deleteItem(
			this.userInfo.uid,
			this.dashboardModel.foodItems[this.indexTobeDeleted]
		);

		this.dashboardModel.foodItems.splice(this.indexTobeDeleted, 1);

		this.closeModal(modal);
	}
}
