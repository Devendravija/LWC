import { LightningElement } from 'lwc';

export default class ParentComponent_ChildToParent extends LightningElement {
    valueFromChild


    handleMessage(event){
        this.valueFromChild = event.detail;
    }
}