describe('Services', function(){
    var newArrayObj;
    // load the controller's module
    beforeEach(module('ionic'));
  /*  beforeEach(module('starter.controllers'));
    beforeEach(module('RESTConnection'));
    beforeEach(module('SSFAlerts')); */
    beforeEach(module('SORTServicesModule'));
    //Inject the scope and save it in a variable
    beforeEach(inject(function(SORTArrayService) {
        newArrayObj = SORTArrayService;
    }));
    // tests start here
    it('should return an array', function(){
        expect(newArrayObj.sortArray([1, 2, 3]).toEqual([1, 2, 3]))
    });
});