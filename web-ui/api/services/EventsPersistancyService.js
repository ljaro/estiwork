/**
 * Created by luk on 2016-02-22.
 */

var EventsPersistancyService = {
    accept : function acceptService(msg){
      var content = msg.content.toString();

      Event.create(JSON.parse(content)).then(function(x){

      });
    }
}

module.exports = EventsPersistancyService;
