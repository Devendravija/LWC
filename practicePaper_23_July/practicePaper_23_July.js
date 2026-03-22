import { LightningElement,wire,track } from 'lwc';
import getContact from '@salesforce/apex/getContactRecord.getRecord';
import updateContacts from '@salesforce/apex/getContactRecord.updateContacts';

export default class PracticePaper_23_July extends LightningElement {

    @track value;
    @track options = [
        {label:'Cricket',value:'Cricket'},
        {label:'Football',value:'Football'},
        {label:'Badminton',value:'Badminton'},
        {label:'Basketball',value:'Basketball'},
        {label:'Tennis',value:'Tennis'}
    ];
    @track allValues = [];
    handleChange(event){
        this.value = event.target.value;
        this.allValues.push(this.value);
    }

    handleRemove(event){
        const valueRemoved=event.target.value;
        this.allValues.splice(this.allValues.indexOf(valueRemoved),1);
    }
    
//     data;
//     draftValues = [];

//     columns = [
//         {label:'Name',fieldName:'Name',editable:true},
//         {label:'Id',fieldName:'Id',editable:true},
//         {label:'Email',fieldName:'Email',editable:true},
//         {label:'Account Name',fieldName:'Account.Name',editable:true},
//         {label:'Lead Source',fieldName:'LeadSource',editable:true},
//         {label:'Phone',fieldName:'Phone',editable:true}
//     ];

    

//     @wire(getContact)
//     wiredContacts({error,data}){
//         if(data){
//             this.data = data;
//         }
//         else if(error){
//             console.log(error);
//         }
//     }
    
     
//   handleSave(event) {
    
//     const updatevalues = event.detail.draftValues;

//     updateContacts(updatevalues);

//     this.draftValues = [];
// }

//     updateContacts(updatevalues){
        
//         updateContacts(updatevalues).then(result=>{
//             console.log(result);
//         }).catch(error=>{
//             console.log(error);
//         });

//     }
}