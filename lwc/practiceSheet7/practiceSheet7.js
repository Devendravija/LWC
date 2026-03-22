import { LightningElement, api, track, wire } from 'lwc';
import getContacts from '@salesforce/apex/getContacts.getContacts';
import ModalAllMulti from './allmulti';   // View modal
import DemoAllForm from './demoallform';    // Edit modal
import { NavigationMixin } from 'lightning/navigation';
import LightningConfirm from 'lightning/confirm';
import { deleteRecord } from 'lightning/uiRecordApi';

const actions = [
    { label: 'View', name: 'view' },
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' }
];

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Email', fieldName: 'Email' },
    { label: 'Account Name', fieldName: 'AccountId' },
    { label: 'Lead Source', fieldName: 'LeadSource' },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];

export default class PracticeSheet7 extends NavigationMixin(LightningElement)  {
    columns = columns;
    @track data;
    @api recordId;

    @wire(getContacts)
    contactRecord({ data, error }) {
        if (data) {
            this.data = data;
        } else if (error) {
            console.error(error);
        }
    }

    handleRowAction(event) {
        const rowAction = event.detail.action;
        const row = event.detail.row;

        switch (rowAction.name) {
            case 'view':
                this.recordId = row.Id;
                this.viewRecord();
                break;
            case 'edit':
                this.recordId = row.Id;
                this.editRecord();
                break;
            case 'delete':
                this.recordId = row.Id;
                this.deleteRecords();
                break;
        }
    }

    async viewRecord() {
        await ModalAllMulti.open({
            size: 'medium',
            heading: 'View Contact Information',
            recordId: this.recordId,
        });
    }

    async editRecord() {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.recordId,
                objectApiName: 'Contact',
                actionName: 'edit',
            },
        });
    }

    async deleteRecords() {
        console.log('Delete record: ' + this.recordId);
        const result = await LightningConfirm.open({
            message: 'This is the confirm message',
            label: 'Confirm deletion?',
            theme: 'warning'
        });

        if(result){
            deleteRecord(this.recordId)
                .then(()=>{
                    this.data = this.data.filter((item)=>item.Id !== this.recordId);
                    console.log('Deleted record: ' + this.recordId);
                })
                .catch((error)=>{
                    console.error(error);
                });
        }

    }
}