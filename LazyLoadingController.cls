public with sharing class LazyLoadingController {

    public static final Integer PAGE_SIZE = 5;

    // Initial Data
    @AuraEnabled(cacheable=true)
    public static List<Account> getInitialAccounts() {
        return [
            SELECT Id, Name, Industry, Rating
            FROM Account
            ORDER BY Name, Id
            LIMIT :PAGE_SIZE
        ];
    }

    // Load More Data (Keyset Pagination)
    @AuraEnabled(cacheable=true)
    public static List<Account> getMoreAccounts(String lastName, String lastId) {
        return [
            SELECT Id, Name, Industry, Rating
            FROM Account
            WHERE (Name > :lastName)
               OR (Name = :lastName AND Id > :lastId)
            ORDER BY Name, Id
            LIMIT :PAGE_SIZE
        ];
    }

    // Total Count
    @AuraEnabled(cacheable=true)
    public static Integer getTotalCount() {
        return [SELECT COUNT() FROM Account];
    }
}