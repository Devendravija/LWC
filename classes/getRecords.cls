public with sharing class getRecords {
    
    @AuraEnabled(cacheable=true)
    public static List<College_Information_Object__c> getCollegeRecords(){
        return [SELECT Id,Name,College_Name__c,College_Campus_Location__c,College_Affiliation__c,Branches_Offered__c,CreatedDate,(SELECT Id,Name,Profile__c,Status__c,Student_Email__c,Student_Name__c,Student_Phone_Number__c,College_Information_Object__c FROM Hiring_Fresh_Graduates_Objects__r)  FROM College_Information_Object__c];
    }

    @AuraEnabled(cacheable=true)
    public static List<Hiring_Fresh_Graduates_Object__c> getHiringStudentRecords(){
        
        return [SELECT Id,Name,Profile__c,Status__c,Student_Email__c,Student_Name__c,Student_Phone_Number__c,College_Information_Object__r.Id FROM Hiring_Fresh_Graduates_Object__c];
    }
    
}