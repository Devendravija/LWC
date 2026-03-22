import { LightningElement, api, track, wire } from 'lwc';
import getPicklistValues from '@salesforce/apex/DynamicTabs.getPicklistValues';
import getFieldSetFields from '@salesforce/apex/DynamicTabs.getFieldSetFields';
import getRecords from '@salesforce/apex/DynamicTabs.getRecords';
import updateRecords from '@salesforce/apex/DynamicTabs.updateRecords';
import createRecord from '@salesforce/apex/DynamicTabs.createRecord';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class DynamicTabs extends NavigationMixin(LightningElement) {
     @api fieldApiName;     // Picklist Field
    @api fieldSetName;     // Field Set

    @track tabs = [];
    @track data = [];
    @track columns = [];

    selectedTab;
    draftValues = [];
    showModal = false;

    sortedBy;
    sortedDirection;

    wiredResult;

    // 🔹 Load Picklist Tabs
    @wire(getPicklistValues, { fieldApiName: '$fieldApiName' })
    wiredTabs({data}){
    if(data){
        this.tabs = ['All Opportunities', ...data]; // 🔥 Add default tab
        this.selectedTab = 'All Opportunities';
        this.loadData();
    }
}

    // 🔹 Load Field Set Columns
    @wire(getFieldSetFields, { fieldSetName: '$fieldSetName' })
    wiredFields({data}){
        if(data){
            this.columns = data.map(f => ({
                label: f,
                fieldName: f,
                editable: true,
                sortable: true
            }));

            // Add hyperlink column
            this.columns.unshift({
                label: 'Name',
                fieldName: 'recordLink',
                type: 'url',
                typeAttributes: { label: { fieldName: 'Name' } }
            });
        }
    }

    // 🔹 Load Data
    loadData(){
    getRecords({
        fieldApiName: this.fieldApiName,
        value: this.selectedTab,
        fields: this.columns
            .filter(c => c.fieldName !== 'recordLink')
            .map(c => c.fieldName)
    })
    .then(result=>{
        this.data = result.map(r => ({
            ...r,
            recordLink: '/' + r.Id
        }));
    });
}

    handleTabClick(event){
    this.selectedTab = event.target.dataset.value;
    this.loadData();
}

    refresh(){
    this.loadData();
}

    // 🔹 Inline Edit Save
    handleSave(event){
        updateRecords({ records: event.detail.draftValues })
        .then(()=>{
            this.draftValues = [];
            this.loadData();
        });
    }

    // 🔹 Sorting
    handleSort(event){
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;

        let data = [...this.data];
        data.sort((a,b)=>{
            return this.sortedDirection === 'asc'
                ? (a[this.sortedBy] > b[this.sortedBy] ? 1 : -1)
                : (a[this.sortedBy] < b[this.sortedBy] ? 1 : -1);
        });

        this.data = data;
    }

    // 🔹 Modal
    openModal(){
        this.showModal = true;
    }

    closeModal(){
        this.showModal = false;
    }

    newRecord = {};

    handleInput(event){
        this.newRecord.Name = event.target.value;
        this.newRecord[this.fieldApiName] = this.selectedTab;
    }

    saveRecord(){
        createRecord({ opp: this.newRecord })
        .then(()=>{
            this.closeModal();
            this.loadData();
        });
    }

    handleSuccess(event){
    this.showModal = false;

    this.dispatchEvent(
        new ShowToastEvent({
            title: 'Success',
            message: 'Opportunity Created Successfully',
            variant: 'success'
        })
    );

    this.loadData();
    }

    handleError(event){
    this.dispatchEvent(
        new ShowToastEvent({
            title: 'Error',
            message: event.detail.message,
            variant: 'error'
        })
    );
    }

    openModal(){
    this.showModal = true;
}

closeModal(){
    this.showModal = false;
}

    handleSubmit(event){
    event.preventDefault(); // stop default submit

    const fields = event.detail.fields;

    // 🔥 Set picklist value dynamically
    if(this.selectedTab !== 'All Opportunities'){
        fields[this.fieldApiName] = this.selectedTab;
    }

    this.template.querySelector('lightning-record-edit-form').submit(fields);
}
}