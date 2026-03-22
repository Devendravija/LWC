import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import creatingRecords from '@salesforce/apex/getRecords.Createrecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';


export default class CreateRecord extends  NavigationMixin(LightningElement)  {

    recId='';


    create(){

    
    this[NavigationMixin.Navigate]({
      type: "standard__objectPage",
      attributes: {
        objectApiName: "Account",
        actionName: "new",
      },
      state:{
        defaultFieldValues:encodeDefaultFieldValues({
            Name:'Test Account',
            NumberOfEmployees:100
        })  
      }
    });   
 }


    handle(){

    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: this.recId,
        actionName: "view",
      },
    });   
 }

    handleClick(){  
        let name=this.template.querySelector('.Name').value;
        let noe=this.template.querySelector('.NumberOfEmployees').value;
        
        creatingRecords({'Name':name,'NumberOfEmployees':noe}).then(result=>{
            console.log('result: ', result);
            this.recId=result;
            this.dispatchEvent(new ShowToastEvent({
                title: 'Record Created Successfully !!!',
                message: 'Account record created successfully {0} !!!',
                variant: 'success',
                mode: 'sticky',
                messageData: [
                {
                    url: '/'+result,
                    label: name
                },
            ],
            }));
        }).catch(error=>{
            console.error('Error in creating record: ', error);
        })
    }
}