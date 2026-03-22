import { LightningElement ,track} from 'lwc';
import { createMessageContext,subscribe } from 'lightning/messageService';
import samplelms from '@salesforce/messageChannel/lwcMessageChannel__c';

export default class PracticeSheet4_second extends LightningElement {
    context = createMessageContext();
    sub=null;
    @track recD='';
    connectedCallback(){
        this.sub=subscribe(this.context,samplelms,(message)=>{
            console.log('Message received in child component: ', message);
            this.recD=message;
        });
    }

    
}