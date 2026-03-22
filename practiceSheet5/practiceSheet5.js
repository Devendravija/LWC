import { LightningElement, wire } from 'lwc';
import getOpportunity from '@salesforce/apex/getOpportunityRecords.getOpenOpportunity';
import searchRecords from '@salesforce/apex/getOpportunityRecords.searchRecords';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';


import ID_FIELD from '@salesforce/schema/Opportunity.Id';
import STAGE_FIELD from '@salesforce/schema/Opportunity.StageName';

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'StageName', fieldName: 'StageName' },
    { label: 'CloseDate', fieldName: 'CloseDate' }
];

const options = [
    { label: 'Prospecting', value: 'Prospecting' },
    { label: 'Qualification', value: 'Qualification' },
    { label: 'Needs Analysis', value: 'Needs Analysis' },
    { label: 'Value Proposition', value: 'Value Proposition' },
    { label: 'Id Decision Makers', value: 'Id Decision Makers' },
    { label: 'Perception Analysis', value: 'Perception Analysis' },
    { label: 'Proposal/Price Quote', value: 'Proposal/Price Quote' },
    { label: 'Negotiation/Review', value: 'Negotiation/Review' },
    { label: 'Closed Won', value: 'Closed Won' },
    { label: 'Closed Lost', value: 'Closed Lost' }
];

export default class PracticeSheet5 extends LightningElement {
    columns = columns;
    data;
    options = options;
    wiredOpportunityResult;
    selectedRowsforupdate = [];

    // Wire Apex to fetch opportunities
    @wire(getOpportunity)
    wiredOpportunity(result) {
        this.wiredOpportunityResult = result;
        const { data, error } = result;
        if (data) {
            this.data = data;
        } else if (error) {
            console.error(error);
        }
    }

    // Search opportunities
    handleClick() {
        let search = this.template.querySelector('.opportunity').value;
        searchRecords({ searchName: search })
            .then(result => {
                this.data = result;
            })
            .catch(error => {
                console.error(error);
            });
    }

    // Row selection
    handleRowSelection(event) {
        this.selectedRowsforupdate = event.detail.selectedRows;
        console.log('Selected Rows:', this.selectedRowsforupdate);
    }

    
    // Update selected opportunities using Lightning Data Service
    handleChange(event) {
        const newStage = event.detail.value;

        this.selectedRowsforupdate.forEach(opp => {
            const fields = {};
            fields[ID_FIELD.fieldApiName] = opp.Id;
            fields[STAGE_FIELD.fieldApiName] = newStage;

            const recordInput = { fields };

            updateRecord(recordInput)
                .then(() => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: `Opportunity ${opp.Name} updated to ${newStage}`,
                            variant: 'success'
                        })
                    );
                    // Refresh datatable
                    refreshApex(this.wiredOpportunityResult);
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error updating record',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });
        });
    }
}

