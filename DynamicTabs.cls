public with sharing class DynamicTabs {
    
    @AuraEnabled(cacheable=true)
    public static List<String> getPicklistValues(String fieldApiName){
        Schema.DescribeFieldResult fieldDesc = 
            Opportunity.SObjectType.getDescribe()
            .fields.getMap().get(fieldApiName).getDescribe();

        List<String> values = new List<String>();
        for(Schema.PicklistEntry pe : fieldDesc.getPicklistValues()){
            values.add(pe.getLabel());
        }
        return values;
    }

    
    @AuraEnabled(cacheable=true)
    public static List<String> getFieldSetFields(String fieldSetName){
        List<String> fields = new List<String>();

        for(Schema.FieldSetMember f : 
            Opportunity.SObjectType.getDescribe()
            .fieldSets.getMap().get(fieldSetName).getFields()){
                fields.add(f.getFieldPath());
        }
        return fields;
    }

    
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getRecords(String fieldApiName, String value, List<String> fields){

    String query = 'SELECT Id, Name';

    for(String f : fields){
        query += ',' + f;
    }

    query += ' FROM Opportunity';

    // 🔥 Only apply filter if NOT "All"
    if(value != 'All Opportunities'){
        query += ' WHERE ' + fieldApiName + ' = :value';
    }

    return Database.query(query);
}

    
    @AuraEnabled
    public static void updateRecords(List<Opportunity> records){
        update records;
    }

    
    @AuraEnabled
    public static Id createRecord(Opportunity opp){
        insert opp;
        return opp.Id;
    }
}