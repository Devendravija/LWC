public with sharing class getOrders {

    @AuraEnabled(cacheable=true)
    public static List<Order__c> getOrdersC(){
        List<Order__c> lc=[select Name,Customer_Name__c,Product__c,Quantity__c,createdDate from Order__c];
        return lc;
    }
    
    @AuraEnabled(cacheable=true)
    public static Integer getOrders() {
        Integer lc = [select count() from Order__c];
        return lc;
    }
}