import { api } from 'lwc';
import LightningModal from 'lightning/modal';
import { updateRecord } from 'lightning/uiRecordApi';

export default class DemoAllForm extends LightningModal {
    @api heading;
    @api recordId;
    @api options = [];

    // Example properties bound to inputs
    assignedTo;
    teamName;
    statusValue = 'new';
    personalSettings;
    slaSerialNum;
    slaExpireDate;
    slaExpireTime;
    location;
    selectedLangs;

    addressBilling = { street:'', city:'', province:'', postalCode:'', country:'US' };
    addressShipping = { street:'', city:'', province:'', postalCode:'', country:'US' };

    // Input handlers
    handleTextInput(event) { this[event.target.name] = event.target.value; }
    handleDateInput(event) { this[event.target.name] = event.target.value; }
    handleTimeInput(event) { this[event.target.name] = event.target.value; }
    handleChangeStatus(event) { this.statusValue = event.detail.value; }
    handleChangeBilling(event) { this.addressBilling = event.detail; }
    handleChangeShipping(event) { this.addressShipping = event.detail; }

    handleButtonCancel() {
        this.close({ action: 'cancel' });
    }

    async handleButtonSubmit() {
        // Map your form fields to Contact fields
        const fields = {};
        fields.Id = this.recordId;
        fields.Title = this.teamName;          // Example mapping
        fields.LeadSource = this.statusValue;  // Example mapping
        fields.Description = this.personalSettings; // Example mapping

        try {
            await updateRecord({ fields });
            this.close({ action: 'saved' });
        } catch (error) {
            console.error(error);
            this.close({ action: 'error', error });
        }
    }

    get statusOptions() {
        return [
            { label: 'New', value: 'new' },
            { label: 'In Progress', value: 'inProgress' },
            { label: 'Finished', value: 'finished' },
        ];
    }
}