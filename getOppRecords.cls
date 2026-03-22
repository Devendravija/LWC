public with sharing class getOppRecords {
    @AuraEnabled
    public static List<Opportunity> getRecords(String pickName,String pick,List<String> fieldsList){
        String query= 'SELECT Id';
        for(String a:fieldsList){
            query+=','+a; 
        }
        query+=' FROM Opportunity ';

        if(pickName=='All Opportunities'){
            return Database.query(query);
        }
        
        query+= 'WHERE '+ pick +'='+'\'' +pickName + '\'';  

        return Database.query(query);
        
    }

    @AuraEnabled(cacheable=true)
    public static List<Map<String,String>> getFields(){
        Schema.DescribeSObjectResult sObjectResult = Schema.getGlobalDescribe().get('Opportunity').getDescribe();
        Schema.FieldSet fieldSet = sObjectResult.fieldsets.getMap().get('FieldSetOpp');
        
        List<Map<String,String>> list1 = new List<Map<String,String>>();
        List<Schema.FieldSetMember> l1 = fieldSet.getFields();
        for(Schema.FieldSetMember s : l1){
            Map<String,String> m1 = new Map<String,String>();
            Boolean a = sObjectResult.fields.getMap().get(s.getFieldPath()).getDescribe().isUpdateable();
            m1.put('fieldName',s.getFieldPath());
            m1.put('isUpdateable',String.valueOf(a));
            list1.add(m1);
        }
        return (list1);
    }
    @AuraEnabled(cacheable=true)
    public static Map<String,Boolean> getFields2(List<String> fields){
        Map<String,Boolean> map1= new Map<String,Boolean>();
        Schema.DescribeSObjectResult sObjectResult = Schema.getGlobalDescribe().get('Opportunity').getDescribe();

        for(String s : fields){
            Boolean a = sObjectResult.fields.getMap().get(s).getDescribe().isUpdateable();
            map1.put(s,a);
        }
        
        return map1;
    }

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities(){
        return [SELECT Id,Name,StageName,Amount FROM Opportunity];
    }

    @AuraEnabled
    public static void updateOpp(Id oppId , String Stage){
        
        Opportunity o =new Opportunity(Id = oppId,StageName = Stage);
        if(Stage == 'Open'){
            o.StageName = 'Prospecting';
            
        }
        Database.update(o);
    }
    @AuraEnabled
    public static void updateOppRecords(Id oppId, String oppName,Integer oppAmount){
        Opportunity o = new Opportunity(Id = oppId , Name = oppName , Amount = oppAmount);
        Database.update(o);
    }
}