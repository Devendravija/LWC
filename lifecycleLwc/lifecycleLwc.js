import { LightningElement } from 'lwc';

export default class LifecycleLwc extends LightningElement { 

    flag = true;

    arr = ['Salesforce', 'LWC', 'Lightning Web Components', 'JavaScript', 'HTML', 'CSS'];// Array or collection

    arrInfo=[{"Name": "Salesforce","NumberOfEmployees": 500 },{"Name": "Cyntexa","NumberOfEmployees": 100 }];// Array of objects


    handleClick(){
        this.flag = false;
    }
    constructor() {
        super();
    }
    connectedCallback() {
        console.log('From Parent Component connectedCallback called');
    }
    renderedCallback() {
        console.log('From Parent Component renderedCallback called');
    }
    disconnectedCallback() {
        console.log('From Parent Component disconnectedCallback called');
    }
    errorCallback(error, stack) {
        console.log(' From Parent Component errorCallback called');
    }
}