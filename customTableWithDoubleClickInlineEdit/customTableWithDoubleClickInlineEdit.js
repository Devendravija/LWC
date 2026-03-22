import { LightningElement, track } from 'lwc';
import getAccounts from '@salesforce/apex/CustomTableController.getAccounts';
import getIndustryPicklist from '@salesforce/apex/CustomTableController.getIndustryPicklist';
import updateAccounts from '@salesforce/apex/CustomTableController.updateAccounts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import LOGO from '@salesforce/resourceUrl/defaultLogo';

export default class CustomTableWithDoubleClickInlineEdit extends LightningElement {

    @track data = [];
    @track industryOptions = [];
    draftValues = [];

    connectedCallback() {
        this.loadData();
    }

    async loadData() {
        const accounts = await getAccounts();
        const picklist = await getIndustryPicklist();

        this.industryOptions = picklist.map(item => ({
            label: item,
            value: item
        }));

        this.data = accounts.map(acc => ({
            ...acc,
            imageUrl: LOGO, // ✅ FIXED IMAGE
            isEdit: false
        }));
    }

    // 🔥 DOUBLE CLICK FIX
    handleDoubleClick(event) {
        const recordId = event.currentTarget.dataset.id;

        this.data = this.data.map(row => ({
            ...row,
            isEdit: row.Id === recordId
        }));
    }

    handlePicklistChange(event) {
    const recordId = event.target.dataset.id;
    const value = event.detail.value;

    // ✅ Update UI
    this.data = this.data.map(row => {
        if (row.Id === recordId) {
            return { ...row, Industry: value };
        }
        return row;
    });

    // ✅ Ensure draftValues updates correctly
    let draftIndex = this.draftValues.findIndex(d => d.Id === recordId);

    if (draftIndex > -1) {
        this.draftValues[draftIndex].Industry = value;
    } else {
        this.draftValues = [
            ...this.draftValues,
            { Id: recordId, Industry: value }
        ];
    }

    console.log('Updated Draft:', JSON.stringify(this.draftValues));
}

    handleBlur(event) {
        const recordId = event.target.dataset.id;

        this.data = this.data.map(row => {
            if (row.Id === recordId) {
                return { ...row, isEdit: false };
            }
            return row;
        });
    }

    async handleSave() {
    console.log('Saving Data:', JSON.stringify(this.draftValues));

    if (!this.draftValues.length) {
        this.showToast('Warning', 'No changes to save', 'warning');
        return;
    }

    try {
        await updateAccounts({ accList: this.draftValues });

        this.showToast('Success', 'Records updated', 'success');

        // ✅ Clear drafts
        this.draftValues = [];

        // ✅ Reload fresh data
        await this.loadData();

    } catch (error) {
        console.error(error);
        this.showToast('Error', 'Update failed', 'error');
    }
}

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({ title, message, variant })
        );
    }
}