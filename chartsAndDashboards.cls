public with sharing class chartsAndDashboards {

    @AuraEnabled(cacheable=true)
    public static List<Wrapper> getOpportunityRecord() {
        
        List<Wrapper> result = new List<Wrapper>();

        for (AggregateResult ar : [
            SELECT StageName stage, COUNT(Id) cnt
            FROM Opportunity
            GROUP BY StageName
        ]) {
            result.add(new Wrapper(
                (String)ar.get('stage'),
                (Integer)ar.get('cnt')
            ));
        }

        return result;
    }

    public class Wrapper {
        @AuraEnabled public String label;
        @AuraEnabled public Integer Count;

        public Wrapper(String label, Integer Count) {
            this.label = label;
            this.Count = Count;
        }
    }
}