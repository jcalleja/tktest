describe('Controllers', function(){
    var scope;
    // load the controller's module
    beforeEach(module('ionic'));
    beforeEach(module('starter.controllers'));
    beforeEach(module('RESTConnection'));
    //Inject the scope and save it in a variable
    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        $controller('LoginCtrl', {$scope: scope});
    }));
    // tests start here
    it('should have a title with value of Login', function(){
        expect(scope.title).toEqual("Login");
    });
});