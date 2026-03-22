import { LightningElement } from 'lwc';

export default class LifeCycleLwcTwo extends LightningElement {
    constructor() {
        super();
    }
    connectedCallback() {
        console.log('From Child Component connectedCallback called');
    }
    renderedCallback() {
        console.log('From Child Component renderedCallback called');
    }
    disconnectedCallback() {
        console.log('From Child Component disconnectedCallback called');
    }
    errorCallback(error, stack) {
        console.log(' From Child Component errorCallback called');
    }
}