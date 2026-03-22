import { LightningElement, track, wire } from 'lwc';
import productRecord from '@salesforce/apex/getProduct.getProductRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { publish, createMessageContext } from 'lightning/messageService';
import samplelms from '@salesforce/messageChannel/lwcMessageChannel__c';
import { createRecord} from 'lightning/uiRecordApi';

import ORDER_OBJECT from '@salesforce/schema/Order__c';
import ORDER_PRODUCT from '@salesforce/schema/Order__c.Product__c';
import ORDER_CUSTOMER from '@salesforce/schema/Order__c.Customer_Name__c';
import ORDER_QUANTITY from '@salesforce/schema/Order__c.Quantity__c';



export default class PracticeSheet6_1 extends LightningElement {
    context = createMessageContext();
    @track ALL_TYPES;
    @track options;

    @wire(productRecord, {})
    wiredProduct({ error, data }) {
        if (data) {
            this.ALL_TYPES = data;
            this.options = data.map(item => ({ label: item, value: item }));
            console.log(this.options);
        } else if (error) {
            console.error(error);
        }
    }

    handleClick() {
        let customerName = this.template.querySelector('[data-id="customername"]').value;
        let product = this.template.querySelector('[data-id="product"]').value;
        let quantity = this.template.querySelector('[data-id="quantity"]').value;

        if (!customerName || !product || !quantity) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please fill all the fields',
                    variant: 'error'
                })
            );
        } else {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Order Placed Successfully',
                    variant: 'success'
                })
            );
            
            this.sendData();
        }
    }

    sendData() {
        const datatoSend = {
            customerName: this.template.querySelector('[data-id="customername"]').value,
            product: this.template.querySelector('[data-id="product"]').value,
            quantity: this.template.querySelector('[data-id="quantity"]').value
        };
        publish(this.context, samplelms, datatoSend);

        this.createOrder();
    }

    // create Account Record that useing uiRecordApi
    createOrder() {
    const fields = {};
    fields[ORDER_CUSTOMER.fieldApiName] = this.template.querySelector('[data-id="customername"]').value;
    fields[ORDER_PRODUCT.fieldApiName] = this.template.querySelector('[data-id="product"]').value;
    fields[ORDER_QUANTITY.fieldApiName] = this.template.querySelector('[data-id="quantity"]').value;

    const recordInput = { apiName: ORDER_OBJECT.objectApiName, fields };
    createRecord(recordInput)
        .then(order => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Order Created Successfully',
                    variant: 'success'
                })
            );
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
}
    
}