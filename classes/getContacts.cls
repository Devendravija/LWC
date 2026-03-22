public with sharing class getContacts {
    
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(){
        return [SELECT Id,Name,Email,Account.Name,LeadSource FROM Contact];
    }
}