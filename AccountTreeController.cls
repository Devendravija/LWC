public with sharing class AccountTreeController {

    public class AccountWrapper {
        @AuraEnabled public Id Id;
        @AuraEnabled public String Name;
        @AuraEnabled public String Industry;
        @AuraEnabled public List<AccountWrapper> children;
    }

    @AuraEnabled(cacheable=true)
    public static List<AccountWrapper> getAccountHierarchy() {

        List<Account> accList = [
            SELECT Id, Name, Industry, ParentId
            FROM Account
            ORDER BY Name
            LIMIT 100
        ];

        Map<Id, List<Account>> childMap = new Map<Id, List<Account>>();

        for (Account acc : accList) {
            if (acc.ParentId != null) {
                if (!childMap.containsKey(acc.ParentId)) {
                    childMap.put(acc.ParentId, new List<Account>());
                }
                childMap.get(acc.ParentId).add(acc);
            }
        }

        List<AccountWrapper> result = new List<AccountWrapper>();

        for (Account acc : accList) {
            if (acc.ParentId == null) {
                result.add(buildTree(acc, childMap));
            }
        }

        return result;
    }

    private static AccountWrapper buildTree(Account acc, Map<Id, List<Account>> childMap) {

        AccountWrapper wrap = new AccountWrapper();
        wrap.Id = acc.Id;
        wrap.Name = acc.Name;
        wrap.Industry = acc.Industry;
        wrap.children = new List<AccountWrapper>();

        if (childMap.containsKey(acc.Id)) {
            for (Account child : childMap.get(acc.Id)) {
                wrap.children.add(buildTree(child, childMap));
            }
        }

        return wrap;
    }
}