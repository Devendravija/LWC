import { LightningElement, track } from 'lwc';
import getContacts from '@salesforce/apex/ContactPaginationController.getContacts';
import getTotalContacts from '@salesforce/apex/ContactPaginationController.getTotalContacts';

export default class ServerSidePagination extends LightningElement {
    @track contacts = [];
    currentPage = 1;
    pageSize = 10;
    totalPages = 0;
    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    sortedBy;

    columns = [
        { label: 'First Name', fieldName: 'FirstName',sortable: true},
        { label: 'Last Name', fieldName: 'LastName',sortable:true },
        { label: 'Email', fieldName: 'Email',sortable:true },

    ];

    connectedCallback() {
        this.initPagination();
    }

    async initPagination() {
        const total = await getTotalContacts();
        this.totalPages = Math.ceil(total / this.pageSize);
        this.fetchContacts();
    }

    async fetchContacts() {
        this.contacts = await getContacts({ pageSize: this.pageSize, pageNumber: this.currentPage });
    }

    handlePrevious() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.fetchContacts();
        }
    }

    handleNext() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.fetchContacts();
        }
    }

    get isPreviousDisabled() {
        return this.currentPage === 1;
    }

    get isNextDisabled() {
        return this.currentPage === this.totalPages;
    }

     sortBy(field, reverse, primer) {
        const key = primer
            ? function (x) {
                  return primer(x[field]);
              }
            : function (x) {
                  return x[field];
              };

        return function (a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }

    onHandleSort(event) {
    const { fieldName: sortedBy, sortDirection } = event.detail;

    const cloneData = [...this.contacts];

    cloneData.sort((a, b) => {
        let valueA = a[sortedBy] ? a[sortedBy] : '';
        let valueB = b[sortedBy] ? b[sortedBy] : '';

        return sortDirection === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
    });

    this.contacts = cloneData;
    this.sortDirection = sortDirection;
    this.sortedBy = sortedBy;
}
}
