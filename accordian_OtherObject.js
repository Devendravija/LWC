import { LightningElement,wire,track } from 'lwc';
import getAccountList from '@salesforce/apex/AccountController.getAccCon';

export default class Accordian_OtherObject extends LightningElement {

    accounts;
    error;

    @track expendedRows=[];

    @wire(getAccountList)
    wiredAccounts({data,error}){
        if(data){
            let parsedData=JSON.parse(JSON.stringify(data));
            for(let i=0;i<parsedData.length;i++){
                parsedData[i]._children=parsedData[i]["Contacts"];
            }
            this.accounts=parsedData;
        }else if(error){
            this.error=error;
            this.accounts=undefined;
        }
    }

    constructor(){
        super();
        this.columns=[
            {
                type:"text",
                fieldName:"Name",
                label:"Name"
            },
            {
                type:"text",
                fieldName:"Rating",
                label:"Rating"
            },
            {
                type:"text",
                fieldName:"Phone",
                label:"Phone"
            },
            {
                type:"text",
                fieldName:"FirstName",
                label:"First Name"
            },
            {
                type:"text",
                fieldName:"LastName",
                label:"Last Name"
            },
            {
                type:"action", typeAttributes:{rowActions: this.getRowActions}
            }
        ];
    }

    get expandedRowItems(){
        return this.expendedRows;
    }

    getRowActions(row,doneCallback){
        const actions=[];
        actions.push({
            label:"Edit",
            name:"edit"
        });

        actions.push({
            label:"Delete",
            name:"delete"
        });
        actions.push({
            label:"View",
            name:"view"
        });

        doneCallback(actions);
    }

}