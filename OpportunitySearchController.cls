public with sharing class OpportunitySearchController {

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> searchOpportunities(
        String searchKey,
        Date fromDate,
        Date toDate
    ) {
        String query = 'SELECT Id, Name, StageName, CloseDate, Amount FROM Opportunity WHERE Id != null';

        if(String.isNotBlank(searchKey)){
            query += ' AND Name LIKE \'%' + String.escapeSingleQuotes(searchKey) + '%\'';
        }

        if(fromDate != null){
            query += ' AND CloseDate >= :fromDate';
        }
        if(toDate != null){
            query += ' AND CloseDate <= :toDate';
        }

        query += ' ORDER BY CreatedDate DESC LIMIT 200';

        return Database.query(query);
    }
}