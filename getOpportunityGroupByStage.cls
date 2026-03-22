public with sharing class getOpportunityGroupByStage {
    
    @AuraEnabled(cacheable=true)
    public static Map<String, List<Opportunity>> getOpportunityGroupByStageName(){
        Map<String, List<Opportunity>> map1 = new Map<String, List<Opportunity>>();

        for(Opportunity opp :[Select Id,Name,CloseDate,StageName,Amount,Email   __c from Opportunity Order By Amount DESC]){
            if(map1.containsKey(opp.StageName)){
                map1.get(opp.StageName).add(opp);
            }else{
                map1.put(opp.StageName,new List<Opportunity>{opp});
            }
        }
        System.debug(map1);

        return map1;
    }

    @AuraEnabled
    public static void deleteOpportunity(Id oppId){
        delete [Select Id from Opportunity where Id =:oppId];
    }

    @AuraEnabled
    public static void updateOpportunity(Opportunity opp) {
        update opp;
    }
}