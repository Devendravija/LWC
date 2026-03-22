public with sharing class ContactPaginationController {
    @AuraEnabled
    public static List<Contact> getContacts(Integer pageSize, Integer pageNumber) {
        Integer offsetVal = (pageNumber - 1) * pageSize;
        return [
            SELECT Id, FirstName, LastName, Email
            FROM Contact
            ORDER BY CreatedDate DESC
            LIMIT :pageSize OFFSET :offsetVal
        ];
    }

    @AuraEnabled(cacheable=true)
    public static Integer getTotalContacts() {
        return [SELECT COUNT() FROM Contact];
    }
}
