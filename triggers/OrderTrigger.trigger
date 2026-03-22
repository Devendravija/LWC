trigger OrderTrigger on Order__c (after insert, after update)  {
    List<Order_Event__e> events = new List<Order_Event__e>();

    for(Order__c ord : Trigger.new){

        String msg = Trigger.isInsert ? 'New Order Created' : 'Order Updated';

        Order_Event__e evt = new Order_Event__e(
            Order_Name__c = ord.Name,
            Customer_Name__c = ord.Customer_Name__c,
            Amount__c = ord.Amount__c,
            Status__c = ord.Status__c,
            Message__c = msg
        );

        events.add(evt);
    }

    if(!events.isEmpty()){
        EventBus.publish(events);
    }
}