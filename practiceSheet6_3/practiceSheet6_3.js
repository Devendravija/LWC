import { LightningElement, wire } from 'lwc';
import { subscribe, createMessageContext } from 'lightning/messageService';
import samplelms from '@salesforce/messageChannel/lwcMessageChannel__c';
import { refreshApex } from '@salesforce/apex';
import getOrdersCount from '@salesforce/apex/getOrders.getOrders';
import getOrders from '@salesforce/apex/getOrders.getOrdersC';

// const columns=[
//     {label:'Order Id',fieldName:'Name'},
//     {label:'Customer Name',fieldName:'Customer_Name__c'},
//     {label:'Product',fieldName:'Product__c'},
//     {label:'Quantity',fieldName:'Quantity__c'}
// ]
export default class PracticeSheet6_3 extends LightningElement {
   
    context = createMessageContext();
    subscription;
    totalOrder;
    recD;
    orders;
    wiredOrderResult;
    wiredOrderCount;
    // Wire service to get initial count
    @wire(getOrdersCount)
    wiredOrdersCount(result) {

        this.wiredOrderCount = result;
        const { data, error }=result;
        if (data) {
            this.totalOrder = data;
        }
        if (error) {
            console.error(error);
        }
        
    }


    // Wire service to get orders
    @wire(getOrders)
    wiredOrdersList(result){
        this.wiredOrderResult = result;
        const { data, error }=result;
        if (data) {
            let sortedData = [...data].sort(
            (a, b) => new Date(b.CreatedDate) - new Date(a.CreatedDate)
        );
        console.log(JSON.stringify(sortedData));
        
        this.orders = JSON.stringify(sortedData);

        }
        if (error) {
            console.error(error);
        }
    }


    // Lifecycle hook - must be lowercase "connectedCallback"
    connectedCallback() {
        this.subscription = subscribe(this.context, samplelms, (message) => {
            if (message) {
                this.recD = message;
            } else {
                this.recD = 'No Recent Orders Yet!';
            }
        refreshApex(this.wiredOrderCount);
        refreshApex(this.wiredOrderResult);
            
        });
    }
}