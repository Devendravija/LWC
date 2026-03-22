import { LightningElement } from 'lwc';

export default class ChildComponentChildToParent extends LightningElement {
    textVal = ''
    
    handleChange(event){
        this.textVal = event.target.value
    }


    handleClick(){
        const eve = new CustomEvent('select',{
            detail:this.textVal
        })
        this.dispatchEvent(eve)
    }
}