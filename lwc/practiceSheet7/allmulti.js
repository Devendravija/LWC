import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class ModalAllMulti extends LightningModal {
    @api heading = 'View Contact Information';
    @api recordId;

    handleClose() {
        this.close({ action: 'cancel' });
    }
}