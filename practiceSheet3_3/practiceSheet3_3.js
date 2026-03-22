import { LightningElement } from 'lwc';

export default class PracticeSheet3_3 extends LightningElement {
    selectedAccountId;
    
    handleAccountSelected(event) {
        this.selectedAccountId = event.detail.accountId;
        console.log('Selected Account ID: ', this.selectedAccountId);
    }
}