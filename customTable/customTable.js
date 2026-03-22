import { LightningElement, track } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import deleteAccount from '@salesforce/apex/AccountController.deleteAccount';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';

export default class CustomTable extends NavigationMixin(LightningElement) {

    @track accounts = [];
    wiredResult;

    recordId;
    isDeleteModalOpen = false;

    
    connectedCallback() {
        this.loadAccounts();
    }

    loadAccounts() {
        getAccounts()
            .then(result => {
                this.accounts = result;
            })
            .catch(error => {
                console.error(error);
            });
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

    
    closeDeleteModal() {
        this.isDeleteModalOpen = false;
    }

    confirmDelete() {
        deleteAccount({ accId: this.recordId })
            .then(() => {
                this.showToast('Success', 'Account deleted', 'success');
                this.closeDeleteModal();
                this.loadAccounts(); // refresh
            })
            .catch(() => {
                this.showToast('Error', 'Delete failed', 'error');
            });
    }

    
    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({ title, message, variant })
        );
    }
}