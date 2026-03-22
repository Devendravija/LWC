public with sharing class CustomTableController {

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [
            SELECT Id, Name, Industry
            FROM Account
            LIMIT 20
        ];
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getIndustryPicklist() {
        List<String> values = new List<String>();
        Schema.DescribeFieldResult fieldResult = Account.Industry.getDescribe();

        for (Schema.PicklistEntry entry : fieldResult.getPicklistValues()) {
            values.add(entry.getLabel());
        }
        return values;
    }

    // ✅ Update Records
    @AuraEnabled
public static void updateAccounts(List<Account> accList) {
    if(accList == null || accList.isEmpty()){
        return;
    }
    update accList;
}
}