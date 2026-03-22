public with sharing class getDocumentRecord {
    
    @AuraEnabled(cacheable=true)
    public static List<Document__c> getDocumentRecords(){
        List<Document__c> docRecords=[SELECT Id,Name,Document__c,Valid_From_Date__c,Valid_To_Date__c,isActive__c,Year__c FROM Document__c];
        return docRecords;
    }
}