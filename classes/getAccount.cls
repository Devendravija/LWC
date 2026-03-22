public with sharing class getAccount {
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccount(){
        return [SELECT ID,Name,NumberOfEmployees,Phone,Owner.Name,BillingCity,(SELECT ID,Name,NumberOfEmployees,Phone,Owner.Name,BillingCity From ChildAccounts) From Account];
    }
}