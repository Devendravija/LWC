import { LightningElement, track, wire } from 'lwc';
import getAllContacts from '@salesforce/apex/ContactController.getAllContacts';

export default class ClientSidePagination extends LightningElement {
    @track contacts = [];
    @track paginatedData = [];
    currentPage = 1;
    pageSize = 10;
    totalPages = 0;

    columns = [
        { label: 'First Name', fieldName: 'FirstName' },
        { label: 'Last Name', fieldName: 'LastName' },
        { label: 'Email', fieldName: 'Email' }
    ];

    @wire(getAllContacts)
    wiredContacts({ data, error }) {
        if (data) {
            this.contacts = data;
            this.totalPages = Math.ceil(data.length / this.pageSize);
            this.updatePaginatedData();
        }
    }

    updatePaginatedData() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.paginatedData = this.contacts.slice(start, end);
    }

    handlePrevious() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePaginatedData();
        }
    }

    handleNext() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updatePaginatedData();
        }
    }

    get isPreviousDisabled() {
        return this.currentPage === 1;
    }

    get isNextDisabled() {
        return this.currentPage === this.totalPages;
    }
}


