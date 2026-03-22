public with sharing class DashboardController {

    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getDashboardData(Integer yearVal) {

        Map<String, Object> result = new Map<String, Object>();

        // Stage Data
        List<AggregateResult> stageData = [
            SELECT StageName stage, COUNT(Id) cnt
            FROM Opportunity
            WHERE CALENDAR_YEAR(CloseDate) = :yearVal
            GROUP BY StageName
        ];

        // Type Data
        List<AggregateResult> typeData = [
            SELECT Type type, COUNT(Id) cnt
            FROM Opportunity
            WHERE CALENDAR_YEAR(CloseDate) = :yearVal
            GROUP BY Type
        ];

        // Monthly Data
        List<AggregateResult> monthData = [
            SELECT CALENDAR_MONTH(CloseDate) month, COUNT(Id) cnt
            FROM Opportunity
            WHERE CALENDAR_YEAR(CloseDate) = :yearVal
            GROUP BY CALENDAR_MONTH(CloseDate)
        ];

        result.put('stageData', stageData);
        result.put('typeData', typeData);
        result.put('monthData', monthData);

        return result;
    }
}