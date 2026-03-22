import { LightningElement, wire, track } from 'lwc';
import getTasks from '@salesforce/apex/getOppRecords.getOpportunities';
import updateTaskStage from '@salesforce/apex/getOppRecords.updateOpp';
import { refreshApex } from '@salesforce/apex';
import ModalDemoAllForm from './modalForm';
import colorForm from './colorModal';
export default class KanbanBoard extends LightningElement {
    @track stagesWithTasks = [];
    draggedTaskId;
    stages = ['Closed Won', 'Closed Lost','Value Proposition', 'Open'];
    oppData=[];
    wiredTasksResult; // store wire response for refresh

    @wire(getTasks)
    wiredTasks(result) {
        this.wiredTasksResult = result;
        const { data, error } = result;
        if (data) {
            this.oppData = JSON.parse(JSON.stringify(data));
            this.groupTasks(this.oppData);
        } else if (error) {
            console.error(error);
        }
    }

    groupTasks(tasks) {
        this.stagesWithTasks = this.stages.map(stage => {
            if(stage == "Open"){
                return{
                    stage,
                    tasks: tasks.filter(task => (task.StageName!= "Closed Won"  && task.StageName != "Closed Lost" && task.StageName!="Value Proposition" ))
                }
            }else{
                return {
                    stage,
                    tasks: tasks.filter(task => task.StageName === stage)
                };
            }
            
        });
        //console.log(JSON.stringify(this.stagesWithTasks.values()))
    }

    handleDragStart(event) {
        this.draggedTaskId = event.currentTarget.dataset.id;
    }

    handleDragOver(event) {
        event.preventDefault(); // allow drop
    }

    handleDrop(event) {
        event.preventDefault();
        const newStage = event.currentTarget.dataset.stage;
        console.log("New Stage---> " + newStage);
        if (this.draggedTaskId && newStage) {
            updateTaskStage({ oppId : this.draggedTaskId, Stage :newStage })
                .then(() => {
                    // refresh data after update
                    return refreshApex(this.wiredTasksResult);
                })
                .then(() => {
                    console.log(`Task moved to ${newStage}`);
                })
                .catch(error => {
                    console.error('Error updating task:', error);
                });
        }
    }

    async handleClick(event){

        console.log("Yooo");
        //console.log(JSON.stringify(this.oppData));
        console.log(typeof event.currentTarget.dataset.id);
        console.log("Data in Target---> " + JSON.stringify(event.target.id));
        console.log(JSON.stringify(event.currentTarget.dataset.id));
        let str = JSON.parse(JSON.stringify(event.currentTarget.dataset.id));
        console.log("String --> " + str);

        let temp = this.oppData.filter(element => str == element.Id );
        console.log(JSON.stringify(temp));
        console.log("Opening Modal");
        let a =await ModalDemoAllForm.open({
            // LightningModal
            
            size: 'medium',
            Amount : temp[0].Amount,
            Name : temp[0].Name,
            oppId : temp[0].Id,
            draftValues : temp[0].draftValues,
            // this becomes 'label'
            heading: 'Edit Contact Information',
            // ModalDemo
            
        });
        console.log("CLosing Modal");
        if(a!="done"){
            // this.oppData.forEach(element=>{
            //     if(element.Id == str){
            //         console.log("Element---> " + JSON.stringify(element));
            //         element.draftValues = a.draftValuesData;
            //         console.log("Element---> " + JSON.stringify(element));
            //     }
            // })
            temp[0].draftValues = a.draftValuesData;
        }
        console.log(JSON.stringify(a));
        console.log("Temp-->  " + JSON.stringify(temp));

        // this.oppData.forEach(element=>{
        //     if(element.Id == str){
        //         console.log("Element---> " + JSON.stringify(element));
        //     }    
        // });
        return refreshApex(this.wiredTasksResult);
    }

    async handleTheme(){

        console.log("Handling Theme");
        

        let color = await colorForm.open({
                // LightningModal
                size: 'small',
                
            });
        if(color!= undefined){
            this.template.querySelectorAll('[data-id="changecolor"]').forEach(element => {
                element.style.background = color.color[1];
            });
            this.template.querySelectorAll('[data-color="cardcolor"]').forEach(element => {
                element.style.background = color.color[2];
            });
        }
        
        console.log("Handled Theme");
    }
}