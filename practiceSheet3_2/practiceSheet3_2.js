import { LightningElement, wire,api } from 'lwc';
import getRecords from '@salesforce/apex/getRecords.getrecords2';

const columns = [
    { label: 'Contact Name', fieldName: 'Name' },
    { label: 'Account Name', fieldName: 'AccountName' },
    { label: 'Phone', fieldName: 'Phone' },
    { label: 'Email', fieldName: 'Email' },
];

export default class PracticeSheet3_2 extends LightningElement {
    columns = columns;
    contacts;

    @api accountId;

    // set accountId(value) {
    //     this._accountId = value;
    // }

    // get accountId() {
    //     return this._accountId;
    // }

    @wire(getRecords, { accountId: '$accountId' })
    wiredContacts({ error, data }) {
        if (data) {
            this.contacts = data.map(contact => {
                return { ...contact, AccountName: contact.Account.Name };
            });
        } else if (error) {
            console.error('Error: ', error);
        }
    }
}