import { ColdObservable } from "rxjs/internal/testing/ColdObservable";

export class DashboardModel {
    foodItems: IFoodItem[] = [];
    alerts: Alert[] = [
        {
            type: 'success',
            message: 'This is an success alert',
        },
        {
            type: 'info',
            message: 'This is an info alert',
        },
        {
            type: 'warning',
            message: 'Uh oh! The text you entered doesn\'t seem to be a name of a food item.',
        },
        {
            type: 'danger',
            message: 'This is a danger alert',
        },
        {
            type: 'primary',
            message: 'This is a primary alert',
        },
        {
            type: 'secondary',
            message: 'This is a secondary alert',
        },
        {
            type: 'light',
            message: 'This is a light alert',
        },
        {
            type: 'dark',
            message: 'This is a dark alert',
        },
    ];
    generateAlert(type: string): Alert[] {
        return Array.from(this.alerts.filter(alert => alert.type === type));
    }

}

export interface IFoodItem {
    foodItemName: string,
    caloriesPerServing: number,
    totalServings: number,
    imageUrl: string,
    isImageLoading?: boolean
    timeStamp: any;
}

export interface Alert {
    type: string;
    message: string;
}

export interface IfoodItemPayloadForDatabase {
    foodItemName: string,
    caloriesPerServing: number,
    totalServings: number,
    imageUrl: string,
    timeStamp: number
}

export class FoodItemPayloadForDatabase implements IfoodItemPayloadForDatabase {
    foodItemName: string;
    caloriesPerServing: number;
    totalServings: number;
    imageUrl: string;
    timeStamp: number;

    constructor(
        foodItemName: string,
        caloriesPerServing: number,
        totalServings: number,
        imageUrl: string,
        timeStamp: number) {
        this.foodItemName = foodItemName;
        this.totalServings = totalServings;
        this.caloriesPerServing = caloriesPerServing;
        this.imageUrl = imageUrl;
        this.timeStamp = timeStamp;
    }

    getSerializedObject() {
        return Object.assign({}, this);
    }
}

