public with sharing class AccountController {

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [
            SELECT Id, Name, Industry, Phone, AnnualRevenue, NumberOfEmployees
            FROM Account
            ORDER BY CreatedDate DESC
            LIMIT 200
        ];
    }

    @AuraEnabled
    public static void deleteAccount(Id accId) {
        delete [SELECT Id FROM Account WHERE Id = :accId];
    }

    @AuraEnabled
    public static void updateAccounts(List<Account> accList) {
        update accList;
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccCon(){
        return [Select Id,Name,Phone,Rating,(Select Id,FirstName,LastName From Contacts) From Account];
    } 

}