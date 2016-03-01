describe('Services', function(){
    var scope;
    // load the controller's module
    beforeEach(module('ionic'));
  /*  beforeEach(module('starter.controllers'));
    beforeEach(module('RESTConnection'));
    beforeEach(module('SSFAlerts')); */
    beforeEach(module('SORTService'));
    //Inject the scope and save it in a variable
    beforeEach(inject(function($rootScope, service) {
        scope = $rootScope.$new();
        $service('sortArray', {$scope: scope});
    }));
    // tests start here
    it('should return an array', function(){
        expect(a).toEqual([2, 23, 15, 4, 30, 1]);
    });
});