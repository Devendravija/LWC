import { LightningElement,wire,track } from 'lwc';
import getDocument from '@salesforce/apex/getDocumentRecord.getDocumentRecords';
import { NavigationMixin } from 'lightning/navigation';
import { refreshApex  } from '@salesforce/apex';

const columns = [
    { label: 'Title', fieldName:'Name' },
    { label: 'Document Type', fieldName: 'Document_Type__c' },
    { label: 'Valid from Year', fieldName: 'Valid_From_Year__c', type: 'text', sortable: true },
    { label: 'Valid To Year', fieldName: 'Valid_To_Year__c', type: 'text', sortable: true },
    { label: 'isValid', fieldName: 'isActive__c'},
    {
        type: 'button-icon',
        typeAttributes: {
            iconName: 'utility:preview',
            title: 'View Record',
            variant: 'border',
            alternativeText: 'View',
            name: 'view'
        }
    }
];
export default class PracticePaper1 extends NavigationMixin(LightningElement)  {
    
    columns=columns;
    @track alldata;
    @track data;
    wiredResult
    value;
    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    sortedBy;


    value1;
    value2;

    optionsforDocument=[
        {label:'Aadhar',value:'Aadhar'},
        {label:'Pan',value:'Pan'},
        {label:'Passport',value:'Passport'},
        {label:'Driving License',value:'Driving License'},
        {label:'Voter Id',value:'Voter Id'},
        
    ]



    optionsforValid=[
        {label:'Active',value:'isActive__c'},
        {label:'Inactive',value:'isActive__c'}
    ]
    

    @wire(getDocument)
    wiredDocument(result){
        this.wiredResult=result;
        const {data,error}=result;
        if(data){
            this.alldata=data;
            this.data=data;
            console.log(JSON.stringify(this.data))
            console.log(this.data);
        }
        else if(error){
            console.log(error);
        }
    }

    handleChange1(event){
        this.value1=event.target.value;
        console.log(this.value1);
        this.data=this.alldata.filter((record)=>{
            return record.Document_Type__c==this.value1;
        })
        console.log(this.data);

    }

    handleChange2(event){
        this.value2=event.target.value;
        console.log(this.value2);
        this.data=this.alldata.filter((record)=>{
            return record.isActive__c==this.value2;
        })
        console.log(this.data);

    }

    sortBy(field, reverse, primer) {
        const key = primer
            ? function (x) {
                  return primer(x[field]) || '';
              }
            : function (x) {
                  return x[field] || '';
              };

        return function (a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a)) || 0;
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
    
    async handleClick(){
        console.log('Button Clicked');
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Document__c',
                actionName: 'new'
            }

        });
        await this.refreshData();
    }

    handleSectionToggle(){
        console.log('Toggle');
    }

    get groupedData() {
    const groups = {};
    if(this.data){
        this.data.forEach(record => {
            const year = record.Valid_From_Year__c;
            if(!groups[year]) {
                groups[year] = [];
            }
            groups[year].push(record);
        });
    }
    return Object.keys(groups).map(year => ({
        year,
        records: groups[year]
    }));
}

async handleRowAction(event) {
    const actionName = event.detail.action.name;
    const row = event.detail.row;
    const recordid = event.detail.row.Id;
        if(actionName === 'view') {
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: recordid,
                    objectApiName: 'Document__c',
                    actionName: 'edit'
                }
            });
        }
       await this.refreshData();
}
async refreshData() {
    await refreshApex(this.wiredResult);
}
}