import { LightningElement,track} from 'lwc';
import { createMessageContext,subscribe } from 'lightning/messageService';
import samplelms from '@salesforce/messageChannel/lwcMessageChannel__c';

export default class ChildComponent extends LightningElement {

    context = createMessageContext();
    sub=null;
    @track recD='';
    connectedCallback(){
        this.sub=subscribe(this.context,samplelms,(message)=>{
            console.log('Message received in child component: ', message);
            this.recD=message;
        });
    }


    // sendValue={'Name':''};
    // handleClick(){
    //     // console.log('clicked');
    //     // this.sendValue.Name=this.template.querySelector('.textField').value;
    //     // console.log(this.sendValue);
        
    //     // // Creating a custom event and sending the value to parent component
    //     // const selectedEvent=new CustomEvent("sendv",{detail:this.sendValue});

    //     // // Dispatching the event to parent component
    //     // this.dispatchEvent(selectedEvent);
    // }
}