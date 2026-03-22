import { LightningElement, wire, track } from 'lwc';
import getCollegeRecords from '@salesforce/apex/getRecords.getCollegeRecords';
import getHiringStudentRecords from '@salesforce/apex/getRecords.getHiringStudentRecords';

const columns = [
    { label: 'Student Name', fieldName: 'Student_Name__c' },
    { label: 'Student Email', fieldName: 'Student_Email__c' },
    { label: 'Student Phone Number', fieldName: 'Student_Phone_Number__c' },
    { label: 'Profile', fieldName: 'Profile__c' },
    { label: 'Status', fieldName: 'Status__c' },
    { label: 'College Information', fieldName: 'College_Information_Object__c' }
];

export default class PracticeSheet8 extends LightningElement {
    @track data;
    @track studentDataHiring;
    columns = columns;
    profile;

    
    @wire(getCollegeRecords)
    wiredRecords({ error, data }) {
        if (data) {
            this.data = data;
            console.log('College Records:', data);
        } else if (error) {
            console.error(error);
        }
    }

    @wire(getHiringStudentRecords)
    wiredStudentRecords({ error, data }) {
        if (data) {
            this.studentDataHiring = data;
            console.log('Student Records:', data);
        } else if (error) {
            console.error(error);
        }
    }

    // filter getHiringStudentRecords according to college id

    // filteredStudentDataAccordingToCollege(){
    //     this.studentDataHiring = this.studentDataHiring.filter(studentData => studentData.College_Information_Object__c == this.profile);
    //     console.log('Filtered Student Records:', this.studentDataHiring);
    // }


}