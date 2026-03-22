import { api } from 'lwc';
import LightningModal from 'lightning/modal';
import LightningToast from "lightning/toast";
import { ShowToastEvent } from "lightning/platformShowToastEvent"
export default class ModalDemoAll extends LightningModal {
 


    handleSave(){
        // let coloumnColor = this.template.querySelector('[data-id="coloumnColorInput"]').value;
        // let cardColor = this.template.querySelector('[data-id="cardColorInput"]').value;
        // console.log("card Color---> " + cardColor);
        // if(cardColor == "" && coloumnColor == ""){
        //     this.close();
        //     console.log("Empty");
        // }
        let flag =true;
        let dataToSend = {1 : '',2 : ''};
        let count =1;
        let blankCount=0;
        this.template.querySelectorAll('[data-id="cardColorInput"]').forEach(element => {
            if(element.value != ""){
                dataToSend[count] = element.value;
                count++; 
                if(element.value.charAt(0) != "#" ){
                    flag = false;
                }if(element.value.substring(1).length != 6){
                    flag = false;
                }
            }else{
                blankCount++;
            }
        });

        console.log("Data To Send --->  " + JSON.stringify(dataToSend));

        if(flag){
            if(blankCount ==2){
                this.close();
            }else{
                this.close(
                    {color : dataToSend}
                );
            }
            
        }else{
            this.dispatchEvent(
                            new ShowToastEvent({
                                title: "Invalid",
                                message: "Please Enter Color in Correct Format",
                                variant: "warning",
                                })
                        );
        }

        // if(coloumnColor.charAt(0) == "#" ){
        //     console.log("Okk");
        //     if(coloumnColor.substring(1).length == 6){
        //         this.close({
        //             color : coloumnColor
        //         });
        //     }else{
        //         this.dispatchEvent(
        //             new ShowToastEvent({
        //                 title: "Invalid",
        //                 message: "Please Enter Color in Correct Format",
        //                 variant: "warning",
        //                 })
        //         );
        //     }
        // }else{
        //         this.dispatchEvent(
        //             new ShowToastEvent({
        //                 title: "Invalid",
        //                 message: "Please Enter Color in Correct Format",
        //                 variant: "warning",
        //                 })
        //         );
        //     }
        
        
    }

    handleButtonCancel(){
        this.close();
    }

    handleOptionClick(e) {
        const { target } = e;
        this.close(parseInt(target.dataset.id, 10));
    }
}