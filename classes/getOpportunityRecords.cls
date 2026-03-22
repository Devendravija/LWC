public with sharing class getOpportunityRecords {
    
    @AuraEnabled (cacheable=true)
    public static List<Opportunity> getOpportunityRecords(){
        return [SELECT Id, Name, Amount, StageName, CloseDate,Account.Name,CreatedDate,LeadSource,Type,TotalOpportunityQuantity FROM Opportunity];

    }

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunityRecordsByStageName(String stageName){
        return [SELECT Id, Name, Amount, StageName, CloseDate,Account.Name,CreatedDate,LeadSource,Type,TotalOpportunityQuantity FROM Opportunity WHERE StageName=:stageName];
    }

    @AuraEnabled
    public static void createOpportunity(String name,String stageName,String closeDate){
        Opportunity opp = new Opportunity();
        opp.Name=name;
        opp.StageName=stageName;
        opp.CloseDate=Date.valueOf(closeDate);
        insert opp;
    }

    @AuraEnabled
    public static List<String> getPickList(String objApi, String fieldApi){

    List<string> picklistvalues = new List<string>();

    String objectName = 'Opportunity';
    String fieldName = fieldApi;
  
    Schema.SObjectType objSobjectType = Schema.getGlobalDescribe().get(objectName) ;
    Schema.DescribeSObjectResult objDescribeSobject = objSobjectType.getDescribe() ;
    Map<String,Schema.SObjectField> fields = objDescribeSobject.fields.getMap() ;
    Schema.DescribeFieldResult fieldResult = fields.get(fieldName).getDescribe();
    List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
    for( Schema.PicklistEntry pickListVal : ple){
        System.debug(pickListVal.getLabel() +' '+pickListVal.getValue());
        picklistvalues.add(pickListVal.getValue());
}
     return picklistvalues;
 
    }
}