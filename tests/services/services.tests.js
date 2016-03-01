describe('Services', function(){
    var newArray;
    // load the controller's module
    beforeEach(module('ionic'));
  /*  beforeEach(module('starter.controllers'));
    beforeEach(module('RESTConnection'));
    beforeEach(module('SSFAlerts')); */
    beforeEach(module('SORTService'));
    //Inject the scope and save it in a variable
    beforeEach(inject(function(sortArray) {
        newArray = sortArray;
    }));
    // tests start here
    it('should return an array', function(){
        expect([2, 23, 15, 4, 30, 1]).toEqual([2, 23, 15, 4, 30, 1]);
    });
});