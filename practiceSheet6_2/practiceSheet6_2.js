import { LightningElement, track } from 'lwc';
import { subscribe, createMessageContext } from 'lightning/messageService';
import samplelms from '@salesforce/messageChannel/lwcMessageChannel__c';


export default class PracticeSheet6_2 extends LightningElement {
    context = createMessageContext();
    sub = null;
    @track recD='No Order Yet!';
    @track obj={};
    @track keys = [];


    connectedCallback() {
        this.sub = subscribe(this.context, samplelms, (message) => {
            if (!message || Object.keys(message).length === 0) {
                this.recD = 'No Order Yet!';
                this.obj={};
                this.keys = [];
            } else {
                this.recD = '';
                this.obj=message;
                this.keys = Object.keys(message);
                console.log(JSON.stringify(message));
            }
        });

    }
    get hasData() {
        return this.keys.length > 0;
    }

}