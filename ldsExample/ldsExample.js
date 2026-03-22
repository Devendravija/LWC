import { LightningElement } from 'lwc';
import { createRecord,deleteRecord } from 'lightning/uiRecordApi';
import getRecords from '@salesforce/apex/getRecords.getrecords1';


export default class LdsExample extends LightningElement {

    actions = [
        { label: 'Show details', name: 'show_details' },
        { label: 'Delete', name: 'delete' }
    ];

    columns = [
        { label: 'Name',type:'text', fieldName: 'Name' },
        { label: 'Number Of Employees', type: 'number', fieldName: 'NumberOfEmployees' },
        { type: 'action', typeAttributes: { rowActions: this.actions }}
    ];

    data;
    flag = false;
    renderedCallback(){
        if(this.flag==false){
        getRecords().then(result=>{
            console.log('result: ', result);
            this.data = result;
            this.flag = true;
        }).catch(error=>{
            console.error('error: ', error);
        });
    }

    }
    tempSelected;
    deleteSelected(){
        console.log(this.tempSelected);
        this.tempSelected.forEach(element => {
            console.log('Deleting Id:', element.Id); // Debug
            deleteRecord(element.Id).then(() => {
                    console.log('Record deleted successfully');
                    return getRecords();
                });
    });
    }

    handleRowSelection(event) {
        const selectedRows = event.detail.selectedRows;
        console.log('Selected Rows:', JSON.parse(JSON.stringify(selectedRows)));
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;

        console.log('Row:', row);

        switch (actionName) {
            case 'delete':
                console.log('Deleting Id:', row.Id); // Debug
                deleteRecord(row.Id)
                    .then(() => {
                        console.log('Record deleted successfully');
                        return getRecords();
                    })
                    .then(result => {
                        this.data = result;
                    })
                    .catch(error => {
                        console.error('Delete error: ', error);
                    });
                break;

            case 'show_details':
                console.log('Row details:', row);
                break;

            default:
        }
    }

    

    // objectName = 'Account';
    // fields = ['Name','NumberOfEmployees'];
    // @api recordId;
    // recId;
    // handleClick(){

    //     let name = this.template.querySelector('.textField').value;
    //     let data={
    //         "apiName":"Account",
    //         "fields":{
    //             "Name":name
    //         }
    //     }
    //     // creating record Account object
    //     console.log('data--->',data);
    //     createRecord(data).then(result=>{
    //         console.log('result: ', result);
    //         console.log('result: ', result.id);
    //         this.recId = result.id;
    //         this.template.querySelector('.textField').value = '';
    //     });
    // }
    // handleClick1(){
    //     deleteRecord(this.recId).then(() => {
    //         console.log('Record deleted successfully');
    //     }).catch(error => {
    //         console.error('Error deleting record: ', error);
    //     });
    // }
}