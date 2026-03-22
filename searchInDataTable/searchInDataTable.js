import { LightningElement, track } from 'lwc';
import searchOpportunities from '@salesforce/apex/OpportunitySearchController.searchOpportunities';

const columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Stage', fieldName: 'StageName' },
    { label: 'Close Date', fieldName: 'CloseDate', type: 'date' },
    { label: 'Amount', fieldName: 'Amount', type: 'currency' }
];

export default class SearchInDataTable extends LightningElement {

    @track data = [];
    columns = columns;

    searchKey = '';
    fromDate;
    toDate;

    
    connectedCallback() {
        this.loadOpportunities();
    }

    
    loadOpportunities() {
        searchOpportunities({
            searchKey: this.searchKey,
            fromDate: this.fromDate,
            toDate: this.toDate
        })
        .then(result => {
            this.data = result;
        })
        .catch(error => {
            console.error(error);
        });
    }

    

    
    handleSearchKey(event) {
    this.searchKey = event.target.value;

    clearTimeout(this.delayTimeout);
    this.delayTimeout = setTimeout(() => {
        this.loadOpportunities();
    }, 100);
    }

    // Search by Button
    // handleSearchKey(event) {
    //     this.searchKey = event.target.value;
    // }

    handleFromDate(event) {
        this.fromDate = event.target.value;

        this.loadOpportunities(); // instant loading
    }


    handleToDate(event) {
        this.toDate = event.target.value;
    }

    
    handleSearch() {
        this.loadOpportunities();
    }

    
    handleReset() {
        this.searchKey = '';
        this.fromDate = null;
        this.toDate = null;

        this.loadOpportunities(); 
    }
}