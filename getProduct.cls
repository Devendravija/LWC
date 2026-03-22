public with sharing class getProduct {
    
    @AuraEnabled(cacheable=true)
    public static List<String> getProductRecords() {
        List<Product2> lc = [select id,name,description,isActive from Product2];

        List<String> productNames = new List<String>();
        for(Product2 product : lc){
            productNames.add(product.name);
        }

        return productNames;
    }
}