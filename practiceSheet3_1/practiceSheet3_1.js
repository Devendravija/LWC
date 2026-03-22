import { LightningElement ,wire} from 'lwc';
import getRecords from '@salesforce/apex/getRecords.getrecords1';

const columns = [
        { label: 'Account Name', fieldName: 'Name' },
        { label: 'Phone', fieldName: 'Phone' },
        { label: 'Industry', fieldName: 'Industry' },
    ];

export default class PracticeSheet3_1 extends LightningElement {
    columns = columns;
    data = [];
    
    @wire(getRecords)
    wiredRecords({ error, data }) {
        if (data) {
            this.data = data;
        }
        if (error) {
            console.error('error: ', error);
        }
    }


    handleRowSelection(event) {
        const selectedRow = event.detail.selectedRows;
        console.log('Selected Row: ', selectedRow);
        if (selectedRow.length > 0 ) {
            for (let i = 0; i < selectedRow.length; i++) {
                const selectedAccountName = selectedRow[i].Id;
            console.log('Selected Account Name: ', selectedAccountName);
            const accountEvent = new CustomEvent('accountselected', {
                detail: { accountId: selectedAccountName }
                
            });
            this.dispatchEvent(accountEvent);
            }
            
            
    }
}
}