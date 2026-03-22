import { LightningElement,api,track } from 'lwc';

export default class FirstComponent extends LightningElement {
    
    @api recordId;
    
    fullName='';

    @track objectj={FirstName:'',SecondName:''};

    handleClick(){
        console.log(this.objectj);
        console.log(JSON.parse(JSON.stringify(this.objectj)));

        let fn=this.template.querySelector('[data-id="firstName"]').value;
        let ln=this.template.querySelector('.lastName').value;
        this.objectj.FirstName=fn;
        this.objectj.SecondName=ln;
        console.log(this.objectj);
    }

    
    handle(){

        this.template.querySelector("c-second-component").getvalues();

        console.log('In Updated');
        
        // let fn=this.template.querySelector('[data-id="firstName"]').value;
        // let ln=this.template.querySelector('.lastName').value;
        let fn;
        try{
            fn=this.template.querySelector('[data-id="firstName"]').value;
            console.log('First Name: ',fn);
        }catch(error){
            console.error('Error in fetching first name: ',error);1
        }
        let fullName=fn+' '+ln;
        this.fullName=fullName;
        console.log(fullName);
    }
    renderedCallback(){
        console.log('recordId: '+this.recordId);
    }
}