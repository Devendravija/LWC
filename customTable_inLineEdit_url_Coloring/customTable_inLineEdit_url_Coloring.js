import { LightningElement, wire, track } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import updateAccounts from '@salesforce/apex/AccountController.updateAccounts';
import deleteAccount from '@salesforce/apex/AccountController.deleteAccount';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class CustomTable_inLineEdit_url_Coloring extends NavigationMixin(LightningElement) {

    @track accounts = [];
    draftValues = [];
    recordId;

    wiredResult;

    // 🔷 LOAD DATA
    @wire(getAccounts)
    wiredAccounts(result) {
        this.wiredResult = result;

        if (result.data) {
            this.accounts = result.data.map(acc => {
                return {
                    ...acc,
                    contactCount: acc.Contacts ? acc.Contacts.length : 0,
                    rowClass: this.getRowClass(acc)
                };
            });
        }
    }

    // 🔷 CONDITIONAL COLOR
    getRowClass(acc) {
        if (acc.AnnualRevenue > 1000000) {
            return 'slds-theme_success'; // green
        } else if (acc.AnnualRevenue < 50000 || acc.AnnualRevenue === null) {
            return 'slds-theme_error'; // red
        }
        return '';
    }


    // 🔷 INLINE EDIT HANDLER
    handleChange(event) {
        const recordId = event.target.dataset.id;
        const field = event.target.dataset.field;
        const value = event.target.value;

        let draft = this.draftValues.find(d => d.Id === recordId);

        if (draft) {
            draft[field] = value;
        } else {
            let newDraft = { Id: recordId };
            newDraft[field] = value;
            this.draftValues.push(newDraft);
        }
    }

    // 🔷 SAVE INLINE EDIT
    handleSave() {
        updateAccounts({ accList: this.draftValues })
            .then(() => {
                this.showToast('Success', 'Records Updated', 'success');
                this.draftValues = [];
                return refreshApex(this.wiredResult);
            })
            .catch(() => {
                this.showToast('Error', 'Update Failed', 'error');
            });
    }

    // 🔷 DELETE
    handleDelete(event) {
        const recordId = event.target.dataset.id;

        deleteAccount({ accId: recordId })
            .then(() => {
                this.showToast('Deleted', 'Account deleted', 'success');
                return refreshApex(this.wiredResult);
            });
    }

    // 🔷 NAVIGATE TO RELATED CONTACTS
    navigateToContacts(event) {
        const recordId = event.target.dataset.id;

        this[NavigationMixin.Navigate]({
            type: 'standard__recordRelationshipPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'Account',
                relationshipApiName: 'Contacts',
                actionName: 'view'
            }
        });
    }

    // 🔷 REFRESH
    handleRefresh() {
        refreshApex(this.wiredResult);
    }

    // 🔷 TOAST
    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({ title, message, variant })
        );
    }
    handleAction(event) {
        const action = event.target.value;
        const recordId = event.target.dataset.id;

        this.recordId = recordId;

        if (action === 'view') {
            this.navigateToRecord(recordId, 'view');
        } 
        else if (action === 'edit') {
            this.navigateToRecord(recordId, 'edit');
        } 
        else if (action === 'delete') {
            this.isDeleteModalOpen = true;
        }
    }

    navigateToRecord(recordId, action) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'Account',
                actionName: action
            }
        });
    }
}