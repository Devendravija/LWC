import { LightningElement, wire } from 'lwc';
import getOpportunities from '@salesforce/apex/OpportunityController.getOpportunities';
import deleteOpportunity from '@salesforce/apex/OpportunityController.deleteOpportunity';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';

const columns = [
    { label: 'Name', fieldName: 'Name',editable:true},
    { label: 'Stage', fieldName: 'StageName' },
    { label: 'Close Date', fieldName: 'CloseDate', type: 'date' },
    { label: 'Amount', fieldName: 'Amount', type: 'currency',cellAttributes: {
        class: { fieldName: 'amountClass' },
        iconName: { fieldName: 'amountIcon' },
        iconPosition: 'left'
    } },
    {
        label: 'Account',
        fieldName: 'accountUrl',
        type: 'url',
        typeAttributes: {
            label: { fieldName: 'AccountName' },
            target: '_blank'
        }
    },
    {
        type: 'action',
        typeAttributes: {
            rowActions: [
                { label: 'View', name: 'view' },
                { label: 'Edit', name: 'edit' },
                { label: 'Delete', name: 'delete' }
            ]
        }
    }
];

export default class RefreshApex extends LightningElement {

    data;
    columns = columns;
    draftValues = [];
    wiredResult;
    recordId;

    // Modal flags
    isModalOpen = false;
    isDeleteModalOpen = false;

    mode = 'view';
    modalTitle = '';

    //  LOAD DATA
    @wire(getOpportunities)
    wiredOpp(result) {
        this.wiredResult = result;
        if (result.data) {
        this.data = result.data.map(opp => {
            let rowClass = '';
            let iconName='';

            if (opp.Amount > 100000) {
                rowClass = 'slds-text-color_success slds-text-heading_medium';
                iconName='utility:check';
            } else if (opp.Amount < 50000 || opp.Amount === null) {
                rowClass = 'slds-text-color_error';
                iconName='utility:error';
            }

            return {
                ...opp,
                AccountName: opp.Account ? opp.Account.Name : '',
                accountUrl: opp.Account ? '/' + opp.AccountId : '',
                amountClass: rowClass,
                amountIcon: iconName 
            };
        });
    }
}

    handleSave(event) {
    const records = event.detail.draftValues;

    const promises = records.map(record => {
        const fields = { ...record };
        return updateRecord({ fields });
    });

    Promise.all(promises)
        .then(() => {
            this.showToast('Success', 'Records Updated', 'success');
            this.draftValues = [];

            return refreshApex(this.wiredResult);
        })
        .catch(() => {
            this.showToast('Error', 'Update Failed', 'error');
        });
}
    //  REFRESH
    handleRefresh() {
        refreshApex(this.wiredResult);
    }

    //  CREATE
    openCreateModal() {
        this.recordId = null;
        this.mode = 'edit';
        this.modalTitle = 'New Opportunity';
        this.isModalOpen = true;
    }

    //  ROW ACTION
    handleRowAction(event) {
        const action = event.detail.action.name;
        const row = event.detail.row;

        this.recordId = row.Id;

        if (action === 'view') {
            this.mode = 'view';
            this.modalTitle = 'View Opportunity';
            this.isModalOpen = true;
        } 
        else if (action === 'edit') {
            this.mode = 'edit';
            this.modalTitle = 'Edit Opportunity';
            this.isModalOpen = true;
        } 
        else if (action === 'delete') {
            this.isDeleteModalOpen = true;
        }
    }

    //  CLOSE MAIN MODAL
    closeModal() {
        this.isModalOpen = false;
    }

    //  SUCCESS (CREATE / EDIT)
    handleSuccess() {
        this.showToast('Success', 'Operation successful', 'success');
        this.closeModal();
        refreshApex(this.wiredResult);
    }

    //  DELETE FLOW
    closeDeleteModal() {
        this.isDeleteModalOpen = false;
    }

    confirmDelete() {
        deleteOpportunity({ oppId: this.recordId })
            .then(() => {
                this.showToast('Deleted', 'Opportunity deleted', 'success');
                this.closeDeleteModal();
                return refreshApex(this.wiredResult);
            })
            .catch(() => {
                this.showToast('Error', 'Delete failed', 'error');
            });
    }

    //  TOAST
    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({ title, message, variant })
        );
    }

    
}