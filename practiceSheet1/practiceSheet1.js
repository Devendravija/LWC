import { LightningElement ,track} from 'lwc';
import LightningConfirm from 'lightning/confirm';
import { NavigationMixin } from 'lightning/navigation';

export default class PracticeSheet1 extends NavigationMixin (LightningElement) {
    
    // async clickHandleAcc(){
    //     const result = await LightningConfirm.open({
    //         message: 'Are You Sure?',
    //         confirmButtonLabel: 'Proceed',
    //         cancelButtonLabel: 'Cancel',
    //         variant: 'headerless',
           
    //     });
    //     if(result){
    //             this[NavigationMixin.Navigate]({
    //                 type: 'standard__objectPage',
    //                 attributes: {
    //                     objectApiName: 'Account',
    //                     actionName: 'new'

    //                 }
    //             });
    //             console.log('You clicked on Accounts');
                
    //         }
    // }

    // async clickHandleCont(){
    //     const result = await LightningConfirm.open({
    //         message: 'Are You Sure?',
    //         variant: 'headerless',
    //         label: 'Contacts'
           
    //     });
    //     if(result){
    //             this[NavigationMixin.Navigate]({
    //                 type: 'standard__objectPage',
    //                 attributes: {
    //                     objectApiName: 'Contact',
    //                     actionName: 'new'

    //                 }
    //             });
    //             console.log('You clicked on Contacts');
                
    //         }
        
    // }

    // async clickHandleOpp(){
    //     const result = await LightningConfirm.open({
    //         message: 'Are You Sure?',
    //         variant: 'headerless',
    //         label: 'Opportunities'
           
    //     });
    //     if(result){
    //             this[NavigationMixin.Navigate]({
    //                 type: 'standard__objectPage',
    //                 attributes: {
    //                     objectApiName: 'Opportunity',
    //                     actionName: 'new'

    //                 }
    //             });
    //             console.log('You clicked on Opportunities');
                
    //         }
    // }

    // async clickHandleLead(){
    //     const result = await LightningConfirm.open({
    //         message: 'Are You Sure?',
    //         variant: 'headerless',
    //         label: 'Leads',
            
           
    //     });
    //     if(result){
    //             this[NavigationMixin.Navigate]({
    //                 type: 'standard__objectPage',
    //                 attributes: {
    //                     objectApiName: 'Lead',
    //                     actionName: 'new'

    //                 }
    //             });
    //             console.log('You clicked on Leads');
                
    //         }
    // }

    @track isShow = false;
    options = [
        { id: 1, label: 'preceed' , varrient:'brand'},
        { id: 2, label: 'cancel ' , variant:'destructive'},
        
    ];
    @track objectName;
    handle(event){
        this.isShow = true;
        console.log(event.target.value)
        this.objectName = event.target.value;
    }

    handleProceed(){
        this.isShow = false;
        console.log(this.objectName);
        this[NavigationMixin.Navigate]({
            type: "standard__objectPage",
            attributes: {
                objectApiName: this.objectName,
                actionName: "new",
            },
        });
    }

    
    handleOptionClick(){
        this.isShow = false;
    }

}