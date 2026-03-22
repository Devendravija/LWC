public with sharing class plateformEvent_OrderDashboardController {
     @AuraEnabled(cacheable=true)
    public static List<Order_Log__c> getOrderLogs(){
        return [
            SELECT Id, Order_Name__c, Customer_Name__c, Amount__c, Message__c, Event_Time__c
            FROM Order_Log__c
            ORDER BY CreatedDate DESC
            LIMIT 50
        ];
    }
}