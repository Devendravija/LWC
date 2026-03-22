import { LightningElement ,track} from 'lwc';
import { createMessageContext,subscribe ,unsubscribe} from 'lightning/messageService';
import samplelms from '@salesforce/messageChannel/lwcMessageChannel__c';


export default class ThirdComponent extends LightningElement {
    context = createMessageContext();
    sub=null;
    @track recD='';
    subs(){
        this.sub=subscribe(this.context,samplelms,(message)=>{
            console.log('Message received in child component: ', message);
            this.recD=message;
            unsubscribe(this.sub);
            this.sub=null;
        });
    }
}