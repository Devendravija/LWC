public with sharing class getContactRecord {
    
    @AuraEnabled(cacheable=true)
    public static List<Contact> getRecord(){
        return [SELECT Id,Name,Email,Account.Name,LeadSource,Phone FROM Contact];
    }

    @AuraEnabled
    public static void updateContacts(List<Contact> contacts){
        update contacts;
    }
}