import { LightningElement,wire,api,track } from 'lwc';
import getAccount from '@salesforce/apex/getAccount.getAccount';
import { NavigationMixin } from 'lightning/navigation';
import LightningConfirm from "lightning/confirm";
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const action=[
    {label:'View',name:'view'},
    {label:'Delete',name:'delete'}
]

const columns=[
    {label:'Account Name',fieldName:'Name'},
    {label:'Employees',fieldName:'NumberOfEmployees'},
    {label:'Phone Number',fieldName:'Phone'},
    {label:'Account Owner',fieldName:'Owner.Name'},
    {label:'Billing City',fieldName:'BillingCity'},
    {
        type: 'action',
        typeAttributes: { rowActions: action },
    },

]

export default class PracticePaper2_Nomex extends NavigationMixin(LightningElement)  {

    @api recordId;
    gridColumns=columns;
    gridData;
    record={};
    @track expandedRows=[];

    @wire(getAccount)
    wiredAccount({data,error}){
        if(data){
            let parsedData=JSON.parse(JSON.stringify(data));
            parsedData.forEach(acc=>{
                if (acc.ChildAccounts && acc.ChildAccounts.length > 0) {
            acc._children = acc.ChildAccounts;
        }
        

                
                
            })
            this.gridData=parsedData;
            console.log(this.gridData);
        }
        if(error){
            console.log(this.error);
        }
        
    }

    get gridExpandedRows(){
        return this.expandedRows;
    }

    handleRowAction(event){
        const actionName=event.detail.action.name;
        const row=event.detail.row;

        switch(actionName){
            case 'delete':
                this.deleteRow(row);
                break;
            
            case 'view':
                this.viewRow(row);
                break;
        }
    }

    viewRow(row){
        this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: row.Id,
            objectApiName: 'Account',
            actionName: 'view'
        }
    });
    }

    deleteRow(row) {
    this.recordId = row.Id; 

    LightningConfirm.open({
        message: "Are You Sure You Want to Delete the Record?",
        variant: "headerless",
        label: "Confirmation"
    }).then((result) => {
        if (result) {
            this.handleDelete();
        } else {
            console.log('User cancelled deletion');
        }
    });
}

handleDelete() {
    deleteRecord(this.recordId)
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Record deleted successfully',
                    variant: 'success',
                })
            );
            
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error deleting record',
                    message: error.body.message,
                    variant: 'error',
                })
            );
        });
}
}