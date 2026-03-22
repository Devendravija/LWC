import { LightningElement } from 'lwc';

export default class ParentComponent_ParentToChild extends LightningElement {
    messageFromParent = ''
    handleChange(event){
        this.messageFromParent = event.target.value
    }
}