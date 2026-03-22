import { LightningElement,wire, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getOrderLogs from '@salesforce/apex/plateformEvent_OrderDashboardController.getOrderLogs';
import { subscribe, onError } from 'lightning/empApi';

const COLUMNS = [
    { label: 'Order Name', fieldName: 'Order_Name__c' },
    { label: 'Customer Name', fieldName: 'Customer_Name__c' },
    { label: 'Amount', fieldName: 'Amount__c', type: 'currency' },
    { label: 'Message', fieldName: 'Message__c' },
    { label: 'Event Time', fieldName: 'Event_Time__c', type: 'date' }
];
export default class PlateformEvent_orderDashboard extends LightningElement {
    columns = COLUMNS;
    @track data;
    wiredResult;
    channelName = '/event/Order_Event__e';

    @wire(getOrderLogs)
    wiredLogs(result){
        this.wiredResult = result;
        if(result.data){
            this.data = result.data;
        }
    }

    connectedCallback(){
        this.subscribeToEvent();
    }

    subscribeToEvent(){
        subscribe(this.channelName, -1, (event) => {
            this.handleEvent(event);
        });
    }

    handleEvent(event){
        refreshApex(this.wiredResult);
    }
}