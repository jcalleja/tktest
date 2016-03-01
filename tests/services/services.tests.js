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
        var newArray =[3, 1, 2];
        var sortedArray = [1, 2, 3];
        var sorted = newArrayObj.sortArray(newArray);
        expect(sortedArray).toEqual(sorted);
    });
});