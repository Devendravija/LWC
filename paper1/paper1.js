import { LightningElement,wire,track } from 'lwc';
import getOpportunityRecords from '@salesforce/apex/getOpportunityRecords.getOpportunityRecords';
import getOpportunityByStageName from '@salesforce/apex/getOpportunityRecords.getOpportunityRecordsByStageName';
import getPicklistValues from '@salesforce/apex/getOpportunityRecords.getPickList';


import LightningModal from 'lightning/modal';

import { refreshApex } from '@salesforce/apex';

const columns=[
    {label:'Name',fieldName:'Name',type: 'url',editable: true ,sortable:true,
            typeAttributes: { label: { fieldName: 'Name' }, target: '_blank' }},
    {label:'Account Name',fieldName:'Account.Name',editable: true },
    {label:'Amount',fieldName:'Amount',editable: true },
    {label:'StageName',fieldName:'StageName',editable: true },
    {label:'CloseDate',fieldName:'CloseDate',editable: true ,sortable:true},
    {label:'Date',fieldName:'CreatedDate',editable: true,sortable:true },
    {label:'Referral Source',fieldName:'leadSource',editable: true ,sortable:true},
    {label:'Type',fieldName:'Type',editable: true,sortable:true },
    {label:'Quantity',fieldName:'TotalOpportunityQuantity',editable: true }
    
]

export default class Paper1 extends LightningElement {

    @track searchdata;

    showModal=false;
    wiredOpportunitiesResult;
    columns=columns;
    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    sortedBy;
    @track data;

    @track fields={};

    statusValue=[
        {label:'Needs Analysis', fieldName:'Needs Analysis'},
        {label:'Qualification', fieldName:'Qualification'},
        {label:'Id Decision Makers', fieldName:'Id Decision Makers'},
        {label:'Perception Analysis', fieldName:'Perception Analysis'},
        {label:'Proposal/Price Quote', fieldName:'Proposal/Price Quote'},
        {label:'Negotiation/Review', fieldName:'Negotiation/Review'},
        {label:'Closed Won', fieldName:'Closed Won'},
        {label: 'Closed Lost', fieldName:'Closed Lost'}
    ];

    statusOptions=[
        {label:'Needs Analysis', value:'Needs Analysis'},
        {label:'Qualification', value:'Qualification'},
        {label:'Id Decision Makers', value:'Id Decision Makers'},
        {label:'Perception Analysis', value:'Perception Analysis'},
        {label:'Proposal/Price Quote', value:'Proposal/Price Quote'},
        {label:'Negotiation/Review', value:'Negotiation/Review'},
        {label:'Closed Won', value:'Closed Won'},
        {label: 'Closed Lost', value:'Closed Lost'}
    ];
    
    handleSearch(event){
        this.searchdata=event.target.value;
        console.log(this.searchdata);
        if(this.searchdata){
            this.getPicklistValues(this.searchdata);
        }
        else{
            this.wiredOpportunityRecords();
        }
        
    }

    getPicklistValues(status){
        getPicklistValues({status:status})
        .then(result => {
            this.fields=result;
        })
        .catch(error => {
            console.log(error);
        })
    }

    @wire(getOpportunityRecords)
    wiredOpportunityRecords(result){
        this.wiredOpportunitiesResult=result;
        const {error,data} = result;
        if(data){
            let Opps = JSON.parse(JSON.stringify(data));
            Opps.forEach(res => {
                res.opportunityLink = '/' + res.Id;
            });
            this.data=Opps;;
        }
        else if(error){
            console.log(error);
        }
    }

    getAllOpportunity(event){
        if(event.target.name === 'Close-Won'){
            this.getOpportunityRecordsByStageName('Close-Won');
        }
        else if(event.target.name === 'Close-Lost'){
            this.getOpportunityRecordsByStageName('Close-Lost');
        }
        else{
            this.wiredOpportunityRecords();
        }
    }
        


    getOpportunityRecordsByStageName(stageName){
        getOpportunityByStageName({stageName:stageName})
        .then(result => {
            this.data=result;
        })
        .catch(error => {
            console.log(error);
        })
    }


    refresh() {
        refreshApex(this.wiredOpportunitiesResult)
        .then(() => {
        console.log('Data refreshed successfully');
        })
        .catch(error => {
        console.error('Error refreshing data:', error);
        });
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
        const cloneData = [...this.data];

        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.data = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }

    handleClick() {
        console.log('clicked');
        this.showModal = true;
    }

    handleSave(event) {
        console.log('save');
        const fieldValue = event.target.value;
        this.formData = { ...this.formData, [fieldName]: fieldValue };

        this.createRecord('Opportunity', this.formData);
        this.refresh();
        this.showModal = false;
    }


    handleCancel(event) {
        console.log('cancel');
        this.showModal = false;
    }

    createRecord(objectApiName, fields){
        const recordInput = { apiName: objectApiName, fields };
        createRecord(recordInput)
            .then(record => {
                console.log('Record created: ', record);
            })
            .catch(error => {
                console.error('Error creating record: ', error);
            });
    }




}