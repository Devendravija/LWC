public with sharing class OpportunityController {
    
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities() {
        return [SELECT Id, Name, StageName, CloseDate, Amount,Account.Name 
                FROM Opportunity 
                ORDER BY CreatedDate DESC];
    }

    @AuraEnabled
    public static void deleteOpportunity(Id oppId) {
        delete [SELECT Id FROM Opportunity WHERE Id = :oppId];
    }

    
}