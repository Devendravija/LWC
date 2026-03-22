import { LightningElement } from 'lwc';
import { createMessageContext,  releaseMessageContext,publish } from 'lightning/messageService';
import samplelms from '@salesforce/messageChannel/lwcMessageChannel__c';

export default class ParentComponent extends LightningElement {

    context = createMessageContext();

    data={'name':'Rajesh'};
    sendData(){
        this.data.Name=this.template.querySelector('.textField').value;
        publish(this.context,samplelms,this.data);
    }
    //receivedData;
    // ReceivingData(event){
    //     this.receivedData=event.detail;
    //     console.log('Received data from child component: ', JSON.parse(JSON.stringify(this.receivedData)));
    // }

}