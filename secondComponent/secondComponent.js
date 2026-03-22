import { LightningElement,api } from 'lwc';

export default class SecondComponent extends LightningElement {

    @api receivedData;
    
    @api getvalues(){
        console.log('Method of Child cqalled from Parent');
    }1
}