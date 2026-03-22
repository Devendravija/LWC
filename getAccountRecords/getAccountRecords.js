import { LightningElement,wire } from 'lwc';
import fetchingRecords from '@salesforce/apex/getRecords.records';

export default class GetAccountRecords extends LightningElement {
    //@wire(fetchingRecords) recordsFromApex;//once 
    
    recordsFromApex;

    renderedCallback(){

        console.log('rendered');
        
    }

    handleclick(){
        let se=this.template.querySelector('.account').value;
        fetchingRecords({'searchName': se}).then(data=>{
            console.log('data: ', data);
            this.recordsFromApex=data;
        })
    }

}