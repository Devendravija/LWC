import { LightningElement, wire, track, api } from 'lwc';
import getCaseRecord from '@salesforce/apex/getCaseRecord.getCaseRecords';
import getAggregateData from '@salesforce/apex/getCaseRecord.getAggregateData';
import { createMessageContext,publish } from 'lightning/messageService';
import samplelms from '@salesforce/messageChannel/lwcMessageChannel__c';

const columns = [
    { label: 'id', fieldName: 'Id' },
    { label: 'Case Number', fieldName: 'CaseNumber' },
    { label: 'Subject', fieldName: 'Subject' },
    { label: 'Status', fieldName: 'Status' },
    { label: 'Priority', fieldName: 'Priority' },
    { label: 'Created Date', fieldName: 'CreatedDate' }
];



const aggregatecolumns = [
    { label: 'Status', fieldName: 'Status' },
    { label: 'Count', fieldName: 'totalCount' }
];

export default class PracticeSheet4 extends LightningElement {

    context =createMessageContext();

    @api recordId;
    columns = columns;
    aggregatecolumns = aggregatecolumns;
    @track data;
    @track aggregatedata;

    @track caseNumber = '';
    @track subject = '';
    @track status = '';
    @track priority = '';
    @track description = '';
    @track created = '';

    @wire(getCaseRecord)
    wiredCases({ error, data }) {
        if (data) {
            this.data = data;
            console.log('Data fetch');
            
        } else if (error) {
            console.error('error: ', error);
        }
    }

    @wire(getAggregateData)
    wiredAggregateData({ error, data }) {
        if (data) {
            this.aggregatedata = data;
            console.log('Aggregate Data fetch');
        } else if (error) {
            console.error('Error fetching aggregate data: ', error);
        }
    }


    onRowSelection(event) {
        const selectedRow = event.detail.selectedRows;
        if (selectedRow.length > 0) {
            this.recordId = selectedRow[0].Id;
            this.caseNumber = selectedRow[0].CaseNumber;
            this.subject = selectedRow[0].Subject;
            this.status = selectedRow[0].Status;
            this.priority = selectedRow[0].Priority;
            this.description = selectedRow[0].Description;
            this.created = selectedRow[0].CreatedDate;
            console.log('Selected Record Id: ', this.recordId);
            this.dispatchEvent(new CustomEvent('casenumberselected', {
                detail: { caseNumber: this.recordId }
            }));
            
        }
        this.sendData();
    }

    
    sendData(){
        const dataToSend = {
            caseNumber: this.caseNumber,
            subject: this.subject,
            status: this.status,
            priority: this.priority,
            description: this.description
        };
        publish(this.context, samplelms, dataToSend);
    }

}