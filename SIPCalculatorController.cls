public with sharing class SIPCalculatorController {

    @AuraEnabled
    public static Id saveInvestment(String type, Decimal amount, Integer duration, Decimal rate,
                                    Decimal totalValue, Decimal invested, Decimal returns){

        Investment__c inv = new Investment__c(
            Investment_Name__c = type + ' Investment',
            Investment_Type__c = type,
            Investment_Amount__c = amount,
            Duration__c = duration,
            Rate__c = rate,
            Total_Value__c = totalValue,
            Invested_Amount__c = invested,
            Estimated_Return__c = returns
        );

        insert inv;
        return inv.Id;
    }
}