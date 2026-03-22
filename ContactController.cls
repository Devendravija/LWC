public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getAllContacts() {
        return [SELECT Id, FirstName, LastName, Email FROM Contact LIMIT 100];
    }
}
