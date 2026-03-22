public class getRecords {

    @AuraEnabled(cacheable=true)
    public static List<Account> getrecords1(){
        List<Account>la = [select id,name,numberofEmployees,Company_Email__c,Phone,Industry from  Account ];

        return la;
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getrecords2(Id accountId){
        List<Contact>lc = [select id,name,phone,email,account.name from  Contact where AccountId =:accountId ];

        return lc;
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> records(String searchName){
        List<Account>la = [select id,name,numberofEmployees from  Account Where name like :searchName +'%'];

        return la;
    }

    @AuraEnabled
    public static string Createrecord(String Name,Integer NumberOfEmployees){

        Account a = new Account();
        a.Name=Name;
        a.NumberOfEmployees=NumberOfEmployees;
        insert a;
        

        return a.Id;
    }
}